# Complete File Structure - Social Media Management Platform

## 📁 Project Root Structure

```
social-media-platform/
├── 📄 .env                           # Environment variables
├── 📄 .env.example                   # Environment template
├── 📄 .gitignore                     # Git ignore rules
├── 📄 next.config.js                 # Next.js configuration
├── 📄 package.json                   # Dependencies & scripts
├── 📄 tailwind.config.js             # Tailwind CSS config
├── 📄 tsconfig.json                  # TypeScript configuration
├── 📄 PROJECT_OVERVIEW.md            # Complete project documentation
├── 📄 FILE_STRUCTURE.md              # This file structure guide
├── 📄 README.md                      # Project setup instructions
├── 📁 .kiro/                         # Kiro IDE configuration
├── 📁 prisma/                        # Database schema & migrations
├── 📁 public/                        # Static assets
├── 📁 src/                           # Main source code
└── 📁 node_modules/                  # Dependencies (auto-generated)
```

## 🗂️ Source Code Structure (`src/`)

```
src/
├── 📁 app/                           # Next.js App Router
│   ├── 📁 (dashboard)/              # Protected dashboard routes
│   ├── 📁 api/                      # API endpoints
│   ├── 📄 globals.css               # Global styles
│   ├── 📄 layout.tsx                # Root layout
│   └── 📄 page.tsx                  # Home page
├── 📁 components/                    # Reusable UI components
├── 📁 features/                      # Feature-specific components
├── 📁 services/                      # Business logic & API services
├── 📁 lib/                          # Utilities & configurations
├── 📁 data/                         # Static data & constants
├── 📁 hooks/                        # Custom React hooks
├── 📁 types/                        # TypeScript type definitions
└── 📁 utils/                        # Helper functions
```

## 🏠 App Router Structure (`src/app/`)

### **Main Routes**
```
src/app/
├── 📄 layout.tsx                     # Root layout with providers
├── 📄 page.tsx                      # Landing/home page
├── 📄 globals.css                   # Global Tailwind styles
├── 📄 loading.tsx                   # Global loading component
├── 📄 error.tsx                     # Global error boundary
├── 📄 not-found.tsx                 # 404 page
└── 📁 (dashboard)/                  # Protected dashboard group
    ├── 📄 layout.tsx                # Dashboard layout with sidebar
    ├── 📁 dashboard/                # Main dashboard
    │   └── 📄 page.tsx             # Dashboard home page
    ├── 📁 twitter-publisher/        # Twitter management
    │   └── 📄 page.tsx             # Twitter publisher page
    ├── 📁 instagram-publisher/      # Instagram management
    │   └── 📄 page.tsx             # Instagram publisher page
    ├── 📁 scheduler/                # Content scheduler
    │   └── 📄 page.tsx             # Scheduler calendar page
    ├── 📁 analytics/                # Analytics dashboard
    │   └── 📄 page.tsx             # Analytics overview
    ├── 📁 studio/                   # AI content creation
    │   └── 📄 page.tsx             # Image/content studio
    └── 📁 settings/                 # User settings
        └── 📄 page.tsx             # Settings page
```

