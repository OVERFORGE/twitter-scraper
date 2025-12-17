import { scrapeTweets } from "@/lib/scraper/scrapeTweets";
import { writeTweets } from "@/lib/storage/jsonStore";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "Scraping disabled in production" },
      { status: 403 }
    );
  }

  const { keyword } = await req.json();
  if (!keyword) {
    return Response.json({ error: "Keyword is required" }, { status: 400 });
  }

  const scrapedTweets = await scrapeTweets(keyword);
  writeTweets(scrapedTweets);

  return Response.json({
    success: true,
    added: scrapedTweets.length,
  });
}

