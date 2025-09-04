import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { google } from 'googleapis';
import { DateTime } from 'luxon';
import * as mysql from 'mysql2/promise';
import * as sql from 'mssql';
import { Page } from 'playwright';

// Type definitions
interface CsvRecord {
  no: string;
  [key: string]: string;
}

interface ConfigData {
  [env: string]: any;
}

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface GoogleSheetsCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

interface EnvironmentMapping {
  [key: string]: [string, string];
}

export function handleNone(value: string): string | null {
  return value === 'null' ? null : value;
}

export function readCsv(filePath: string): CsvRecord[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const records = parse(content, { columns: true, skip_empty_lines: true }) as CsvRecord[];
  records.sort((a, b) => parseInt(a.no) - parseInt(b.no));
  return records;
}

export function readTestDataCsv(filePath: string): any[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const records = parse(content, { columns: true, skip_empty_lines: true });
  return records;
}

export function readJson(filePath: string): any[] {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return Array.isArray(data) ? data : [data];
}

export function getFullPath(relativePath: string): string {
  return path.resolve(__dirname, relativePath);
}

export function colToLetter(colIndex: number): string {
  let letter = '';
  while (colIndex > 0) {
    const remainder = (colIndex - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    colIndex = Math.floor((colIndex - 1) / 26);
  }
  return letter;
}

export function loadConfig(relativePath: string, env: string): ConfigData {
  const fullPath = getFullPath(relativePath);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  return data[env] || {};
}

export async function setZoom(page: Page, ratio: string = '0.8'): Promise<void> {
  await page.evaluate((zoomRatio) => {
    document.body.style.zoom = zoomRatio;
  }, ratio);
}

export async function writeTestResults(
  env: string, 
  module: string, 
  code: string, 
  result: string
): Promise<void> {
  console.log(__dirname); 
  const credsPath = path.join(__dirname, 'google-sheets-key.json');
  const credentials: GoogleSheetsCredentials = require(credsPath);
  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  const auth = new google.auth.GoogleAuth({ credentials, scopes });
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1Xp4x67JuX6ldv36dE5JUgQkT8kENn655jIbnds9SkZw';
  const sheet = module;
  
  const getRows = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheet}`
  });
  
  const rows = getRows.data.values;
  if (!rows || rows.length < 8) return; // Not enough data
  
  const headers = Array.from(new Set(rows[6])) as string[]; // Header row (row 7, index 6)
  const records = rows.slice(7); // Data rows start from row 8 (index 7)

  const envMapping: EnvironmentMapping = {
    local: ['LOCALResult', 'LOCALDate'],
    sit: ['SITResult', 'SITDate'],
    uat: ['UATResult', 'UATDate'],
    prod: ['PRODResult', 'PRODDate'],
  };
  
  const [lblResult, lblDate] = envMapping[env] || envMapping['local'];
  const idxResult = headers.indexOf(lblResult);
  const idxDate = headers.indexOf(lblDate);
  const idxCode = headers.indexOf('Code');
  
  if (idxResult === -1 || idxDate === -1 || idxCode === -1) return;

  const colLetterResult = colToLetter(idxResult + 1);
  const colLetterDate = colToLetter(idxDate + 1);
  const currentDate = DateTime.now().toFormat('yyyy-MM-dd');

  for (let i = 0; i < records.length; ++i) {
    const record = records[i];
    if (record[idxCode] === code) {
      const rowNum = i + 8; // Sheet row number (1-based)
      const prevResult = record[idxResult];
      const prevDate = record[idxDate];
      
      if (prevResult === 'PASSED' && prevDate === currentDate) return; // No update needed
      
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'RAW',
          data: [
            {
              range: `${sheet}!${colLetterResult}${rowNum}`,
              values: [[result]]
            },
            {
              range: `${sheet}!${colLetterDate}${rowNum}`,
              values: [[currentDate]]
            }
          ]
        }
      });
      break;
    }
  }
}

export async function executeQuery(
  type: 'mysql' | 'mssql',
  host: string,
  port: number,
  usr: string,
  pwd: string,
  db: string,
  q: string
): Promise<any> {
  if (type === 'mysql') {
    const conn = await mysql.createConnection({ 
      host: host, 
      port: port, 
      user: usr, 
      password: pwd, 
      database: db 
    });
    const rows = await conn.execute(q);
    await conn.end();
    return rows;
  } else if (type === 'mssql') {
    const conn = await sql.connect({ 
      server: host, 
      port: port, 
      user: usr, 
      password: pwd, 
      database: db, 
      options: { trustServerCertificate: true } 
    });
    const rows = await conn.request().query(q);
    await conn.close();
    return rows.recordset;
  } else {
    throw new Error('Unsupported DB type');
  }
}
