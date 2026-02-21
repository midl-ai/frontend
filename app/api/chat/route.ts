import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  stepCountIs,
  type UIMessage,
} from 'ai';
import { getModelProvider, getDefaultModel } from '@/lib/ai/providers';
import { getSystemPrompt, extractChatTitle } from '@/lib/ai/prompts';
import { getMidlTools } from '@/lib/ai/tools';
import {
  saveMessages,
  createChat,
  getChatById,
  updateChatTitle,
  getOrCreateUserByAddress,
  getMessagesByChatId,
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
    let existingChat: Awaited<ReturnType<typeof getChatById>> | null = null;

    if (walletAddress) {
      const user = await getOrCreateUserByAddress(walletAddress);
      userId = user.id;

      // Create chat if it doesn't exist
      existingChat = await getChatById(chatId);
      if (!existingChat) {
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

      // Save user message
      const userMessage = messages[messages.length - 1];
      if (userMessage?.role === 'user') {
        await saveMessages({
          chatId,
          messages: [
            {
              id: userMessage.id,
              role: 'user',
              parts: userMessage.parts,
            },
          ],
        });
      }
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

    // Create UI message stream that properly formats tool results for persistence
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const result = streamText({
          model: getModelProvider()(getDefaultModel()),
          system: systemPrompt,
          messages: modelMessages,
          tools,
          stopWhen: stepCountIs(10),
        });

        result.consumeStream();
        writer.merge(result.toUIMessageStream());
      },
      generateId: generateUUID,
      onFinish: async ({ messages: uiMessages }) => {
        if (!userId) return;

        // Filter to get only assistant messages from this response
        const assistantMessages = uiMessages.filter(
          (m) => m.role === 'assistant'
        );

        if (assistantMessages.length > 0) {
          // Save messages with properly formatted parts (including state: 'output-available')
          await saveMessages({
            chatId,
            messages: assistantMessages.map((m) => ({
              id: m.id,
              role: m.role,
              parts: m.parts,
            })),
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
      onError: (error) => {
        console.error('[Chat API] Stream error:', error);
        return 'An error occurred while processing your request.';
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