### **API Routes**
```
src/app/api/
├── 📁 ai/                           # AI-powered features
│   ├── 📁 enhance-tweet/
│   │   └── 📄 route.ts             # Tweet enhancement endpoint
│   ├── 📁 generate-tweet/
│   │   └── 📄 route.ts             # Tweet generation endpoint
│   └── 📁 generate-caption/
│       └── 📄 route.ts             # Caption generation endpoint
├── 📁 twitter/                      # Twitter API integration
│   ├── 📄 auth/route.ts            # Twitter OAuth initiation
│   ├── 📄 callback/route.ts        # Twitter OAuth callback
│   ├── 📄 check-auth/route.ts      # Check Twitter auth status
│   ├── 📄 disconnect/route.ts      # Disconnect Twitter account
│   ├── 📄 publish/route.ts         # Publish tweet
│   ├── 📄 test/route.ts            # Test Twitter connection
│   ├── 📄 test-connection/route.ts # Connection health check
│   └── 📄 test-media/route.ts      # Media upload test
├── 📁 instagram/                    # Instagram API integration
│   ├── 📄 auth/route.ts            # Instagram OAuth
│   ├── 📄 callback/route.ts        # Instagram OAuth callback
│   ├── 📄 posts/route.ts           # Instagram posts CRUD
│   └── 📄 analytics/route.ts       # Instagram analytics
├── 📁 scheduler/                    # Post scheduling system
│   ├── 📄 posts/route.ts           # Scheduled posts CRUD
│   └── 📁 posts/
│       └── 📁 [id]/
│           └── 📄 route.ts         # Individual post operations
├── 📁 media/                       # Media management
│   ├── 📄 upload/route.ts          # Media upload
│   ├── 📄 gallery/route.ts         # Media gallery
│   └── 📄 delete/route.ts          # Media deletion
├── 📄 generate-image/route.ts       # AI image generation
└── 📁 webhooks/                     # External webhooks
    ├── 📄 clerk/route.ts           # Clerk user events
    └── 📄 social/route.ts          # Social platform webhooks
```

## 🧩 Components Structure (`src/components/`)

```
src/components/
├── 📁 ui/                           # shadcn/ui base components
│   ├── 📄 button.tsx               # Button component
│   ├── 📄 card.tsx                 # Card component
│   ├── 📄 input.tsx                # Input component
│   ├── 📄 textarea.tsx             # Textarea component
│   ├── 📄 dialog.tsx               # Modal dialog
│   ├── 📄 dropdown-menu.tsx        # Dropdown menu
│   ├── 📄 calendar.tsx             # Calendar component
│   ├── 📄 badge.tsx                # Badge component
│   ├── 📄 progress.tsx             # Progress bar
│   ├── 📄 tabs.tsx                 # Tabs component
│   ├── 📄 table.tsx                # Table component
│   ├── 📄 avatar.tsx               # Avatar component
│   └── 📄 toast.tsx                # Toast notifications
├── 📁 shared/                       # Shared components
│   ├── 📄 header.tsx               # App header
│   ├── 📄 sidebar.tsx              # Dashboard sidebar
│   ├── 📄 footer.tsx               # App footer
│   ├── 📄 loading-spinner.tsx      # Loading indicator
│   ├── 📄 error-boundary.tsx       # Error boundary wrapper
│   ├── 📄 prompt-enhancer.tsx      # AI prompt enhancement
│   └── 📄 platform-icon.tsx        # Social platform icons
├── 📁 forms/                        # Form components
│   ├── 📄 post-form.tsx            # Post creation form
│   ├── 📄 schedule-form.tsx        # Scheduling form
│   └── 📄 settings-form.tsx        # Settings form
└── 📁 charts/                       # Analytics charts
    ├── 📄 engagement-chart.tsx     # Engagement metrics
    ├── 📄 growth-chart.tsx         # Growth analytics
    └── 📄 performance-chart.tsx    # Performance metrics
```

## 🎯 Features Structure (`src/features/`)

