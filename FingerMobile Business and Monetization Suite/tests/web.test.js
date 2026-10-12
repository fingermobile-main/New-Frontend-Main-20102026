// Web testing with Puppeteer
const puppeteer = require('puppeteer');

describe('FingerMobile Web Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('loads the frontend application', async () => {
    await page.goto('http://localhost:3000');
    const title = await page.title();
    expect(title).toBeDefined();
  }, 30000); // 30 second timeout

  test('connects to backend API', async () => {
    const response = await page.goto('http://localhost:3003/health');
    expect(response.status()).toBe(200);
  }, 30000);
});
