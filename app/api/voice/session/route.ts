import { NextResponse } from 'next/server';
import { getMidlToolDefinitions, getMidlVoiceSystemPrompt } from '@/lib/voice/tool-mapping';

/** OpenAI Realtime API endpoint */
const OPENAI_REALTIME_URL = 'https://api.openai.com/v1/realtime/sessions';

/** Voice model to use */
const VOICE_MODEL = 'gpt-4o-realtime-preview-2024-12-17';

/** Default voice */
const DEFAULT_VOICE = 'verse';

interface Contact {
  name: string;
  evmAddress?: string;
  btcAddress?: string;
}

interface SessionRequest {
  contacts?: Contact[];
}

/**
 * POST /api/voice/session
 * Generate an ephemeral key for OpenAI Realtime API WebRTC connection
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Parse contacts from request body (optional)
    let contacts: Contact[] = [];
    try {
      const body: SessionRequest = await request.json();
      contacts = body.contacts ?? [];
    } catch {
      // No body or invalid JSON - use empty contacts
    }

    // Get tool definitions and system prompt
    const tools = getMidlToolDefinitions();
    const instructions = getMidlVoiceSystemPrompt(contacts);

    // Request ephemeral token from OpenAI
    const response = await fetch(OPENAI_REALTIME_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: VOICE_MODEL,
        voice: DEFAULT_VOICE,
        modalities: ['audio', 'text'],
        tools,
        instructions,
        input_audio_transcription: {
          model: 'whisper-1',
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[voice/session] OpenAI error:', response.status, errorText);
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[voice/session] Session created:', {
      model: VOICE_MODEL,
      toolCount: tools.length,
      contactCount: contacts.length,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[voice/session] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
