# Auriga Racing E-Commerce Platform

A full-stack e-commerce application for premium speed skating and cycling equipment.

## Features Implemented

### Authentication & User Management
- ✅ User registration and login with email verification
- ✅ Role-based access control (Customer, Manager, Admin)
- ✅ Secure authentication using Supabase Auth
- ✅ Password reset functionality
- ✅ Protected routes with middleware

### Customer Features
- ✅ **Dashboard Overview** - View account summary and quick actions
- ✅ **Order Management** - View order history, track orders, cancel pending orders
- ✅ **Profile Management** - Edit personal information, phone number, password
- ✅ **Address Management** - Add, edit, delete, and set default shipping/billing addresses
- ✅ **Support Tickets** - Create and manage support tickets with replies
- ✅ **Product Reviews** - Write and manage product reviews with ratings

### Shopping Experience
- ✅ **Product Catalog** - Browse all products with category filtering
- ✅ **Advanced Search** - Keyword search across product names and descriptions
- ✅ **Faceted Filtering** - Filter by category, price range, and sort options
- ✅ **Product Detail Pages** - Full product information with reviews
- ✅ **Shopping Cart** - Add, update quantities, remove items
- ✅ **Checkout Process** - Complete checkout with Stripe payment integration
- ✅ **Order Confirmation** - Success page with order details

### Admin Dashboard
- ✅ **Dashboard Overview** - Statistics for products, orders, and users
- ✅ **User Management** - View all users, manage roles
- ✅ **Product Management** - Create, edit, view products
- ✅ **Category Management** - Full CRUD for product categories
- ✅ **Order Management** - View and update order statuses
- ✅ **Reviews Management** - Approve, delete product reviews
- ✅ **Tickets Management** - View and respond to customer support tickets
- ✅ **Front Pages Management** - Create and manage CMS pages with SEO settings

### Manager Dashboard
- ✅ Same features as Admin but without delete permissions
- ✅ Product and order management capabilities
- ✅ Dashboard with key metrics

### Category Structure
#### Inline Speed Skating
- Skate Packages
- Boots
- Frames
- Wheels
- Bearings
- Accessories
- Helmets & Skate Bags

#### Ice Speed Skating
- Skate Packages
- Boots
- Blades
- Clap Skates
- Helmets
- Accessories

#### Cycling & Triathlon
- Complete cycling equipment line

#### Fashion & Apparel
- Athletic apparel and accessories

### Front Pages
- ✅ **Home** - Hero section, features, featured products, CTA
- ✅ **About** - Company story, mission, values, team
- ✅ **Contact** - Contact form, business information, hours
- ✅ **Products** - Full catalog with search and filtering
- ✅ **Product Detail** - Individual product pages with reviews
- ✅ **Cart** - Shopping cart management
- ✅ **Checkout** - Secure checkout with Stripe

### Legal Pages
- ✅ **Privacy Policy** - Data collection and usage
- ✅ **Terms & Conditions** - Website terms of use
- ✅ **Warranty & Shipping** - Product warranty and shipping information
- ✅ **Disclaimer** - Legal disclaimers
- ✅ **Distributors** - List of authorized distributors
- ✅ **Dealer Application** - Form for becoming a dealer
- ✅ **FAQs** - Frequently asked questions with accordion

### Technical Features
- ✅ **Supabase Integration** - PostgreSQL database with Row Level Security
- ✅ **Stripe Payment Gateway** - Secure payment processing
- ✅ **ImageKit.io Integration** - Optimized image delivery
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **SEO Optimization** - Meta tags, Open Graph tags
- ✅ **Server Components** - Next.js 16 App Router
- ✅ **Server Actions** - Form submissions and mutations
- ✅ **Middleware** - Route protection and authentication
- ✅ **Type Safety** - TypeScript throughout

### Design
- ✅ **Brand Colors** - #bd9131 (gold), #000000 (black), #bcbcbc (gray)
- ✅ **Professional UI** - shadcn/ui components
- ✅ **Smooth Animations** - Transitions and hover effects
- ✅ **Consistent Layout** - Navbar and footer on all pages
- ✅ **Accessible** - ARIA labels and semantic HTML

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19.2)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Images**: ImageKit.io
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## Database Schema

### Tables
- `users` - User profiles with role management
- `categories` - Product categories with hierarchy
- `products` - Product catalog with inventory
- `orders` - Customer orders with status tracking
- `order_items` - Individual items in orders
- `cart_items` - Shopping cart items
- `addresses` - Customer shipping/billing addresses
- `reviews` - Product reviews with ratings
- `tickets` - Customer support tickets
- `ticket_replies` - Responses to tickets
- `front_pages` - CMS-managed pages with SEO

### Security
- Row Level Security (RLS) policies on all tables
- User-based access control
- Admin and manager role checks
- Secure API routes

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run database migrations in the `scripts` folder
5. Start development server: `npm run dev`
6. Visit `http://localhost:3000`

## Environment Variables Required

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Database (auto-configured by Supabase)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
\`\`\`

## Project Structure

\`\`\`
auriga-racing/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── account/           # Customer dashboard
│   ├── admin/             # Admin dashboard
│   ├── manager/           # Manager dashboard
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── legal/             # Legal pages
│   └── page.tsx           # Homepage
├── components/            # Reusable components
├── lib/                   # Utilities and configs
│   ├── supabase/         # Supabase clients
│   ├── imagekit.ts       # ImageKit.io utilities
│   └── types.ts          # TypeScript types
├── scripts/              # Database migration scripts
└── middleware.ts         # Route protection
\`\`\`

## Key Routes

### Public Routes
- `/` - Homepage
- `/products` - Product catalog
- `/products/[slug]` - Product detail
- `/about` - About page
- `/contact` - Contact page
- `/legal/*` - Legal pages

### Protected Routes (Customer)
- `/account` - Customer dashboard
- `/account/profile` - Edit profile
- `/account/orders` - Order history
- `/account/addresses` - Address management
- `/account/tickets` - Support tickets
- `/cart` - Shopping cart
- `/checkout` - Checkout process

### Protected Routes (Admin/Manager)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management
- `/admin/reviews` - Reviews management
- `/admin/tickets` - Tickets management
- `/admin/pages` - CMS management

## Notes

- All passwords are hashed using Supabase Auth
- Payment processing is handled securely by Stripe
- Images are optimized and served via ImageKit.io CDN
- The application is fully responsive and works on all devices
- All forms include proper validation and error handling
- Database includes seed data for categories and sample products
