import { test } from '@playwright/test';
import { TestRunner } from '../utils/testRunner';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const ENV = process.env.TEST_ENV || 'local';
const LOGIN_DATA_PATH = path.resolve(__dirname, `../data/${ENV}/login.data.csv`);

test.describe('CSV-Driven Login Tests', () => {
  let testRunner: TestRunner;

  test.beforeEach(async ({ page }) => {
    testRunner = new TestRunner(page);
    await page.goto('/'); 
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
  });

  test('Execute All Login Tests from CSV', async ({ page }) => {
    await testRunner.executeAllTests(LOGIN_DATA_PATH);
  });
});