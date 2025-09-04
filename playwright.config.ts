import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Environment configuration
const ENV = process.env.TEST_ENV || 'local';
const BROWSER = process.env.BROWSER || 'chrome';
const HEADLESS = process.env.HEADLESS !== 'false'; // default to headless unless explicitly set to false

// Base URLs for different environments
const baseUrls = {
  local: 'https://www.demoblaze.com',
  sit: process.env.SIT_URL || 'https://sit.demoblaze.com',
  uat: process.env.UAT_URL || 'https://uat.demoblaze.com',
  prod: process.env.PROD_URL || 'https://www.demoblaze.com'
};

console.log(`🚀 Running tests with:`);
console.log(`   Environment: ${ENV}`);
console.log(`   Base URL: ${baseUrls[ENV] || baseUrls.local}`);
console.log(`   Browser: ${BROWSER}`);
console.log(`   Headless: ${HEADLESS}`);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: `test-results/results-${ENV}-${Date.now()}.json` }],
    ['junit', { outputFile: `test-results/results-${ENV}.xml` }]
  ],
  /* Global timeout */
  timeout: 60000,
  /* Global expect timeout */
  expect: {
    timeout: 10000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseUrls[ENV] || baseUrls.local,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video recording */
    video: 'retain-on-failure',
    
    /* Headless mode */
    headless: HEADLESS,
    
    /* Viewport settings */
    viewport: { width: 1280, height: 720 },
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    
    /* Action timeout */
    actionTimeout: 15000,
    
    /* Navigation timeout */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: (() => {
    const allProjects = [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit', 
        use: { ...devices['Desktop Safari'] },
      },
      {
        name: 'edge',
        use: { ...devices['Desktop Edge'], channel: 'msedge' },
      },
      {
        name: 'mobile-chrome',
        use: { ...devices['Pixel 5'] },
      },
      {
        name: 'mobile-safari',
        use: { ...devices['iPhone 12'] },
      },
    ];

    // Filter projects based on BROWSER environment variable
    if (BROWSER === 'all') {
      return allProjects.slice(0, 3); // chromium, firefox, webkit
    } else if (BROWSER === 'chromium' || BROWSER === 'chrome') {
      return [allProjects[0]]; // chromium only
    } else if (BROWSER === 'firefox') {
      return [allProjects[1]]; // firefox only
    } else if (BROWSER === 'webkit' || BROWSER === 'safari') {
      return [allProjects[2]]; // webkit only
    } else if (BROWSER === 'edge') {
      return [allProjects[3]]; // edge only
    } else if (BROWSER === 'mobile') {
      return [allProjects[4], allProjects[5]]; // mobile browsers
    } else if (BROWSER === 'mobile-chrome') {
      return [allProjects[4]]; // mobile chrome only
    } else if (BROWSER === 'mobile-safari') {
      return [allProjects[5]]; // mobile safari only
    } else {
      return allProjects.slice(0, 3); // default to desktop browsers
    }
  })(),

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