```
src/features/
├── 📁 twitter/                      # Twitter feature module
│   ├── 📁 components/
│   │   ├── 📄 twitter-auth.tsx     # Twitter authentication
│   │   ├── 📄 twitter-publisher.tsx # Tweet publisher
│   │   ├── 📄 twitter-dashboard-publisher.tsx # Dashboard publisher
│   │   ├── 📄 twitter-status.tsx   # Connection status
│   │   ├── 📄 twitter-analytics.tsx # Twitter analytics
│   │   ├── 📄 ai-tweet-help.tsx    # AI tweet assistance
│   │   └── 📄 tweet-enhancement-modal.tsx # Tweet enhancement
│   ├── 📁 hooks/
│   │   ├── 📄 use-twitter-auth.ts  # Twitter auth hook
│   │   └── 📄 use-twitter-api.ts   # Twitter API hook
│   └── 📁 types/
│       └── 📄 twitter.types.ts     # Twitter type definitions
├── 📁 instagram/                    # Instagram feature module
│   ├── 📁 components/
│   │   ├── 📄 instagram-auth.tsx   # Instagram authentication
│   │   ├── 📄 instagram-publisher.tsx # Instagram publisher
│   │   ├── 📄 instagram-analytics.tsx # Instagram analytics
│   │   └── 📄 instagram-gallery.tsx # Instagram media gallery
│   └── 📁 types/
│       └── 📄 instagram.types.ts   # Instagram type definitions
├── 📁 scheduler/                    # Scheduling feature module
│   ├── 📁 components/
│   │   ├── 📄 scheduler-calendar.tsx # Calendar view
│   │   ├── 📄 scheduled-posts-list.tsx # Posts list
│   │   ├── 📄 new-post-modal.tsx   # New post creation
│   │   └── 📄 post-editor.tsx      # Post editing
│   ├── 📁 hooks/
│   │   ├── 📄 use-scheduler.ts     # Scheduler logic
│   │   └── 📄 use-posts.ts         # Posts management
│   └── 📁 types/
│       └── 📄 scheduler.types.ts   # Scheduler type definitions
├── 📁 image-studio/                 # AI image generation
│   ├── 📄 image-studio.tsx         # Main image studio
│   ├── 📄 image-generator.tsx      # Image generation
│   └── 📄 image-editor.tsx         # Image editing
├── 📁 analytics/                    # Analytics feature module
│   ├── 📁 components/
│   │   ├── 📄 analytics-dashboard.tsx # Analytics overview
│   │   ├── 📄 platform-metrics.tsx # Platform-specific metrics
│   │   └── 📄 performance-insights.tsx # Performance insights
│   └── 📁 types/
│       └── 📄 analytics.types.ts   # Analytics type definitions
├── 📁 tutorial/                     # User onboarding
│   ├── 📄 tutorial-steps.ts        # Tutorial configuration
│   ├── 📄 tutorial-overlay.tsx     # Tutorial UI
│   └── 📄 onboarding-flow.tsx      # Onboarding process
└── 📁 voiceover/                    # Voice generation (future)
    └── 📄 voiceover-studio.tsx     # Voice generation studio
```

## ⚙️ Services Structure (`src/services/`)

```
src/services/
├── 📄 twitter.service.ts            # Twitter API service
├── 📄 twitter-token.service.ts      # Twitter token management
├── 📄 twitter-token-db.service.ts   # Twitter token database
├── 📄 twitter-cache.service.ts      # Twitter caching service
├── 📄 instagram.service.ts          # Instagram API service
├── 📄 media.service.ts              # Media upload service
├── 📄 ai-image-helper.service.ts    # AI image generation
├── 📄 ai-content.service.ts         # AI content generation
├── 📄 scheduler.service.ts          # Post scheduling service
├── 📄 analytics.service.ts          # Analytics service
├── 📄 notification.service.ts       # Notification service
└── 📄 webhook.service.ts            # Webhook handling
```

## 🛠️ Library Structure (`src/lib/`)

```
src/lib/
├── 📄 db.ts                         # Prisma database client
├── 📄 auth.ts                       # Authentication utilities
├── 📄 cloudinary.ts                 # Cloudinary configuration
├── 📄 gemini.ts                     # Google Gemini AI client
├── 📄 twitter-client.ts             # Twitter API client
├── 📄 instagram-client.ts           # Instagram API client
├── 📄 user-utils.ts                 # User management utilities
├── 📄 cache.ts                      # Caching utilities
├── 📄 validation.ts                 # Input validation schemas
├── 📄 constants.ts                  # App constants
├── 📄 date-utils.ts                 # Date manipulation utilities
├── 📄 string-utils.ts               # String utilities
└── 📄 api-utils.ts                  # API helper functions
```

## 📊 Data Structure (`src/data/`)

