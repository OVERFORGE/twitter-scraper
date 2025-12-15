import { readTweets } from "@/lib/storage/jsonStore";

export async function GET() {
  const tweets = readTweets();
  return Response.json(tweets);
}
