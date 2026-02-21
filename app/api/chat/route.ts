import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
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
  deleteChat,
  deleteMessagesByChatId,
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

    if (walletAddress && walletAddress !== '0x0000000000000000000000000000000000000000') {
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

      // Save user message immediately
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

    // Create UI message stream (like VeChain/Stacks pattern)
    // This gives us { messages } in onFinish with full parts including tool outputs
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const result = streamText({
          model: getModelProvider()(getDefaultModel()),
          system: systemPrompt,
          messages: modelMessages,
          tools,
          toolChoice: 'auto',
          stopWhen: stepCountIs(10),
        });

        result.consumeStream();
        writer.merge(result.toUIMessageStream());
      },
      generateId: generateUUID,
      onFinish: async ({ messages: responseMessages }) => {
        if (!userId) return;

        // Save all assistant messages with full parts (includes tool outputs)
        // VeChain/Stacks pattern: JSON.stringify(message.parts) directly
        const assistantMessages = responseMessages.filter(
          (m) => m.role === 'assistant'
        );

        if (assistantMessages.length > 0) {
          await saveMessages({
            chatId,
            messages: assistantMessages.map((message) => ({
              id: message.id,
              role: message.role,
              parts: message.parts,
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

    // Return the stream response (pipe through SSE transform)
    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('id');

    if (!chatId) {
      return new Response(
        JSON.stringify({ error: 'Chat ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete messages first (foreign key constraint)
    await deleteMessagesByChatId(chatId);
    // Then delete the chat
    await deleteChat(chatId);

    return new Response(
      JSON.stringify({ success: true }),
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