```
src/data/
├── 📁 env/
│   └── 📄 envVars.ts               # Environment variables config
├── 📁 constants/
│   ├── 📄 platforms.ts             # Social platform constants
│   ├── 📄 post-types.ts            # Post type definitions
│   └── 📄 ai-prompts.ts            # AI prompt templates
├── 📁 mock/
│   ├── 📄 posts.ts                 # Mock post data
│   ├── 📄 analytics.ts             # Mock analytics data
│   └── 📄 users.ts                 # Mock user data
└── 📁 schemas/
    ├── 📄 post.schema.ts           # Post validation schemas
    ├── 📄 user.schema.ts           # User validation schemas
    └── 📄 api.schema.ts            # API validation schemas
```

## 🗃️ Database Structure (`prisma/`)

```
prisma/
├── 📄 schema.prisma                 # Main database schema
├── 📁 migrations/                   # Database migrations
│   ├── 📄 20231201_init/
│   ├── 📄 20231202_add_twitter/
│   ├── 📄 20231203_add_scheduler/
│   └── 📄 20231204_add_media/
└── 📄 seed.ts                       # Database seeding script
```

## 🎨 Static Assets (`public/`)

```
public/
├── 📄 favicon.ico                   # App favicon
├── 📄 logo.svg                      # App logo
├── 📁 icons/                        # App icons
│   ├── 📄 twitter.svg              # Twitter icon
│   ├── 📄 instagram.svg            # Instagram icon
│   ├── 📄 linkedin.svg             # LinkedIn icon
│   └── 📄 facebook.svg             # Facebook icon
├── 📁 images/                       # Static images
│   ├── 📄 hero-bg.jpg              # Hero background
│   ├── 📄 dashboard-preview.png    # Dashboard preview
│   └── 📄 features-showcase.png    # Features showcase
└── 📁 docs/                         # Documentation assets
    ├── 📄 api-flow.png             # API flow diagram
    └── 📄 architecture.png         # Architecture diagram
```

## 🔧 Configuration Files

```
Root Level Configuration:
├── 📄 .env                          # Environment variables
├── 📄 .env.example                  # Environment template
├── 📄 .gitignore                    # Git ignore rules
├── 📄 next.config.js                # Next.js configuration
├── 📄 package.json                  # Dependencies & scripts
├── 📄 tailwind.config.js            # Tailwind CSS config
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 components.json               # shadcn/ui configuration
├── 📄 .eslintrc.json               # ESLint configuration
├── 📄 .prettierrc                   # Prettier configuration
└── 📄 vercel.json                   # Vercel deployment config
```

## 📝 Documentation Files

```
Documentation:
├── 📄 PROJECT_OVERVIEW.md           # Complete project overview
├── 📄 FILE_STRUCTURE.md             # This file structure guide
├── 📄 README.md                     # Setup and installation guide
├── 📄 API_DOCUMENTATION.md          # API endpoints documentation
├── 📄 DEPLOYMENT_GUIDE.md           # Deployment instructions
├── 📄 CONTRIBUTING.md               # Contribution guidelines
└── 📄 CHANGELOG.md                  # Version history
```

## 🎯 Key File Purposes

### **Critical Files**
- `src/app/layout.tsx` - Root layout with providers (Clerk, themes)
- `src/lib/db.ts` - Database connection and Prisma client
- `prisma/schema.prisma` - Complete database schema
- `src/services/twitter.service.ts` - Core Twitter functionality
- `src/features/scheduler/components/scheduler-calendar.tsx` - Main scheduling interface

### **Configuration Files**
- `next.config.js` - Next.js app configuration
- `tailwind.config.js` - UI styling configuration
- `tsconfig.json` - TypeScript compiler settings
- `.env` - Environment variables and API keys

### **Entry Points**
- `src/app/page.tsx` - Landing page
- `src/app/(dashboard)/dashboard/page.tsx` - Main dashboard
- `src/app/api/*/route.ts` - API endpoints

This structure follows Next.js 14 App Router conventions with feature-based organization, making it easy to navigate, maintain, and scale the application.