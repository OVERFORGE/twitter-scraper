import { chromium } from "playwright";
import * as cheerio from "cheerio";


function parseCount(text: string): number {
  if (!text) return 0;

  const clean = text.replace(/,/g, "").trim();

  if (clean.endsWith("K")) {
    return Math.round(parseFloat(clean) * 1000);
  }

  if (clean.endsWith("M")) {
    return Math.round(parseFloat(clean) * 1_000_000);
  }

  return parseInt(clean, 10) || 0;
}


function extractCountFromAria(
  element: cheerio.Cheerio,
  testId: string
): number {
  const aria = element
    .find(`[data-testid="${testId}"]`)
    .attr("aria-label");

  if (aria) {
    const match = aria.match(/([\d,.]+)/);
    if (match) {
      return parseCount(match[1]);
    }
  }

  const text = element
    .find(`[data-testid="${testId}"] span`)
    .text();

  return parseCount(text);
}

export type ScrapedTweet = {
  id: string;
  username: string;
  text: string;
  likes: number;
  retweets: number;
  replies: number;
  timestamp: string;
};

export async function scrapeTweets(
  keyword: string
): Promise<ScrapedTweet[]> {
  const userDataDir = "C:/chrome-playwright-profile";

  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: "chrome",
    headless: true,
    viewport: { width: 1280, height: 800 },
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = await context.newPage();

  const url = `https://twitter.com/search?q=${encodeURIComponent(
    keyword
  )}&f=live`;

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);

  const collected = new Map<string, ScrapedTweet>();

  for (let scroll = 0; scroll < 8; scroll++) {
    const html = await page.content();
    const $ = cheerio.load(html);

    $("article").each((_, element) => {
      const tweetText = $(element)
        .find('[data-testid="tweetText"]')
        .text()
        .trim();

      const username = $(element)
        .find('a[href^="/"] span')
        .first()
        .text()
        .trim();

      if (!tweetText || !username) return;

      const key = `${username}-${tweetText.slice(0, 60)}`;
      if (collected.has(key)) return;

      const likes = extractCountFromAria($(element), "like");
      const retweets = extractCountFromAria($(element), "retweet");
      const replies = extractCountFromAria($(element), "reply");

      const timestamp =
        $(element).find("time").attr("datetime") ??
        new Date().toISOString();

      collected.set(key, {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        username,
        text: tweetText,
        likes,
        retweets,
        replies,
        timestamp,
      });
    });

    if (collected.size >= 50) break;


    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(2500);
  }

  await context.close();

  return Array.from(collected.values()).slice(0, 50);
}
