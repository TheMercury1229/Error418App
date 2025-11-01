# Chatbot Architecture

## Component Hierarchy

```
RootLayout (src/app/layout.tsx)
└── Provider (src/components/provider.tsx)
    └── ChatbotProvider (src/contexts/chatbot-context.tsx)
        ├── {children} (All app pages)
        └── ChatbotWidget (src/components/chatbot/chatbot-widget.tsx)
```

## Data Flow

```
User Action (Click/Type)
    ↓
ChatbotWidget Component
    ↓
useChatbot Hook (Context)
    ↓
Add User Message to State
    ↓
POST /api/chatbot
    ↓
Gemini AI Processing
    ↓
Response
    ↓
Add Assistant Message to State
    ↓
UI Updates (Auto-scroll)
```

## State Management

```typescript
ChatbotContext {
  messages: ChatMessage[]      // All conversation history
  isOpen: boolean             // Panel visibility
  isLoading: boolean          // AI processing state
  addMessage()                // Add new message
  setIsOpen()                 // Toggle panel
  setIsLoading()              // Update loading state
  clearMessages()             // Reset conversation
}
```

## API Request/Response

### Request
```typescript
POST /api/chatbot
{
  message: string,
  context: {
    path: string  // Current route (e.g., "/dashboard")
  }
}
```

### Response
```typescript
{
  reply: string  // AI-generated response
}
```

## Component Responsibilities

### ChatbotContext
- Global state management
- Message persistence across routes
- State operations (CRUD)

### ChatbotWidget
- UI rendering
- User interactions
- API communication
- Route detection (usePathname)
- Keyboard shortcuts

### API Route
- Gemini AI integration
- Prompt engineering
- Context injection
- Error handling

## Styling Architecture

```
Tailwind CSS (Utility-first)
    ↓
shadcn/ui Components (Button, Card, Textarea)
    ↓
Custom Animations (Tailwind animate-in)
    ↓
Responsive Breakpoints (max-sm:)
```

## Security Considerations

1. **API Key**: Stored in environment variable (server-side only)
2. **Input Validation**: Message type checking
3. **Error Handling**: Graceful fallbacks
4. **Rate Limiting**: Consider implementing for production

## Performance Optimizations

1. **Context Memoization**: Prevents unnecessary re-renders
2. **Auto-scroll**: Only on message changes
3. **Lazy Loading**: Widget only renders when needed
4. **Keyboard Shortcuts**: Event listener cleanup

## Accessibility Features

1. **ARIA Labels**: Floating button has descriptive label
2. **Keyboard Navigation**: Full keyboard support
3. **Focus Management**: Proper tab order
4. **Screen Reader**: Semantic HTML structure
