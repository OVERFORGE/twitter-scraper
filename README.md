Twitter / X Scraper & Analytics Dashboard

A lightweight full-stack application that scrapes recent tweets from Twitter/X using browser automation and presents them in an interactive analytics dashboard. The project is designed to demonstrate scraping workflows, data processing, and frontend analytics rather than to act as a production-ready crawler.


Overview

This tool allows users to:
Scrape recent tweets based on a keyword
Extract engagement metrics and metadata
Analyze trends and engagement statistics
View and sort tweets in a paginated dashboard
Export collected data as CSV

Due to platform restrictions, scraping is supported only in local development. The deployed version runs in a read-only “demo mode” using a preloaded dataset.

Architecture Overview

The project is structured into three logical layers:

1. Scraper (Backend)
Uses Playwright (Chromium) to render Twitter/X search results
Operates with a real Chrome user profile for authentication
Parses rendered HTML using Cheerio
Supports keyword-based scraping from Twitter search pages
Extracts tweet-level metadata and engagement metrics
Writes results to a local JSON file during development

2. API Layer (Next.js App Router)
Endpoint	Description
POST /api/scrape	Triggers a new scrape for a given keyword (development only)
GET /api/tweets	Returns stored tweet data to the frontend

The API layer abstracts data access and enables the frontend to remain environment-agnostic.

3. Dashboard (Frontend)
Built with Next.js App Router
Responsive UI styled using Tailwind CSS
Displays tweets in a paginated, sortable table
Highlights the most engaging tweet
Shows aggregate analytics and engagement trends
Provides CSV export for offline analysis
Uses Recharts for time-based visualizations

Tech Stack

Frontend
Next.js
React
Tailwind CSS
Recharts

Backend / Scraping
Playwright (Chromium)
Cheerio

Storage
Local JSON file (development)
Static JSON file (production demo)

Data Collected Per Tweet
Each scraped tweet includes the following fields:
Username
Tweet text
Likes
Retweets
Replies
Timestamp

How to Run the Project (Local Development)
1. Install Dependencies
npm install

2. Install Playwright Browsers
npx playwright install

3. Authenticate with Twitter/X (One-Time Step)
npx ts-node lib/scraper/loginTwitter.ts


This opens a real Chrome window where you log in manually.
Authentication cookies are saved for subsequent scraping sessions.

4. Start the Development Server
npm run dev

How to Use
Enter a keyword in the search input
Click Scrape
Newly collected tweets replace previous data
Explore analytics, sort engagement columns, or paginate results
Export data as CSV if needed
Deployment Behavior (Vercel)
This project supports two execution modes:
Development Mode
Full scraping enabled
Data stored locally in data/tweets.json
Intended for experimentation and learning
Production Mode (Vercel)
Scraping disabled
Uses a static dataset served from public/data/tweets.json
Demonstrates analytics, UI, and data handling without violating platform constraints
This approach ensures the application can be reviewed remotely while keeping scraping logic compliant with serverless limitations.

Limitations & Assumptions
View / Impression Counts

Twitter/X does not consistently expose view counts on search result pages.
Views are only reliably available on individual tweet pages.

To avoid excessive navigation, rate limiting, and instability, this project does not open each tweet’s detail page. When impressions are unavailable, view counts default to 0, and engagement rate calculations account for this.

Rate Limiting & Stability

Scraping relies on unofficial methods

Twitter/X may change its DOM structure at any time

Excessive scraping can trigger temporary account restrictions

Data Persistence

Data storage is file-based

Not suitable for multi-user or production environments

No database or caching layer is used

Intended Use

This project is intended for:

Learning browser automation and scraping workflows

Demonstrating frontend analytics and visualization

Technical assignments and take-home evaluations

Prototyping data pipelines

It is not designed for large-scale or commercial scraping.

