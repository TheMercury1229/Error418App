# Chatbot Testing Guide

## Manual Testing Checklist

### 1. Visual Tests
- [ ] Floating button appears at bottom-right corner
- [ ] Button has smooth hover animation
- [ ] Chat panel opens with smooth transition
- [ ] Panel is properly sized (96 width, 600px height)
- [ ] Mobile view: Panel takes full screen

### 2. Functionality Tests
- [ ] Click floating button to open chat
- [ ] Welcome message displays on first open
- [ ] Type a message and press Enter to send
- [ ] Type a message and click Send button
- [ ] Loading indicator (three dots) appears while waiting
- [ ] AI response appears after loading
- [ ] Messages scroll automatically to bottom
- [ ] Clear button removes all messages except welcome
- [ ] Close button closes the panel
- [ ] Chat state persists when navigating between pages

### 3. Context Awareness Tests
Try these messages on different pages:

**On Dashboard:**
- "What can I do here?"
- "Show me analytics"

**On Twitter Publisher:**
- "How do I post a tweet?"
- "Take me to scheduler"

**On Analytics:**
- "What metrics can I see?"
- "Go to settings"

### 4. Edge Cases
- [ ] Send empty message (should be disabled)
- [ ] Send very long message
- [ ] Rapid multiple messages
- [ ] Network error handling
- [ ] API error handling

### 5. Accessibility
- [ ] Button has aria-label
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader compatible

## Expected Behaviors

1. **First Load**: Welcome message appears
2. **User Message**: Appears on right side with primary color
3. **AI Response**: Appears on left side with muted background
4. **Loading**: Three bouncing dots animation
5. **Navigation**: Chat history maintained across routes
6. **Mobile**: Full-screen overlay on small devices

## Common Issues

### Chatbot doesn't respond
- Check GEMINI_API_KEY in .env
- Check browser console for errors
- Verify /api/chatbot endpoint is accessible

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check shadcn/ui components are installed
- Verify theme provider is working

### State not persisting
- Ensure ChatbotProvider wraps the app
- Check React context is properly configured
