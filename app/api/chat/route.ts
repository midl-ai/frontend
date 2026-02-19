import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  type UIMessage,
} from 'ai';
import { getAnthropicProvider, DEFAULT_MODEL } from '@/lib/ai/providers';
import { getSystemPrompt, extractChatTitle } from '@/lib/ai/prompts';
import { getMidlTools } from '@/lib/ai/tools';
import {
  saveMessages,
  createChat,
  getChatById,
  updateChatTitle,
  getOrCreateUserByAddress,
} from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      messages,
      id: chatId,
    }: {
      messages: UIMessage[];
      id: string;
    } = await request.json();

    // Get wallet address from header (if connected)
    const walletAddress = request.headers.get('x-wallet-address');
    const evmAddress = request.headers.get('x-evm-address');
    const btcAddress = request.headers.get('x-btc-address');

    // Get or create user if wallet connected
    let userId: string | undefined;
    if (walletAddress) {
      const user = await getOrCreateUserByAddress(walletAddress);
      userId = user.id;
    }

    // Create chat if it doesn't exist
    const existingChat = await getChatById(chatId);
    if (!existingChat && userId) {
      const firstUserMessage = messages.find((m) => m.role === 'user');
      const firstPart = firstUserMessage?.parts?.[0];
      const messageText =
        firstPart && 'text' in firstPart ? firstPart.text : 'New Chat';
      const title = extractChatTitle(messageText);

      await createChat({
        id: chatId,
        userId,
        title,
        visibility: 'private',
        createdAt: new Date(),
      });
    }

    // Get system prompt with wallet context
    const systemPrompt = getSystemPrompt({
      evmAddress: evmAddress || undefined,
      btcAddress: btcAddress || undefined,
    });

    // Get tools
    const tools = getMidlTools();

    // Convert UI messages to model messages
    const modelMessages = await convertToModelMessages(messages);

    // Create streaming response with tools
    const result = streamText({
      model: getAnthropicProvider()(DEFAULT_MODEL),
      system: systemPrompt,
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(10), // Allow up to 10 tool calling steps
      onFinish: async ({ response }) => {
        // Save messages to database
        const assistantMessages = response.messages.filter(
          (m) => m.role === 'assistant'
        );

        if (assistantMessages.length > 0 && userId) {
          const messagesToSave = assistantMessages.map((m) => ({
            id: generateUUID(),
            role: m.role,
            parts: Array.isArray(m.content) ? m.content : [{ type: 'text', text: String(m.content) }],
          }));

          await saveMessages({
            chatId,
            messages: messagesToSave,
          });

          // Update chat title if this is the first response
          if (!existingChat) {
            const firstUserMessage = messages.find((m) => m.role === 'user');
            const firstPart = firstUserMessage?.parts?.[0];
            const messageText =
              firstPart && 'text' in firstPart ? firstPart.text : '';
            if (messageText) {
              await updateChatTitle(chatId, extractChatTitle(messageText));
            }
          }
        }
      },
    });

    // Return UI message stream response for the AI SDK v6 useChat hook
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
