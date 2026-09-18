const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Users\\Taha\\.cache\\puppeteer\\chrome\\win64-152.0.7977.75\\chrome-win64\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174/login');
  
  await page.type('input[type="text"]', '4654321099');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation();
  
  await page.goto('http://localhost:5174/dashboard');
  await page.waitForSelector('button');
  
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('View Applicants')) {
      console.log('Clicking View Applicants...');
      await btn.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Page Text:', bodyText);
  
  await browser.close();
})();
