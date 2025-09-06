const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * ElevateCRM Demo Screenshot Automation
 * Captures screenshots of demo sections for documentation
 */

// Configuration from environment variables
const config = {
  baseUrl: process.env.BASE_URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  outDir: process.env.OUT_DIR || './screenshots',
  headless: process.env.HEADLESS !== 'false'
};

// Screenshot mapping configuration
const screenshots = [
  { filename: '01_Dashboard.png', selector: '#dashboard', description: 'Dashboard Overview' },
  { filename: '02_LeadFlow.png', selector: '#leads', description: 'Lead Flow Management' },
  { filename: '03_Inventory_Item.png', selector: '#inventory', description: 'Inventory Management' },
  { filename: '04_Order_Flow.png', selector: '#orders', description: 'Order Flow Processing' },
  { filename: '05_Barcode_QR_Scan.png', selector: '#barcode', description: 'Barcode/QR Scanner' },
  { filename: '06_Mobile_Scan_Phone.png', selector: '#barcode', description: 'Mobile Scanner View', mobile: true },
  { filename: '07_SOP_OnePager.png', selector: '#sop, #sop-onepager', description: 'SOP One Pager', optional: true }
];

// Login selectors to try in order
const loginSelectors = {
  username: [
    'input[name="login"]',
    'input[name="username"]', 
    'input[name="email"]',
    'input#login',
    'input#username'
  ],
  password: [
    'input[type="password"]',
    'input[name="password"]',
    'input#password'
  ],
  submit: [
    'button[type="submit"]',
    'button[type="button"]',
    'input[type="submit"]',
    'button#login'
  ]
};

/**
 * Create output directory if it doesn't exist
 */
function ensureOutputDir() {
  if (!fs.existsSync(config.outDir)) {
    fs.mkdirSync(config.outDir, { recursive: true });
    console.log(`✓ Created output directory: ${config.outDir}`);
  }
}

/**
 * Wait for selector with timeout
 */
async function waitForSelector(page, selector, timeout = 6000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Attempt login with provided credentials
 */
async function attemptLogin(page) {
  if (!config.username || !config.password) {
    console.log('⏭️  No credentials provided, skipping login');
    return true;
  }

  console.log('🔐 Attempting login...');

  try {
    // Try to find username input
    let usernameInput = null;
    for (const selector of loginSelectors.username) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        usernameInput = selector;
        break;
      } catch (e) {
        continue;
      }
    }

    if (!usernameInput) {
      console.log('⚠️  Username input not found, proceeding without login');
      return true;
    }

    // Try to find password input
    let passwordInput = null;
    for (const selector of loginSelectors.password) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        passwordInput = selector;
        break;
      } catch (e) {
        continue;
      }
    }

    if (!passwordInput) {
      console.log('⚠️  Password input not found, proceeding without login');
      return true;
    }

    // Fill in credentials
    await page.type(usernameInput, config.username);
    await page.type(passwordInput, config.password);

    console.log('✓ Credentials entered');

    // Try to find and click submit button
    let submitButton = null;
    for (const selector of loginSelectors.submit) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        submitButton = selector;
        break;
      } catch (e) {
        continue;
      }
    }

    if (!submitButton) {
      console.log('⚠️  Submit button not found, proceeding without login');
      return true;
    }

    // Click submit and wait for navigation or known selector
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 }).catch(() => {}),
      page.click(submitButton)
    ]);

    console.log('✓ Login attempted successfully');
    return true;

  } catch (error) {
    console.log(`⚠️  Login attempt failed: ${error.message}`);
    return true; // Continue anyway
  }
}

/**
 * Navigate to section by clicking navigation button
 */
async function navigateToSection(page, sectionId) {
  try {
    const navButton = `button[data-section="${sectionId.replace('#', '')}"]`;
    const buttonExists = await waitForSelector(page, navButton, 2000);
    
    if (buttonExists) {
      await page.click(navButton);
      await page.waitForTimeout(1000); // Allow transition
      console.log(`✓ Navigated to section: ${sectionId}`);
      return true;
    }
  } catch (error) {
    console.log(`⚠️  Could not navigate to section ${sectionId}: ${error.message}`);
  }
  return false;
}

/**
 * Capture screenshot of element or full page
 */
