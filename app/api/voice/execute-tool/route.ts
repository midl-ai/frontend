import { NextResponse } from 'next/server';
import { midlTools } from '@/lib/ai/tools';

interface ToolRequest {
  name: string;
  arguments: Record<string, unknown>;
}

/**
 * POST /api/voice/execute-tool
 * Execute a MIDL tool server-side and return the result
 */
export async function POST(request: Request) {
  try {
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

    // Execute the tool
    const toolFn = tool as { execute?: (args: unknown, context: unknown) => Promise<unknown> };

    if (!toolFn.execute) {
      return NextResponse.json(
        { success: false, error: `Tool ${name} has no execute method` },
        { status: 500 }
      );
    }

    const result = await toolFn.execute(args || {}, {
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
