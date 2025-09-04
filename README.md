# Test Configuration Guide

This document explains how to run tests with different configurations for environment, browser, and headless modes.

## 📋 Environment Configuration

The test framework supports multiple environments through configuration files and environment variables.

### Available Environments:
- **local** (default): https://www.demoblaze.com
- **sit**: System Integration Testing environment
- **uat**: User Acceptance Testing environment  
- **prod**: Production environment

### Configuration File:
npm init playwright@latest

Inside that directory, you can run several commands:

  npx playwright test
    Runs the end-to-end tests.

  npx playwright test --ui
    Starts the interactive UI mode.

  npx playwright test --project=chromium
    Runs the tests only on Desktop Chrome.

  npx playwright test example
    Runs the tests in a specific file.

  npx playwright test --debug
    Runs the tests in debug mode.

  npx playwright codegen
    Auto generate tests with Codegen.

We suggest that you begin by typing:

    npx playwright test


npm install --save-dev @types/luxon @types/mysql @types/mssql cross-env @types/dotenv
npm install csv-parse googleapis luxon mysql2 mssql dotenv