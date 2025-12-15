Twitter/X Scraper + Mini Dashboard

A small full-stack tool that scrapes recent tweets from Twitter/X using browser automation and displays them in a clean, interactive dashboard with basic analytics.



Architecture Overview
The project is split into three main layers:

1. Scraper (Backend)
Uses Playwright (Chrome) to load Twitter/X search results
Parses the rendered HTML using Cheerio
Supports keyword-based scraping from the live search feed
Extracts tweet-level metrics and metadata
Stores results in a local JSON file

2. API Layer (Next.js)

/api/scrape
Triggers a new scrape for a given keyword and replaces previously stored data

/api/tweets
Reads stored tweet data and serves it to the frontend

3. Dashboard (Frontend)

Built using Next.js App Router
Displays tweets in a paginated table
Shows basic analytics (totals, averages, trends)
Includes CSV export functionality



Tech Stack Used
Frontend - Next.js , React , Tailwind CSS , Recharts 
Backend - Playwright , Cheerio 

Storage 
Local JSON File



Data Collected Per Tweet

Each scraped tweet contains:
Username
Tweet text
Likes
Retweets
Replies
Timestamp
Views (when available)




How to Run the Project

Install dependencies
npm install

Install Playwright browsers
npx playwright install


(First time only) Login to X
npx ts-node lib/scraper/loginTwitter.ts

Start the development server
npm run dev



How to Use
Enter a keyword in the input field
Click Scrape
The dashboard refreshes with newly collected tweets
View analytics, browse tweets, or export data as CSV



Limitations & Assumptions

1. View / Impression Counts
Twitter/X does not reliably expose view counts on search result pages.

Views are only consistently available on individual tweet pages

To avoid excessive navigation and rate-limiting, this project does not visit each tweet’s detail page

When impressions are not available, views are marked as 0 and engagement rate is shown as N/A


2. Rate Limiting & Stability
craping relies on unofficial methods

Twitter/X may change DOM structure at any time

Excessive scraping can result in temporary blocks


3. Data Persistence
Data is stored locally in a JSON file

Not intended for production or multi-user environments


