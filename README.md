# Next Elite Soccer Website

A full-stack Next.js soccer league management website for Next Elite Soccer.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom CSS (Copperplate/Cinzel font, black/white design system)
- **Database**: Google Sheets (via `google-spreadsheet` library)
- **Authentication**: NextAuth.js (Google OAuth + Facebook OAuth)
- **Payments**: Stripe Checkout
- **Language**: English + Spanish (i18n built in)

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `GOOGLE_SHEETS_ID` | The ID from your Google Sheet URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email |
| `GOOGLE_PRIVATE_KEY` | Service account private key |
| `NEXTAUTH_URL` | Your site URL (http://localhost:3000 for dev) |
| `NEXTAUTH_SECRET` | Random secret (generate with `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `FACEBOOK_CLIENT_ID` | Facebook App ID |
| `FACEBOOK_CLIENT_SECRET` | Facebook App Secret |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |

### 3. Set Up Google Sheets

Create a new Google Sheet with these **exact sheet names** (in order):

1. **ALL ACCOUNTS** — Sheet with these column headers:
   - Account Name, Phone Number, Type of Login (FB or G), Login (FB or G), Status
   - Then pairs: F/G = Team1/Role1, H/I = Team2/Role2, etc.

2. **ALL TEAMS** — Sheet with headers:
   - Teams, Captains, Captains' #, (LEAGUE)'s, Total Leagues, Total Games Played, Total Wins, Total Draws, Total Losses, Total Goals Done, Total Goals Against, Total Goal Difference, Total Points

3. **ALL LEAGUES** — Sheet with headers:
   - League, Location, Day, Division, Month, Status, Price

4. **ALL LOCATIONS** — Sheet with header:
   - Locations

5+ **League sheets** (created automatically when you create a league):
   - Table side (A-J): Teams, Played, Wins, Draws, Losses, Goals Done, Goals Against, Goal Difference, Points, Paid
   - Match side (L-V): MatchID, Month, Date, Time, Home Team, Home Score, Away Team, Away Score, Winner, Loser, League or Final

### 4. Set Up Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project
3. Enable the **Google Sheets API**
4. Create a **Service Account**
5. Download the JSON key file
6. Share your Google Sheet with the service account email
7. Copy the email and private key into `.env.local`

### 5. Set Up OAuth

**Google:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect: `http://localhost:3000/api/auth/callback/google`

**Facebook:**
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create an app
3. Add Facebook Login product
4. Add valid OAuth redirect: `http://localhost:3000/api/auth/callback/facebook`

### 6. Set Up Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Get your test API keys from the Dashboard
3. Add them to `.env.local`

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Page Structure & Navigation

```
/ (Language Selection)
└── /home (Guest Home)
    ├── /welcome (Welcome Page with Instagram/Facebook links)
    ├── /find-my-team (Filter: Location → League → Team)
    ├── /login (Connect with Facebook/Google)
    │   └── /role (Captain or Player selection)
    │       └── /home (Role-specific home)
    ├── /location/[name] (Leagues at a location)
    ├── /league/[name] (League table + info)
    ├── /schedule/[league] (Match schedule)
    ├── /bracket/[league] (Playoff bracket)
    └── /team/[name] (Team public view)

/home (Admin)
├── /admin/teams → /admin/teams/create, /admin/team/[name]
├── /admin/leagues → /admin/leagues/create, /admin/league/[name]
├── /admin/schedules → /admin/league/[name]
├── /admin/locations
└── /admin/accounts

/home (Captain)
├── /captain/teams → /captain/team/[name] → /captain/league/[name]
└── /captain/payments

/home (Player)
├── /player/teams → /player/teams/ongoing, /player/teams/past
│   └── /player/team/[name]
└── /player/table/[league]
```

---

## Design System

- **Background**: `#2a2a2a` (dark charcoal)
- **Buttons**: White fill with black text (inverts on press)
- **Outline variant**: White border, transparent background (inverts on press)
- **Font**: Copperplate / Cinzel (uppercase everywhere)
- **Payment dots**: 🟢 Green = paid, 🔴 Red = unpaid
- **All text**: UPPERCASE

### Button Press Animation
Buttons invert on press:
- White button → transparent background, white text
- Black button → transparent background, black text/border

### Text Truncation
Long text shows available characters + `...`

---

## User Roles

| Role | Can Do |
|---|---|
| **Guest** | View leagues, tables, schedules, find teams |
| **Player** | + View own teams (on going / past) |
| **Captain** | + View own teams' leagues, payments |
| **Admin** | Full control: create leagues/teams, enter scores, manage accounts |

---

## Key Features

- **Multi-language**: English/Spanish toggle on first visit
- **Find My Team**: Location → League → Team drill-down
- **League Table**: 9-column standings (PL, W, D, L, G+, G-, GD, PTS)
- **Playoff Bracket**: Auto-generated from top 4 in table
- **Admin Score Entry**: Click match card to edit scores, auto-calculates table
- **Payment Tracking**: Stripe checkout, status shown with colored dots
- **Scrollable Selectors**: Hamburger icon (≡) indicates scrollable dropdown

---

## Deployment (Vercel)

```bash
npm run build
vercel deploy
```

Add all environment variables in the Vercel dashboard under your project settings.

---

## Development Notes

- The app uses **mock data** when `GOOGLE_SHEETS_ID` is not set. Mock data is in `lib/mockData.js`
- To switch from mock to live data, add the Google Sheets environment variables
- The `AppContext` handles language switching and user role state
- All API calls go through `/api/sheets` (GET for reads, POST for writes)
