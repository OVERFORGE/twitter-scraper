import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://twitter.com/search?q=web3&f=live");
  await page.waitForTimeout(5000);

  console.log("Page loaded");

  await browser.close();
})();
