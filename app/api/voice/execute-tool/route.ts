import { NextResponse } from 'next/server';
import { midlTools } from '@/lib/ai/tools';

interface ToolRequest {
  name: string;
  arguments: Record<string, unknown>;
}

/**
 * POST /api/voice/execute-tool
 * Execute a MIDL tool server-side and return the result
 * Wallet addresses passed via x-evm-address and x-btc-address headers
 */
export async function POST(request: Request) {
  try {
    // Get wallet addresses from headers
    const evmAddress = request.headers.get('x-evm-address');
    const btcAddress = request.headers.get('x-btc-address');

    const body = await request.json() as ToolRequest;
    const { name, arguments: args } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Tool name is required' },
        { status: 400 }
      );
    }

    // Get the tool
    const tool = midlTools[name as keyof typeof midlTools];

    if (!tool) {
      return NextResponse.json(
        { success: false, error: `Unknown tool: ${name}` },
        { status: 404 }
      );
    }

    // Inject wallet addresses into args if the tool needs them
    // Tools that check for address will use the provided address or fallback to args
    const enhancedArgs = { ...args } as Record<string, unknown>;

    // If the tool expects an address and none was provided, use wallet address
    if (!enhancedArgs.address && evmAddress) {
      enhancedArgs.address = evmAddress;
    }
    if (!enhancedArgs.ownerAddress && evmAddress) {
      enhancedArgs.ownerAddress = evmAddress;
    }
    if (!enhancedArgs.evmAddress && evmAddress) {
      enhancedArgs.evmAddress = evmAddress;
    }
    if (!enhancedArgs.btcAddress && btcAddress) {
      enhancedArgs.btcAddress = btcAddress;
    }

    console.log('[voice/execute-tool] Executing:', name, {
      args: enhancedArgs,
      evmAddress: evmAddress?.slice(0, 10) + '...',
      btcAddress: btcAddress?.slice(0, 10) + '...',
    });

    // Execute the tool
    const toolFn = tool as { execute?: (args: unknown, context: unknown) => Promise<unknown> };

    if (!toolFn.execute) {
      return NextResponse.json(
        { success: false, error: `Tool ${name} has no execute method` },
        { status: 500 }
      );
    }

    const result = await toolFn.execute(enhancedArgs, {
      messages: [],
      toolCallId: `voice-${Date.now()}`,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[voice/execute-tool] Error:', error);
    const message = error instanceof Error ? error.message : 'Tool execution failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
