# Chatbot Route Mappings

## Feature to Route Mapping

This document shows how user requests map to specific routes.

### Video & Translation
| User Request | Route | Feature |
|-------------|-------|---------|
| "Translate my video" | `/voiceovers` | Video translation & dubbing |
| "Hindi to English video" | `/voiceovers` | Language conversion |
| "Add voiceover" | `/voiceovers` | Voiceover generation |
| "Dub my video" | `/voiceovers` | Video dubbing |

### Publishing & Dashboard
| User Request | Route | Feature |
|-------------|-------|---------|
| "Publish a post" | `/dashboard` | Post publishing |
| "Go home" | `/dashboard` | Main dashboard |
| "Website information" | `/dashboard` | Platform overview |
| "Quick actions" | `/dashboard` | Dashboard features |

### Image Features
| User Request | Route | Feature |
|-------------|-------|---------|
| "Create an image" | `/image-studio` | Image creation |
| "Edit image" | `/image-studio` | Image editing |
| "Analyze image" | `/ai-vision` | Image analysis |
| "Get insights about image" | `/ai-vision` | AI image insights |
| "What's in this image?" | `/ai-vision` | Image recognition |

### Video Creation
| User Request | Route | Feature |
|-------------|-------|---------|
| "Create a video" | `/ai-video` | Video creation |
| "Edit video" | `/ai-video` | Video editing |
| "Generate video" | `/ai-video` | AI video generation |

### Social Media
| User Request | Route | Feature |
|-------------|-------|---------|
| "Post to Instagram" | `/instagram-publisher` | Instagram publishing |
| "Instagram content" | `/instagram-publisher` | Instagram features |

### Scheduling
| User Request | Route | Feature |
|-------------|-------|---------|
| "Schedule a post" | `/scheduler` | Post scheduling |
| "Calendar" | `/scheduler` | Schedule calendar |
| "Scheduled posts" | `/scheduler` | View scheduled content |
| "Post tomorrow" | `/scheduler` | Schedule future posts |

### Content Management
| User Request | Route | Feature |
|-------------|-------|---------|
| "View my content" | `/gallery` | Saved content |
| "My media" | `/gallery` | Media gallery |
| "Saved posts" | `/gallery` | Content library |

### Analytics & Stats
| User Request | Route | Feature |
|-------------|-------|---------|
| "Show analytics" | `/analytics` | Performance metrics |
| "View stats" | `/analytics` | Engagement data |
| "How am I doing?" | `/analytics` | Performance overview |

### Profile & Settings
| User Request | Route | Feature |
|-------------|-------|---------|
| "My profile" | `/profile` | User profile |
| "Account settings" | `/profile` | Settings & preferences |
| "Change settings" | `/profile` | Configuration |

## Complete Route List

```
/dashboard          - Home, overview, publishing
/image-studio       - Image creation & editing
/ai-video          - Video creation & editing
/ai-vision         - Image analysis & insights
/instagram-publisher - Instagram publishing
/scheduler         - Post scheduling & calendar
/voiceovers        - Video translation & dubbing
/gallery           - Saved content & media
/analytics         - Metrics & performance
/profile           - User settings & profile
```

## Navigation Rules

1. **Only use routes from the list above** - No other routes exist
2. **Be specific** - Match user intent to the right feature
3. **Offer navigation** - Always ask "Would you like me to take you there?"
4. **Use pattern** - Include `[NAVIGATE:/route]` in response

## Example Conversations

### Video Translation
```
User: "I have a Hindi video, need English version"
Bot: "Yes! We have video translation in Voiceovers that can help you 
translate your Hindi video to English. Would you like me to take you 
there? [NAVIGATE:/voiceovers]"
```

### Image Analysis
```
User: "Can you analyze this image?"
Bot: "Yes! We have AI Vision that can analyze your images and provide 
detailed insights. Would you like me to take you there? [NAVIGATE:/ai-vision]"
```

### Publishing
```
User: "How do I publish a post?"
Bot: "You can publish posts directly from the Dashboard! Would you like 
me to take you there? [NAVIGATE:/dashboard]"
```

### Scheduling
```
User: "Schedule a post for tomorrow"
Bot: "Yes! You can schedule posts in our Scheduler where you can set 
specific dates and times. Would you like me to take you there? 
[NAVIGATE:/scheduler]"
```

## Important Notes

- **Dashboard = Home**: When users ask for "home" or "main page", use `/dashboard`
- **Voiceovers = Translation**: All video translation/dubbing goes to `/voiceovers`
- **AI Vision = Image Analysis**: Image insights and analysis use `/ai-vision`
- **Image Studio ≠ AI Vision**: Studio is for creation, Vision is for analysis
- **No Twitter Publisher**: This route doesn't exist in the current navigation
- **No Studio**: Use specific routes like `/ai-video`, `/image-studio`, or `/voiceovers`
