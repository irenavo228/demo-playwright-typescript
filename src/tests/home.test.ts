import { test } from '@playwright/test';
import { TestRunner } from '../utils/testRunner';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const ENV = process.env.TEST_ENV || 'local';
const HOME_DATA_PATH = path.resolve(__dirname, `../data/${ENV}/home.data.csv`);

test.describe('CSV-Driven Home Tests', () => {
  let testRunner: TestRunner;

  test.beforeEach(async ({ page }) => {
    testRunner = new TestRunner(page);
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
  });

  test('Execute All Home Tests from CSV', async ({ page }) => {
    await testRunner.executeAllTests(HOME_DATA_PATH);
  });
});