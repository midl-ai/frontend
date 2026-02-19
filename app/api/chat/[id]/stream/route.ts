import { getStreamIdsByChatId } from '@/lib/db/queries';

export const maxDuration = 60;

/**
 * Get stream status for a chat session.
 * Used to check if there's an active stream for reconnection.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;

    // Get stream IDs for this chat
    const streamIds = await getStreamIdsByChatId(chatId);

    if (!streamIds.length) {
      return Response.json({ hasActiveStream: false });
    }

    return Response.json({
      hasActiveStream: true,
      streamCount: streamIds.length,
    });
  } catch (error) {
    console.error('[Stream Status] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get stream status' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
