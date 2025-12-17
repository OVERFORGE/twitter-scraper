import { readTweets } from "@/lib/storage/jsonStore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tweets = readTweets();
    return NextResponse.json(tweets);
  } catch (err) {
    console.error("Failed to read tweets", err);
    return NextResponse.json(
      { error: "Failed to load tweets" },
      { status: 500 }
    );
  }
}
