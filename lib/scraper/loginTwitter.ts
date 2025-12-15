import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const COOKIES_PATH = path.join(process.cwd(), "cookies", "twitter.json");

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100, 
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
    locale: "en-US",
  });

  const page = await context.newPage();

  console.log("Opening Twitter login page...");

  await page.goto("https://twitter.com/i/flow/login", {
    waitUntil: "domcontentloaded",
  });

  console.log("Log in manually like a normal user.");
  console.log("If Twitter asks for phone/email verification, complete it.");
  console.log("AFTER you see your home feed, come back here and press ENTER.");

  await new Promise((resolve) => {
    process.stdin.once("data", resolve);
  });

  const cookies = await context.cookies();
  fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));

  console.log("Cookies saved successfully");

  await browser.close();
})();
