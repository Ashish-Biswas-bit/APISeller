# CasinoHub - iGaming API Platform

A modern, dark-themed e-commerce platform for casino gaming APIs. Built with React, Node.js, and Supabase. Features a unique middleman architecture that allows you to resell casino gaming APIs (live dealer, slots, RNG) under your own brand.

![Platform Preview](https://via.placeholder.com/800x400/1a1a25/8b5cf6?text=API+Store+Preview)

## Features

### Frontend
- **Modern Dark Theme** - Beautiful dark UI with gradient accents
- **Unique Hero Section** - Animated background with live code demo
- **Responsive Design** - Works on all devices
- **User Dashboard** - Manage API keys, view orders, track usage
- **Admin Panel** - Full CRUD for products, orders, and users
- **Real-time Updates** - Live data from Supabase

### Backend
- **Middleman API Architecture** - Resell third-party APIs seamlessly
- **Authentication** - Secure JWT-based auth with Supabase
- **Payment Processing** - Stripe integration for subscriptions
- **Rate Limiting** - Built-in API usage controls
- **Usage Analytics** - Track and log all API calls

### Key Capabilities
- User registration and authentication
- Product catalog with categories
- Stripe payment integration
- Automatic API key generation
- API usage tracking and rate limiting
- Admin dashboard for management
- Webhook handling for subscriptions

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Supabase client for backend
- Lucide React for icons
- Framer Motion for animations

### Backend
- Node.js with Express
- Supabase for database and auth
- Stripe for payments
- Axios for HTTP requests
- Helmet for security
- Rate limiting with express-rate-limit

### Database
- PostgreSQL (via Supabase)
- Row Level Security (RLS) policies
- Real-time subscriptions

## Project Structure

```
API/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── hero/       # Hero section components
│   │   │   ├── sections/   # Page sections
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   └── admin/      # Admin components
│   │   ├── context/        # React contexts
│   │   ├── lib/            # External libraries
│   │   ├── pages/          # Page components
│   │   │   ├── dashboard/  # User dashboard pages
│   │   │   └── admin/      # Admin pages
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   └── package.json
├── database/                 # Database files
│   └── schema.sql           # Supabase schema
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Stripe account

### 1. Clone and Install

```bash
cd e:\My Totel Project\API

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Setup

Create `.env` files in both frontend and backend directories:

**Frontend (`frontend/.env`):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_API_BASE_URL=http://localhost:5000
```

**Backend (`backend/.env`):**
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Original API Provider Keys (Middleman)
ORIGINAL_TEXT_ANALYSIS_API_URL=https://api.provider.com/v1/analyze
ORIGINAL_TEXT_ANALYSIS_API_KEY=original-api-key
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema in `database/schema.sql`
3. Enable Row Level Security (RLS) policies
4. Set up authentication providers

### 4. Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Dashboard
3. Set up webhook endpoint: `https://your-domain.com/webhooks/stripe`
4. Configure webhook events: `payment_intent.succeeded`, `invoice.payment_succeeded`

### 5. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Middleman API Architecture

This platform uses a middleman architecture to resell third-party APIs:

```
Customer Request → Your API Store Backend → Original API Provider
                      ↓
                 Track Usage
                      ↓
               Return Response
```

### How It Works

1. **Customer buys API** through your platform
2. **API key generated** and provided to customer
3. **Customer makes request** to your backend with their API key
4. **Your backend verifies** the API key and rate limits
5. **Request forwarded** to original API provider
6. **Response returned** to customer (appears to come from you)
7. **Usage tracked** for billing and analytics

### Configuring Original APIs

In your backend `.env`:

```env
# Original API Provider Configuration
ORIGINAL_TEXT_ANALYSIS_API_URL=https://api.original-provider.com/v1/analyze
ORIGINAL_TEXT_ANALYSIS_API_KEY=your-original-api-key
```

In the database, add the original API URL to the `products` table:

```sql
UPDATE products SET 
  original_api_url = 'https://api.original-provider.com/v1/analyze',
  original_api_key = 'encrypted-api-key'
WHERE id = 'your-product-id';
```

## API Endpoints

### Public Endpoints
- `GET /health` - Health check

### Protected Endpoints (requires API key)
- `POST /api/v1/analyze` - Text analysis
- `POST /api/v1/recognize` - Image recognition
- `POST /api/v1/enrich` - Data enrichment
- `ALL /api/v1/proxy/:service/*` - Generic proxy

### Webhooks
- `POST /webhooks/stripe` - Stripe webhook handler

## User Roles

### Regular User
- Browse products
- Purchase APIs
- Manage API keys
- View usage statistics
- Update profile settings

### Admin
- All user features
- Manage products (CRUD)
- View all orders
- Manage users
- Monitor API health
- View analytics

## Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the `dist` folder
```

### Backend (Railway/Render/Heroku)

```bash
cd backend
git push railway main
```

### Environment Variables for Production

Set these in your hosting platform:

```env
# Required
NODE_ENV=production
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=https://your-domain.com

# Original API Keys (for middleman functionality)
ORIGINAL_TEXT_ANALYSIS_API_URL=
ORIGINAL_TEXT_ANALYSIS_API_KEY=
```

## Customization

### Adding New APIs to Sell

1. Add product to database:
```sql
INSERT INTO products (name, description, category, price, features, original_api_url)
VALUES (
  'New API',
  'Description of the API',
  'Category',
  4900, -- $49.00 in cents
  '["Feature 1", "Feature 2"]',
  'https://api.original-provider.com/v1/endpoint'
);
```

2. Add backend route in `backend/src/routes/api.js`:
```javascript
router.post('/new-endpoint', verifyApiKey, trackUsage, async (req, res) => {
  // Forward to original API
  // Return response
})
```

### Customizing the Theme

Edit `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: {
    400: '#your-color',
    500: '#your-color',
    600: '#your-color',
  },
  // ... other colors
}
```

## Security Considerations

1. **API Key Storage** - Store original API keys encrypted
2. **Rate Limiting** - Implemented at middleware level
3. **RLS Policies** - Database-level access control
4. **Input Validation** - Validate all incoming requests
5. **CORS** - Configured for specific origins only
6. **Helmet** - Security headers enabled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this for commercial projects.

## Support

For issues and feature requests, please open a GitHub issue.

---

Built with ❤️ using React, Node.js, and Supabase
