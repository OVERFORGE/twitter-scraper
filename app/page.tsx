"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Tweet = {
  id: string;
  username: string;
  text: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  timestamp: string;
};

type SortKey = "likes" | "retweets" | "replies" | null;

const PAGE_SIZE = 10;

export default function Dashboard() {
  const [keyword, setKeyword] = useState("");
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  async function fetchTweets() {
    const res = await fetch("/api/tweets");
    const data = await res.json();
    setTweets(data);
  }

  async function handleScrape() {
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      await fetchTweets();
      setPage(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTweets();
  }, []);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  }

  /* ---------------- ANALYTICS ---------------- */

  const totalTweets = tweets.length;

  const totalEngagement = useMemo(
    () =>
      tweets.reduce(
        (sum, t) => sum + t.likes + t.retweets + t.replies,
        0
      ),
    [tweets]
  );

  const totalViews = useMemo(
    () => tweets.reduce((sum, t) => sum + t.views, 0),
    [tweets]
  );

  const avgEngagement =
    totalTweets > 0
      ? (totalEngagement / totalTweets).toFixed(2)
      : "0";

  const avgViews =
    totalTweets > 0 ? Math.round(totalViews / totalTweets) : 0;

  const avgEngagementRate =
    totalViews > 0
      ? ((totalEngagement / totalViews) * 100).toFixed(2)
      : "0";

  const topTweet = useMemo(() => {
    if (tweets.length === 0) return null;
    return tweets.reduce((best, curr) => {
      const b = best.likes + best.retweets + best.replies;
      const c = curr.likes + curr.retweets + curr.replies;
      return c > b ? curr : best;
    });
  }, [tweets]);

  /* ---------------- SORT + PAGINATION ---------------- */

  const sortedTweets = useMemo(() => {
    if (!sortKey) return tweets;
    return [...tweets].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortOrder === "asc" ? diff : -diff;
    });
  }, [tweets, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedTweets.length / PAGE_SIZE);

  const paginatedTweets = sortedTweets.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ---------------- CHART ---------------- */

  const tweetsPerHour = useMemo(() => {
    const map: Record<string, number> = {};
    tweets.forEach((t) => {
      const hour = new Date(t.timestamp).toISOString().slice(0, 13);
      map[hour] = (map[hour] || 0) + 1;
    });

    return Object.entries(map)
      .sort()
      .map(([hour, count]) => ({
        hour: hour.replace("T", " "),
        count,
      }));
  }, [tweets]);

  /* ---------------- CSV ---------------- */

  function exportCSV() {
    const header =
      "username,text,likes,retweets,replies,views,timestamp\n";
    const rows = tweets
      .map((t) =>
        [
          t.username,
          `"${t.text.replace(/"/g, '""')}"`,
          t.likes,
          t.retweets,
          t.replies,
          t.views,
          t.timestamp,
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tweets.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold">
            Twitter Analytics Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Showing most recently scraped data
          </p>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-3">
          <input
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 outline-none"
            placeholder="Keyword (e.g. ethereum)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            onClick={handleScrape}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 transition px-6 py-2 rounded-lg font-medium disabled:opacity-60"
          >
            {loading ? "Scraping…" : "Scrape"}
          </button>
          <button
            onClick={exportCSV}
            className="border border-slate-700 hover:bg-slate-800 transition px-5 py-2 rounded-lg"
          >
            Export CSV
          </button>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Tweets" value={totalTweets} />
          <StatCard label="Avg Engagement" value={avgEngagement} />
          <StatCard label="Avg Views" value={avgViews} />
          <StatCard
            label="Avg Engagement Rate"
            value={`${avgEngagementRate}%`}
          />

          
        </div>
        {topTweet && (
            <div className="md:col-span-1 bg-gradient-to-br from-violet-600/20 to-slate-900 border border-violet-500/40 rounded-xl p-5">
              <p className="text-xs uppercase tracking-wide text-violet-400">
                Most Engaging Tweet
              </p>
              <p className="font-medium mt-1">
                @{topTweet.username}
              </p>
              <p className="text-slate-400 text-sm mt-2 line-clamp-3">
                {topTweet.text}
              </p>
              <p className="mt-3 text-violet-300 font-semibold">
                Engagement{" "}
                {topTweet.likes +
                  topTweet.retweets +
                  topTweet.replies}
              </p>
            </div>
          )}

        {/* Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-72">
          <h2 className="text-lg font-medium mb-4">
            Tweets per Hour
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tweetsPerHour}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Tweet</th>
                <SortableTh label="Likes" active={sortKey === "likes"} order={sortOrder} onClick={() => handleSort("likes")} />
                <SortableTh label="Reposts" active={sortKey === "retweets"} order={sortOrder} onClick={() => handleSort("retweets")} />
                <SortableTh label="Comments" active={sortKey === "replies"} order={sortOrder} onClick={() => handleSort("replies")} />
                <th className="px-4 py-3 text-center">Views</th>
                <th className="px-4 py-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTweets.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-slate-800 hover:bg-slate-800 transition"
                >
                  <td className="px-4 py-3 font-medium">@{t.username}</td>
                  <td className="px-4 py-3 max-w-xl text-slate-400">
                    {t.text}
                  </td>
                  <td className="px-4 py-3 text-center">{t.likes}</td>
                  <td className="px-4 py-3 text-center">{t.retweets}</td>
                  <td className="px-4 py-3 text-center">{t.replies}</td>
                  <td className="px-4 py-3 text-center">{t.views}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-slate-800">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded border border-slate-700 hover:bg-slate-800 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-slate-400">
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded border border-slate-700 hover:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-violet-500 transition">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-3xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function SortableTh({
  label,
  active,
  order,
  onClick,
}: {
  label: string;
  active: boolean;
  order: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className="px-4 py-3 text-center cursor-pointer hover:text-violet-400 md:w-1/12 gap-2"
    >
      {label} {active && (order === "asc" ? "↑" : "↓")}
    </th>
  );
}
