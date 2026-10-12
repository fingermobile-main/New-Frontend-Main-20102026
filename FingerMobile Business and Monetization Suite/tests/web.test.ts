
import puppeteer from 'puppeteer';

describe('Frontend Integration Tests', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ 
      headless: false, // Set to true in CI environments
      args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should load the homepage successfully', async () => {
    await page.goto('http://localhost:3000');
    const title = await page.title();
    expect(title).toBeDefined();
    console.log('Page title:', title);
  });

  test('should connect to backend API', async () => {
    // Test backend health endpoint
    const response = await page.goto('http://localhost:3003/health');
    const status = await response?.json();
    expect(status).toHaveProperty('status');
    console.log('Backend status:', status);
  });
});

