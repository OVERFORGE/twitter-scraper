import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "tweets.json"
  );

  const raw = fs.readFileSync(filePath, "utf-8");
  const tweets = JSON.parse(raw);

  return NextResponse.json(tweets);
}
