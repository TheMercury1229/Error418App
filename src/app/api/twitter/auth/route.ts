import { NextRequest, NextResponse } from 'next/server';
import { TwitterService } from '@/services/twitter.service';
import { TwitterTokenDbService } from '@/services/twitter-token-db.service';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, codeVerifier, state } = TwitterService.generateAuthUrl();
    
    globalThis.twitterAuthStates = globalThis.twitterAuthStates || new Map();
    globalThis.twitterAuthStates.set(userId, { codeVerifier, state });

    return NextResponse.json({ authUrl: url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}