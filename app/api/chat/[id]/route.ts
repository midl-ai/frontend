import { deleteChat, deleteMessagesByChatId, getChatById } from '@/lib/db/queries';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;

    if (!chatId) {
      return new Response(
        JSON.stringify({ error: 'Chat ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if chat exists
    const chat = await getChatById(chatId);
    if (!chat) {
      return new Response(
        JSON.stringify({ error: 'Chat not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete messages first (foreign key constraint)
    await deleteMessagesByChatId(chatId);
    // Then delete the chat
    await deleteChat(chatId);

    return new Response(
      JSON.stringify({ success: true, id: chatId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Chat API] Delete error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete chat' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
