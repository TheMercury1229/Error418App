import { NextRequest, NextResponse } from 'next/server';
import { TwitterTokenDbService } from '@/services/twitter-token-db.service';
import { TwitterService } from '@/services/twitter.service';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, mediaUrls } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tweet text is required' },
        { status: 400 }
      );
    }

    if (text.length > 280) {
      return NextResponse.json(
        { error: 'Tweet text exceeds 280 characters' },
        { status: 400 }
      );
    }

    const tokens = await TwitterTokenDbService.refreshTokensIfNeeded(userId);
    
    if (!tokens) {
      return NextResponse.json(
        { error: 'Twitter not authenticated' },
        { status: 401 }
      );
    }

    const twitterService = new TwitterService(tokens);
    

    
    console.log('🚀 Publishing tweet...');
    // Post tweet
    const tweet = await twitterService.postTweet(text);
    console.log('✅ Tweet published successfully:', {
      id: tweet.id,
      textLength: tweet.text.length
    });

    return NextResponse.json({
      success: true,
      tweet: {
        id: tweet.id,
        text: tweet.text,
        url: `https://twitter.com/i/web/status/${tweet.id}`,
      },
    });
  } catch (error) {
    console.error('Twitter publish error:', error);
    
    // Handle specific Twitter API errors
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Twitter authentication expired' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Duplicate tweet detected' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('Rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to publish tweet' },
      { status: 500 }
    );
  }
}