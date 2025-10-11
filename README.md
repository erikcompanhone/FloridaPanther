# 🐆 Florida Panther Tracker

**Live Demo:** [panther.erikcompanhone.com](https://panther.erikcompanhone.com)

A modern web application for visualizing and analyzing Florida panther telemetry and mortality data from the Florida Fish & Wildlife Conservation Commission.

## Tech Stack

- **Frontend:** React 19, Vite
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel Serverless Functions
- **Visualization:** Recharts, Leaflet with marker clustering
- **Styling:** Mobile-first responsive CSS

## Features

- 📍 **Interactive Maps** – Visualize 40k+ telemetry records with clustering for optimal performance
- 📊 **Data Analysis** – Explore mortality causes and observation timelines
- 🔍 **Advanced Filters** – Query by age, sex, year, and location
- 📱 **Mobile Responsive** – Optimized for all devices from 320px to 4K
- ⚡ **Serverless Architecture** – Fast, scalable API endpoints on Vercel Edge

## Quick Setup

```bash
# Clone repository
git clone https://github.com/erikalmeidah/FloridaPanther.git
cd FloridaPanther/frontend

# Install dependencies
npm install

# Set environment variables
cp ../.env.example .env
# Add your Supabase credentials to .env

# Run development server
npm run dev
```

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

Deploy to Vercel with one click or via CLI:

```bash
vercel --prod
```

Configure custom domain in Vercel dashboard: `panther.erikcompanhone.com`

## Database Setup

Follow the migration guide in `scripts/migrate-to-postgres.md` to set up the Supabase database with the required tables and RPC functions.

## Data Source

Wildlife data provided by the [Florida Fish & Wildlife Conservation Commission](https://myfwc.com/).

## License

MIT License - feel free to use for educational or research purposes.

