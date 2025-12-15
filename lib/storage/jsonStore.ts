import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "tweets.json");

export function readTweets() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(DATA_PATH, "[]");
      return [];
    }

    const raw = fs.readFileSync(DATA_PATH, "utf-8").trim();

    if (!raw) {
      fs.writeFileSync(DATA_PATH, "[]");
      return [];
    }

    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read tweets.json, resetting file", err);
    fs.writeFileSync(DATA_PATH, "[]");
    return [];
  }
}

export function writeTweets(tweets: any[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(tweets, null, 2));
}
