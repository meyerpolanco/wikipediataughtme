# Today Wikipedia Taught Me 

A Wikipedia email service that delivers curated articles to users based on their preferences. 

## Features

### User Portal
- **Simple Signup**: Users enter their email and get instant access to their personal dashboard
- **Preset Options**: Choose from curated article categories:
  - True Random: Completely random Wikipedia articles
  - Trending: Currently popular articles
  - Brand New: Recently created articles
  - And more presets to be added...
- **Custom Preferences**: Fine-tune your experience with advanced options:
  - Min/Max article hits per day
  - Trending threshold values
  - Geographic tags and location-based articles
  - Category filters
  - Language preferences
  - Article length preferences

### Email Service
- **Daily Delivery**: Automatic emails sent around 10 AM
- **Smart Scheduling**: Database-driven delivery system
- **Personalized Content**: Each user receives articles matching their preferences

## Project Architecture

```
wikipediataughtme/
├── web-app/                 # User interface and signup portal
│   ├── frontend/           # React/Next.js user interface
│   ├── backend/            # API server (Node.js/Express)
│   └── database/           # User preferences and subscriptions
├── email-service/          # Daily email delivery system
│   ├── scheduler/          # Cron job or scheduled task runner
│   ├── email-templates/    # HTML email templates
│   └── wikipedia-api/      # Wikipedia API integration
├── shared/                 # Shared utilities and types
└── docs/                   # Documentation and API specs
```

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query / SWR
- **Form Handling**: React Hook Form

### Backend
- **API**: Node.js with Express
- **Database**: SQLite (development) / Supabase (production) with Prisma ORM
- **Authentication**: JWT tokens
- **Validation**: Zod schemas

### Email Service
- **Language**: Python (for robust scheduling and API handling)
- **Scheduler**: APScheduler or Celery
- **Email Provider**: Gmail SMTP (development) / Resend (production)
- **Wikipedia API**: Wikipedia REST API (free)

## Development Roadmap

### Phase 1: MVP
- [ ] Basic user signup and email collection
- [ ] Simple preset options (True Random, Trending, Brand New)
- [ ] Basic email delivery system
- [ ] Database schema design

### Phase 2: Enhanced Features
- [ ] Custom preference configuration
- [ ] Advanced filtering options
- [ ] Email template customization
- [ ] User dashboard improvements

### Phase 3: Advanced Features
- [ ] Analytics and usage tracking
- [ ] Social features (share articles)
- [ ] Mobile app
- [ ] Premium subscription tiers

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git
- Gmail account (for email service)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/wikipediataughtme.git
cd wikipediataughtme

# Install dependencies
npm install
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database (SQLite - no installation needed)
npm run db:migrate

# Start development servers
npm run dev:web
npm run dev:email-service
```

## Email Delivery System

The email service runs independently and:
1. Connects to the database to fetch active subscriptions
2. Retrieves Wikipedia articles based on user preferences
3. Generates personalized email content
4. Sends emails via configured SMTP service
5. Logs delivery status and handles failures

## Configuration

### Environment Variables
```env
# Database (SQLite - file-based, no setup needed)
DATABASE_URL=file:./dev.db

# Email Service (Gmail SMTP - free)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
FROM_EMAIL=your_gmail@gmail.com

# Wikipedia API (free)
WIKIPEDIA_API_URL=https://en.wikipedia.org/api/rest_v1

# Security
JWT_SECRET=your_jwt_secret
```

