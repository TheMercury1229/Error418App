# Quick Start Guide - Smart Chatbot Assistant

## 🚀 Getting Started

The chatbot is already integrated and ready to use! Follow these steps to test it:

### 1. Verify Environment Variable

Check your `.env` file has:
```env
GEMINI_API_KEY=AIzaSyDEFv675px1hFkYoYddyQJkGZ3h6U24FrA
```
✅ Already configured!

### 2. Start Development Server

```bash
npm run dev
```

### 3. Test the Chatbot

1. Open your browser to `http://localhost:3000`
2. Look for the floating 💬 button at the bottom-right corner
3. Click it to open the chat panel
4. Try these example messages:

#### Example Conversations

**General Help:**
```
You: What can I do here?
Bot: [Contextual response based on current page]
```

**Navigation:**
```
You: Take me to the scheduler
Bot: You can visit the Scheduler at /scheduler to manage your scheduled posts...
```

**Feature Questions:**
```
You: How do I post a tweet?
Bot: [Explains Twitter publisher features]
```

**Page-Specific Help:**
```
On /dashboard:
You: Show me my analytics
Bot: You can view your Analytics at /analytics to see detailed metrics...
```

### 4. Keyboard Shortcuts

- **Toggle Chat**: `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac)
- **Send Message**: `Enter`
- **New Line**: `Shift+Enter`

### 5. Features to Try

- ✅ Send multiple messages
- ✅ Navigate to different pages (chat persists)
- ✅ Clear conversation (trash icon)
- ✅ Close and reopen (state persists)
- ✅ Test on mobile (responsive design)

## 🎯 What to Expect

### Chatbot Capabilities

The AI assistant can:
- ✅ Answer questions about platform features
- ✅ Guide you to specific pages
- ✅ Provide contextual help based on current page
- ✅ Suggest actions you can take
- ✅ Explain how to use different features

### Chatbot Limitations

The AI will NOT:
- ❌ Answer questions unrelated to the platform
- ❌ Perform actions directly (it guides you)
- ❌ Access your personal data
- ❌ Make API calls on your behalf

## 🐛 Troubleshooting

### Chatbot button doesn't appear
- Check browser console for errors
- Verify `ChatbotProvider` is in `src/components/provider.tsx`
- Ensure `ChatbotWidget` is rendered in Provider

### No response from chatbot
- Verify `GEMINI_API_KEY` in `.env`
- Check `/api/chatbot` endpoint is accessible
- Look for errors in browser console or terminal

### Styling issues
- Clear browser cache
- Restart dev server
- Check Tailwind CSS is working

### State not persisting
- Verify you're not refreshing the page
- Check React DevTools for context state
- Ensure `ChatbotProvider` wraps entire app

## 📱 Mobile Testing

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device
4. Test chatbot (should be full-screen)

## 🎨 Customization

### Change Colors
Edit `src/components/chatbot/chatbot-widget.tsx`:
```typescript
// User messages
className="bg-primary text-primary-foreground"

// Assistant messages
className="bg-muted"
```

### Change Position
```typescript
// Floating button
className="fixed bottom-6 right-6"

// Chat panel
className="fixed bottom-6 right-6"
```

### Change Size
```typescript
// Panel dimensions
className="w-96 h-[600px]"
```

## 🎉 You're All Set!

The Smart Chatbot Assistant is now fully functional. Enjoy using your AI-powered helper!

For more details, see:
- `README.md` - Full documentation
- `ARCHITECTURE.md` - Technical architecture
- `chatbot-test.md` - Complete testing guide
