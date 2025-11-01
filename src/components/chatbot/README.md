# Smart Chatbot Assistant

A context-aware AI chatbot powered by Google Gemini that helps users navigate and use the social media management platform.

## Features

- **Floating Widget**: Always visible button at bottom-right corner
- **Context-Aware**: Knows which page the user is on
- **Persistent State**: Chat history maintained across navigation
- **Smooth Animations**: Professional transitions and typing indicators
- **Route Navigation**: Can guide users to specific features

## Components

### ChatbotContext (`src/contexts/chatbot-context.tsx`)
Manages global chatbot state:
- Message history
- Open/closed state
- Loading state
- Message operations

### ChatbotWidget (`src/components/chatbot/chatbot-widget.tsx`)
Main UI component with:
- Floating button trigger
- Expandable chat panel
- Message display
- Input area with send button
- Typing indicator

### API Endpoint (`src/app/api/chatbot/route.ts`)
Backend integration:
- Accepts POST requests with `{ message, context }`
- Uses Google Gemini AI (gemini-2.5-flash)
- Returns contextual responses

## Usage

The chatbot is automatically available on all pages. Users can:
1. Click the floating button to open chat
2. Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac) to toggle chat
3. Type questions or requests
4. Press `Enter` to send messages
5. Get contextual help based on current page
6. Navigate to features via suggested routes

## Environment Variables

Required in `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

## Available Routes

The chatbot can guide users to:
- Dashboard: `/dashboard` (Home, overview, publishing posts)
- Image Studio: `/image-studio` (Image creation and editing)
- AI Video: `/ai-video` (Video creation and editing)
- AI Vision: `/ai-vision` (Image analysis and insights)
- Instagram Publisher: `/instagram-publisher` (Post to Instagram)
- Scheduler: `/scheduler` (Schedule posts, manage calendar)
- Voiceovers: `/voiceovers` (Video translation, dubbing, language conversion)
- Gallery: `/gallery` (View saved content and media)
- Analytics: `/analytics` (View metrics and engagement stats)
- Profile: `/profile` (User settings and preferences)
