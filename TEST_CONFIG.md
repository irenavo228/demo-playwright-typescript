
1. Copy `env.example` to `.env`
2. Update values as needed:

```bash
# Environment (local, sit, uat, prod)
TEST_ENV=local

# Browser selection (all, chromium, firefox, webkit, edge, mobile)
BROWSER=all

# Headless mode (true/false)
HEADLESS=true

# Environment URLs
SIT_URL=https://sit.demoblaze.com
UAT_URL=https://uat.demoblaze.com
PROD_URL=https://www.demoblaze.com
```

## 🌐 Browser Configuration

### Available Browsers:
- **chromium** (Chrome)
- **firefox** 
- **webkit** (Safari)
- **edge** (Microsoft Edge)
- **mobile** (Mobile Chrome + Safari)
- **mobile-chrome** 
- **mobile-safari**
- **all** (Chromium, Firefox, Webkit)

## 🎯 NPM Scripts

### Basic Test Commands:
```bash
npm test                    # Run all tests (default config)
npm run test:ui            # Run tests with Playwright UI
npm run test:login         # Run login tests only
npm run test:home          # Run home tests only
```

### Environment-based Commands:
```bash
npm run test:env:local     # Run tests on LOCAL environment
npm run test:env:sit       # Run tests on SIT environment  
npm run test:env:uat       # Run tests on UAT environment
npm run test:env:prod      # Run tests on PROD environment
```

### Browser-specific Commands:
```bash
npm run test:browser:chrome     # Run tests on Chrome only
npm run test:browser:firefox    # Run tests on Firefox only
npm run test:browser:safari     # Run tests on Safari only
npm run test:browser:edge       # Run tests on Edge only
npm run test:browser:mobile     # Run tests on mobile browsers
npm run test:browser:all        # Run tests on all browsers
```

### Headless/Headed Commands:
```bash
npm run test:headed        # Run tests with browser UI visible
npm run test:headless      # Run tests in headless mode
```

### Combined Commands:
```bash
# Environment + Browser + Mode combinations
npm run test:local:chrome:headed    # LOCAL + Chrome + Headed
npm run test:local:firefox:headed   # LOCAL + Firefox + Headed  
npm run test:local:safari:headed    # LOCAL + Safari + Headed

# Environment + Browser for different environments
npm run test:sit:chrome      # SIT + Chrome
npm run test:uat:chrome      # UAT + Chrome  
npm run test:prod:chrome     # PROD + Chrome
```

### Smoke Tests:
```bash
npm run test:smoke:local    # Quick smoke tests on LOCAL (C001 + C004)
npm run test:smoke:sit      # Quick smoke tests on SIT
npm run test:smoke:uat      # Quick smoke tests on UAT
```

### Mobile Testing:
```bash
npm run test:mobile:local   # Mobile tests on LOCAL
npm run test:mobile:sit     # Mobile tests on SIT
```

### Debug & Reporting:
```bash
npm run test:debug         # Debug mode (headed + chromium + debug tools)
npm run test:trace         # View test traces
npm run test:report        # View test report
```

### CSV Test Specific:
```bash
npm run test:csv           # Run all CSV-driven tests
npm run test:csv-login     # Run CSV login tests
npm run test:csv-home      # Run CSV home tests

npm run test:c001          # Run specific test C001
npm run test:c002          # Run specific test C002
npm run test:c003          # Run specific test C003
npm run test:c004          # Run specific test C004
npm run test:c005          # Run specific test C005

npm run test:execute-all   # Run "Execute All" tests
```

## 🚀 Advanced Usage

### Custom Environment Variables:
You can set environment variables directly when running tests:

```bash
# Windows PowerShell
$env:TEST_ENV="sit"; $env:BROWSER="chrome"; $env:HEADLESS="false"; npm test

# Linux/Mac
TEST_ENV=sit BROWSER=chrome HEADLESS=false npm test
```

### CI/CD Integration:
```bash
# Example CI pipeline commands
TEST_ENV=uat BROWSER=chromium npm test                    # UAT testing
TEST_ENV=prod BROWSER=all npm run test:smoke:prod        # Production smoke tests
```

## 📊 Test Reports

Test results are automatically generated in multiple formats:
- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results-{ENV}-{timestamp}.json`
- **JUnit Report**: `test-results/results-{ENV}.xml`

## 🔧 Configuration Details

The configuration automatically:
- ✅ Sets appropriate base URLs for each environment
- ✅ Configures browser selection dynamically
- ✅ Enables/disables headless mode
- ✅ Sets up proper timeouts and retries
- ✅ Configures screenshots and video recording on failures
- ✅ Enables trace collection for debugging

## 📋 Examples

```bash
# Development - Run login tests in Chrome with browser visible
npm run test:local:chrome:headed -- --grep="login"

# Testing - Run all tests on SIT environment  
npm run test:env:sit

# Production validation - Quick smoke test
npm run test:smoke:prod

# Mobile testing - Test on mobile browsers locally
npm run test:mobile:local

# Debugging - Run with debug tools
npm run test:debug -- --grep="C001"
```

This configuration provides maximum flexibility for running tests across different environments, browsers, and modes while maintaining the pure CSV-driven approach.
