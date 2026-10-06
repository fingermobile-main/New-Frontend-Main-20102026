import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:3000/onboarding');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({path: 'step1_welcome.png'});
  
  // click welcome
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Get Started'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({path: 'step2_terms.png'});
  
  // force terms accepted
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Continue'));
    if (btn && !btn.disabled) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({path: 'step3_registration.png'});
  
  // enter details and continue
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    if (inputs.length > 0) {
      inputs[0].value = 'test@example.com';
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    }
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Continue'));
    if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({path: 'step4_after_registration.png'});
  
  await browser.close();
})();
