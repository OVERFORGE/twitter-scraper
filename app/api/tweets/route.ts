import { NextResponse } from "next/server";
import { readTweets } from "@/lib/storage/jsonStore";

export async function GET() {
  try {
   
    if (process.env.NODE_ENV !== "production") {
      const tweets = readTweets();
      return NextResponse.json(Array.isArray(tweets) ? tweets : []);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data/tweets.json`,
      { cache: "no-store" }
    );

    if (!res.ok) return NextResponse.json([]);

    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("GET /api/tweets failed", err);
    return NextResponse.json([]);
  }
}
