import { NextResponse } from "next/server";
import { readTweets } from "@/lib/storage/jsonStore";

export async function GET() {
  try {
    const tweets = readTweets();


    return NextResponse.json(
      Array.isArray(tweets) ? tweets : []
    );
  } catch (error) {
    console.error("API /tweets failed:", error);

 
    return NextResponse.json([], { status: 200 });
  }
}
