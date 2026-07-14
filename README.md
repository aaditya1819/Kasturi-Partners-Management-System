# Kasturi Partners Management System

A premium Next.js fullstack portal for managing reseller partners, saree catalog pricing, and order sales tracking, powered by Neon PostgreSQL.

## 🚀 Key Features

* **Dashboard Analytics**: Real-time cards displaying total sales, reseller profit payouts, your admin profit share, and pending order dispatches.
* **Reseller Directory**: Full directory with index numbering, name/location search, and a profiling system showing monthly bar charts and chronological sales timelines.
* **Saree Pricing Catalog**: Automatically calculates the 30% markup, and splits the profits 15%/15% between the reseller and the admin, with editable retail overrides.
* **Orders Ledger**: Tracks payment credit status, customer shipping details, dispatches, and tracking numbers.
* **Admin Login Gate**: Fully secure admin login system (`aadityadhanwate830@gmail.com` / `aaditya@28`).

## 🛠️ Tech Stack

* **Frontend & Backend**: Next.js (App Router with Server Actions)
* **Database**: Neon Serverless PostgreSQL
* **Styling**: Vanilla CSS (Tailored maroon & luxury gold palette)
* **Visuals**: CSS-based dynamic monthly sales volume charts and chronological timelines.

## 📦 Local Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgres://<username>:<password>@<host>/neondb?sslmode=require
   ```

3. **Initialize Database**:
   Run the dev server, log in as admin, and click the **Reset/Seed Sample Data** button on the dashboard to create tables and import resellers.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🌐 Deploy to Vercel

1. Push this repository to your GitHub account (already linked).
2. Go to [Vercel](https://vercel.com/new).
3. Import this repository `Kasturi-Partners-Management-System`.
4. Under **Environment Variables**, add:
   * Name: `DATABASE_URL`
   * Value: `postgres://...` (your Neon connection string)
5. Click **Deploy**. Vercel will build and launch your portal automatically!
