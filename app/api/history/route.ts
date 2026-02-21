import { getChatsByUserId, getUserByAddress } from '@/lib/db/queries';

export const maxDuration = 30;

/**
 * Get chat history with cursor-based pagination.
 * Requires x-wallet-address header for authentication.
 */
export async function GET(request: Request) {
  try {
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
    return new Response(
      JSON.stringify({ error: 'Failed to fetch chat history' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
