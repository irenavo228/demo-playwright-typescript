import { Page } from '@playwright/test';
import { readTestDataCsv } from './helpers';
import { loginRegistry, homeRegistry } from './keywords';

interface TestStep {
  action: string;
  parameters: Record<string, string>;
}

interface TestData {
  Code: string;
  Scenario: string;
  Steps: string;
}

export class TestRunner {
  private page: Page;
  private allRegistries: Record<string, any>;

  constructor(page: Page) {
    this.page = page;
    this.allRegistries = {
      ...loginRegistry,
      ...homeRegistry
    };
  }

  /**
   * Parse parameters from string format: key1=value1&key2=value2
   */
  private parseParameters(paramString: string): Record<string, string> {
    if (!paramString) return {};
    
    const params: Record<string, string> = {};
    const pairs = paramString.split('&');
    
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[key.trim()] = decodeURIComponent(value.trim());
      }
    }
    
    return params;
  }

  /**
   * Parse a single step from format: "Action|param1=value1&param2=value2"
   */
  private parseStep(stepString: string): TestStep | null {
    if (!stepString.trim()) return null;
    
    const [action, paramString] = stepString.split('|');
    
    return {
      action: action.trim(),
      parameters: this.parseParameters(paramString || '')
    };
  }

  /**
   * Parse all steps from the Steps column format: "Step1|params;Step2|params"
   */
  private parseSteps(stepsString: string): TestStep[] {
    if (!stepsString) return [];
    
    return stepsString
      .split(';')
      .map(step => this.parseStep(step))
      .filter((step): step is TestStep => step !== null);
  }

  /**
   * Execute a single test step using the appropriate keyword
   */
  async executeStep(step: TestStep): Promise<void> {
    const { action, parameters } = step;
    const keyword = this.allRegistries[action];

    if (!keyword) {
      throw new Error(`Keyword '${action}' not found in registry`);
    }

    try {
      // Execute keyword with page and parameters
      if (Object.keys(parameters).length > 0) {
        await keyword(this.page, parameters);
      } else {
        await keyword(this.page);
      }
      
      console.log(`✅ Executed: ${action}`, parameters);
    } catch (error) {
      console.error(`❌ Failed to execute: ${action}`, parameters, error);
      throw error;
    }
  }

  /**
   * Execute all steps for a test scenario
   */
  async executeTestScenario(testData: TestData): Promise<void> {
    const { Code, Scenario, Steps } = testData;
    
    console.log(`🚀 Executing Test: ${Code} - ${Scenario}`);
    
    const steps = this.parseSteps(Steps);
    
    if (steps.length === 0) {
      console.log(`⚠️ No steps found for test ${Code}`);
      return;
    }

    for (const step of steps) {
      await this.executeStep(step);
      // Small delay between steps for stability
      await this.page.waitForTimeout(500);
    }
    
    console.log(`✅ Completed Test: ${Code} - ${Scenario}`);
  }

  /**
   * Load test data from CSV file
   */
  static loadTestData(csvFilePath: string): TestData[] {
    return readTestDataCsv(csvFilePath) as TestData[];
  }

  /**
   * Execute all test scenarios from CSV file
   */
  async executeAllTests(csvFilePath: string): Promise<void> {
    const testDataList = TestRunner.loadTestData(csvFilePath);
    
    for (const testData of testDataList) {
      await this.executeTestScenario(testData);
    }
  }

  /**
   * Execute a specific test by code
   */
  async executeTestByCode(csvFilePath: string, testCode: string): Promise<void> {
    const testDataList = TestRunner.loadTestData(csvFilePath);
    const testData = testDataList.find(test => test.Code === testCode);
    
    if (!testData) {
      throw new Error(`Test with code '${testCode}' not found in ${csvFilePath}`);
    }
    
    await this.executeTestScenario(testData);
  }

  /**
   * Get available test codes from CSV file
   */
  static getAvailableTests(csvFilePath: string): string[] {
    const testDataList = TestRunner.loadTestData(csvFilePath);
    return testDataList.map(test => `${test.Code}: ${test.Scenario}`);
  }
}
