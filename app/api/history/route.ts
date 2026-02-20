import { getChatsByUserId, getUserByAddress, isDatabaseAvailable } from '@/lib/db/queries';

export const maxDuration = 30;

/**
 * Get chat history with cursor-based pagination.
 * Requires x-wallet-address header for authentication.
 * Returns empty list if database is not configured.
 */
export async function GET(request: Request) {
  try {
    // Return empty history if database not configured
    if (!isDatabaseAvailable()) {
      return Response.json({ chats: [], hasMore: false, nextCursor: null });
    }

    const { searchParams } = new URL(request.url);
    const startingAfter = searchParams.get('starting_after');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Get wallet address from header
    const walletAddress = request.headers.get('x-wallet-address');

    if (!walletAddress) {
      return Response.json({ chats: [], hasMore: false, nextCursor: null });
    }

    // Get user by wallet address
    const user = await getUserByAddress(walletAddress);

    if (!user) {
      return Response.json({ chats: [], hasMore: false, nextCursor: null });
    }

    // Get paginated chats
    const result = await getChatsByUserId({
      userId: user.id,
      limit: Math.min(limit, 50), // Cap at 50
      startingAfter: startingAfter || undefined,
    });

    return Response.json(result);
  } catch (error) {
    console.error('[History API] Error:', error);
    // Return empty history instead of error for graceful degradation
    return Response.json({ chats: [], hasMore: false, nextCursor: null });
  }
}
