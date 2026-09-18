const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to login
  await page.goto('http://localhost:5174/login');
  
  // Fill login form
  await page.type('input[type="text"]', '4654321099'); // Taha Rukaiya NID
  await page.type('input[type="password"]', 'password123'); // assuming standard password
  await page.click('button[type="submit"]');
  
  // Wait for dashboard to load
  await page.waitForNavigation();
  
  // Go to Hirer Dashboard if not already there
  await page.goto('http://localhost:5174/dashboard');
  await page.waitForSelector('button');
  
  // Find "View Applicants" button and click it
  const buttons = await page.('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('View Applicants')) {
      console.log('Clicking View Applicants...');
      await btn.click();
      break;
    }
  }
  
  // Wait a moment for rendering
  await new Promise(r => setTimeout(r, 2000));
  
  // Extract text from the page to see if it crashed
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Page Text:', bodyText);
  
  await browser.close();
})();