async function captureScreenshot(page, screenshotConfig) {
  const { filename, selector, description, mobile, optional } = screenshotConfig;
  const filepath = path.join(config.outDir, filename);

  try {
    console.log(`📸 Capturing: ${description}...`);

    // Handle mobile emulation
    if (mobile) {
      const iPhone12 = puppeteer.devices['iPhone 12'];
      await page.emulate(iPhone12);
      await page.waitForTimeout(1000);
      console.log('📱 Emulating iPhone 12 for mobile screenshot');
    }

    // Navigate to section if needed
    const sectionId = selector.split(',')[0].trim();
    await navigateToSection(page, sectionId);

    // Wait for selector
    const elementExists = await waitForSelector(page, selector);

    if (elementExists) {
      // Try element screenshot first
      try {
        const element = await page.$(selector);
        if (element) {
          await element.screenshot({ 
            path: filepath,
            type: 'png'
          });
          console.log(`✓ Element screenshot saved: ${filename}`);
          return filepath;
        }
      } catch (elementError) {
        console.log(`⚠️  Element screenshot failed for ${filename}, trying full page`);
      }
    }

    // Fallback to full page screenshot
    if (!optional || elementExists) {
      await page.screenshot({ 
        path: filepath,
        type: 'png',
        fullPage: true
      });
      console.log(`✓ Full page screenshot saved: ${filename}`);
      return filepath;
    } else {
      console.log(`⏭️  Optional screenshot skipped: ${filename} (selector not found)`);
      return null;
    }

  } catch (error) {
    if (optional) {
      console.log(`⏭️  Optional screenshot skipped: ${filename} (${error.message})`);
      return null;
    } else {
      console.log(`❌ Screenshot failed: ${filename} (${error.message})`);
      throw error;
    }
  }
}

/**
 * Main automation function
 */
async function runScreenshotAutomation() {
  // Validate required configuration
  if (!config.baseUrl) {
    console.error('❌ BASE_URL environment variable is required');
    process.exit(1);
  }

  console.log('🚀 Starting ElevateCRM screenshot automation');
  console.log(`📍 Base URL: ${config.baseUrl}`);
  console.log(`📁 Output directory: ${config.outDir}`);
  console.log(`🖥️  Headless mode: ${config.headless}`);

  let browser;
  let savedFiles = [];

  try {
    // Ensure output directory exists
    ensureOutputDir();

    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: config.headless,
      defaultViewport: { width: 1200, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to base URL
    console.log(`🔗 Navigating to: ${config.baseUrl}`);
    await page.goto(config.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Attempt login if credentials provided
    await attemptLogin(page);

    // Navigate back to base URL after login
    await page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);

    // Reset viewport for desktop screenshots
    await page.setViewport({ width: 1200, height: 800 });

    console.log('📸 Starting screenshot capture...');

    // Capture all screenshots
    for (const screenshotConfig of screenshots) {
      try {
        // Reset mobile emulation for each screenshot
        if (!screenshotConfig.mobile) {
          await page.setViewport({ width: 1200, height: 800 });
        }

        const savedPath = await captureScreenshot(page, screenshotConfig);
        if (savedPath) {
          savedFiles.push(savedPath);
        }

        // Small delay between screenshots
        await page.waitForTimeout(1000);

      } catch (error) {
        console.error(`❌ Failed to capture ${screenshotConfig.filename}: ${error.message}`);
        // Continue with next screenshot
      }
    }

  } catch (error) {
    console.error(`❌ Automation failed: ${error.message}`);
    throw error;

  } finally {
    // Close browser
    if (browser) {
      await browser.close();
      console.log('🔚 Browser closed');
    }
  }

  // Print summary
  console.log('\n📊 Screenshot Summary:');
  console.log(`✓ Total screenshots captured: ${savedFiles.length}`);
  
  if (savedFiles.length > 0) {
    console.log('\n📁 Saved files:');
    savedFiles.forEach(file => {
      console.log(`   ${path.resolve(file)}`);
    });
  }

  console.log('\n🎉 Screenshot automation completed successfully!');
}

// Run automation if called directly
if (require.main === module) {
  runScreenshotAutomation().catch(error => {
    console.error('❌ Automation failed:', error);
    process.exit(1);
  });
}

module.exports = { runScreenshotAutomation };
