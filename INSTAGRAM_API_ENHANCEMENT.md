# Instagram API Enhancement Suggestions

## Current Issues

The Python Cloud Function `get_page_analytics` endpoint is missing several important fields that the frontend expects:

### Missing Fields in Account Info:
- `profile_picture_url` - User's Instagram profile picture
- `website` - Website URL from Instagram bio

### Missing Account Analytics:
- Account-level insights (reach, profile views, website clicks, etc.)

## Recommended Python API Updates

Update the `get_page_analytics` action in your Python Cloud Function:

```python
elif action == "get_page_analytics":
    try:
        result = {"account_id": instagram_account_id}
        
        # Account info with MORE fields
        account_url = f"https://graph.facebook.com/v23.0/{instagram_account_id}"
        account_params = {
            "fields": "id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website",
            "access_token": access_token,
        }
        account_res = requests.get(account_url, params=account_params)
        if account_res.status_code == 200:
            result["account_info"] = account_res.json()
        
        # Account-level insights (last 30 days)
        insights_url = f"https://graph.facebook.com/v23.0/{instagram_account_id}/insights"
        insights_params = {
            "metric": "reach,profile_views,website_clicks,accounts_engaged,total_interactions",
            "period": "day",
            "since": int(time.time()) - (30 * 24 * 60 * 60),  # Last 30 days
            "access_token": access_token,
        }
        insights_res = requests.get(insights_url, params=insights_params)
        if insights_res.status_code == 200:
            insights_data = insights_res.json()
            
            # Format account analytics
            account_analytics = {}
            for metric in insights_data.get("data", []):
                metric_name = metric.get("name")
                values = metric.get("values", [])
                if values:
                    # Get the most recent value
                    latest = values[-1]
                    account_analytics[metric_name] = {
                        "value": latest.get("value", 0),
                        "end_time": latest.get("end_time", "")
                    }
            
            result["account_analytics"] = account_analytics
        
        # Recent media with MORE fields
        media_url = f"https://graph.facebook.com/v23.0/{instagram_account_id}/media"
        media_params = {
            "fields": "id,media_type,media_url,permalink,timestamp,caption,like_count,comments_count",
            "limit": 12,  # Get last 12 posts for better metrics
            "access_token": access_token,
        }
        media_res = requests.get(media_url, params=media_params)
        if media_res.status_code == 200:
            media_data = media_res.json()
            result["recent_media"] = media_data
            
            # Calculate influencer metrics
            total_engagement = 0
            total_posts = len(media_data.get("data", []))
            
            for post in media_data.get("data", []):
                likes = post.get("like_count", 0)
                comments = post.get("comments_count", 0)
                total_engagement += likes + comments
            
            followers = result.get("account_info", {}).get("followers_count", 1)
            avg_engagement = total_engagement / total_posts if total_posts > 0 else 0
            engagement_rate = (avg_engagement / followers * 100 if followers > 0 else 0)
            
            result["influencer_metrics"] = {
                "total_posts_analyzed": total_posts,
                "average_engagement_per_post": round(avg_engagement, 2),
                "engagement_rate_percentage": round(engagement_rate, 2),
                "total_engagement_last_12_posts": total_engagement,
            }
        
        return add_cors_headers({"success": True, "data": result})
        
    except Exception as e:
        return add_cors_headers({"success": False, "error": str(e)}, 500)
```

## Key Changes:

1. **Added `profile_picture_url` and `website`** to account fields
2. **Added account-level insights** endpoint call for:
   - reach
   - profile_views
   - website_clicks
   - accounts_engaged
   - total_interactions
3. **Increased media limit** from 10 to 12 posts
4. **Added `media_url`** field to recent media
5. **Better error handling** for each API call

## Benefits:

- ✅ Complete profile information with picture and website
- ✅ Real account analytics instead of estimates
- ✅ More accurate engagement metrics
- ✅ Better data for dashboard visualization
- ✅ Matches TypeScript interface expectations

## Note:

Make sure your Instagram Business Account has the necessary permissions:
- `instagram_basic`
- `instagram_manage_insights`
- `pages_read_engagement`
- `pages_show_list`
