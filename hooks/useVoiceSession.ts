'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import { isTransactionTool } from '@/lib/voice/tool-mapping';
import type { PreparedTransaction } from '@/lib/ai/tools/types';

/** Voice session status */
export type VoiceSessionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'processing'
  | 'signing'
  | 'error';

/** Transcript entry */
export interface TranscriptEntry {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  text: string;
  timestamp: string;
  isFinal: boolean;
  status?: 'speaking' | 'processing' | 'final';
  toolName?: string;
  toolResult?: unknown;
}

/** Pending tool call from AI */
export interface PendingToolCall {
  callId: string;
  name: string;
  arguments: Record<string, unknown>;
}

/** Contact for voice mode */
export interface VoiceContact {
  name: string;
  evmAddress?: string;
  btcAddress?: string;
}

/** Wallet context for tool execution */
export interface WalletContext {
  evmAddress?: string;
  btcAddress?: string;
}

/** Hook return type */
export interface UseVoiceSessionReturn {
  status: VoiceSessionStatus;
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: TranscriptEntry[];
  currentVolume: number;
  error: string | null;
  pendingTransaction: PreparedTransaction | null;
  startSession: (contacts?: VoiceContact[], walletContext?: WalletContext) => Promise<void>;
  stopSession: () => void;
  onTransactionComplete: (result: { success: boolean; txHash?: string; error?: string }) => void;
  onTransactionCancel: () => void;
}

/** Generate unique ID */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Voice session hook for OpenAI Realtime API
 * Manages WebRTC connection, audio streams, and tool execution
 */
export function useVoiceSession(): UseVoiceSessionReturn {
  // SWR for history refresh after transactions
  const { mutate } = useSWRConfig();

  // Session state
  const [status, setStatus] = useState<VoiceSessionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Transaction state
  const [pendingTransaction, setPendingTransaction] = useState<PreparedTransaction | null>(null);
  const pendingToolCallRef = useRef<PendingToolCall | null>(null);

  // Wallet context for tool execution
  const walletContextRef = useRef<WalletContext | null>(null);

  // WebRTC refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);

  // Ephemeral user message tracking
  const ephemeralUserIdRef = useRef<string | null>(null);

  const isActive = status === 'connected' || status === 'processing' || status === 'signing';

  /** Cleanup all resources */
  const cleanup = useCallback(() => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    analyserRef.current = null;
    ephemeralUserIdRef.current = null;
    pendingToolCallRef.current = null;
    setCurrentVolume(0);
    setIsListening(false);
    setIsSpeaking(false);
  }, []);

  /** Get or create ephemeral user message ID */
  const getOrCreateEphemeralUserId = useCallback((): string => {
    let id = ephemeralUserIdRef.current;
    if (!id) {
      id = generateId();
      ephemeralUserIdRef.current = id;

      const entry: TranscriptEntry = {
        id,
        role: 'user',
        text: '',
        timestamp: new Date().toISOString(),
        isFinal: false,
        status: 'speaking',
      };
      setTranscript((prev) => [...prev, entry]);
    }
    return id;
  }, []);

  /** Update ephemeral user message */
  const updateEphemeralUser = useCallback((partial: Partial<TranscriptEntry>) => {
    const id = ephemeralUserIdRef.current;
    if (!id) return;

    setTranscript((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...partial } : entry))
    );
  }, []);

  /** Clear ephemeral user message */
  const clearEphemeralUser = useCallback(() => {
    ephemeralUserIdRef.current = null;
  }, []);

  /** Calculate volume from analyser */
  const getVolume = useCallback((): number => {
    if (!analyserRef.current) return 0;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const float = (dataArray[i] - 128) / 128;
      sum += float * float;
    }
    return Math.sqrt(sum / dataArray.length);
  }, []);

  /** Tool execution result type */
  interface ToolResult {
    success: boolean;
    data?: unknown;
    error?: string;
  }

  /** Execute a tool by name via server-side API */
  const executeTool = useCallback(async (name: string, args: Record<string, unknown>): Promise<ToolResult> => {
    console.log('[voice] Executing tool via API:', name, args);

    // Build headers with wallet context
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const wallet = walletContextRef.current;
    if (wallet?.evmAddress) headers['x-evm-address'] = wallet.evmAddress;
    if (wallet?.btcAddress) headers['x-btc-address'] = wallet.btcAddress;

    try {
      const response = await fetch('/api/voice/execute-tool', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, arguments: args }),
      });

      const result = await response.json() as ToolResult;
      return result;
    } catch (err) {
      console.error('[voice] Tool execution error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Tool execution failed',
      };
    }
  }, []);

  /** Send tool result back to AI */
  const sendToolResult = useCallback((callId: string, result: unknown) => {
    const dc = dataChannelRef.current;
    if (!dc || dc.readyState !== 'open') {
      console.error('[voice] Cannot send tool result - data channel not ready');
      return;
    }

    // Send function call output
    const response = {
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: callId,
        output: JSON.stringify(result),
      },
    };
    dc.send(JSON.stringify(response));

    // Request AI response
    dc.send(JSON.stringify({ type: 'response.create' }));
  }, []);

  /** Handle tool call from AI */
  const handleToolCall = useCallback(
    async (callId: string, name: string, argsJson: string) => {
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(argsJson);
      } catch {
        args = {};
      }

      // Add tool entry to transcript
      const toolEntry: TranscriptEntry = {
        id: generateId(),
        role: 'tool',
        text: `Executing ${name}...`,
        timestamp: new Date().toISOString(),
        isFinal: false,
        toolName: name,
      };
      setTranscript((prev) => [...prev, toolEntry]);

      // Check if this requires transaction signing
      if (isTransactionTool(name)) {
        console.log('[voice] Transaction tool detected:', name);
        setStatus('signing');

        // Execute tool to get transaction data
        const result = await executeTool(name, args);
        const resultData = result.data as { transaction?: PreparedTransaction } | undefined;

        if (result.success && resultData?.transaction) {
          // Store pending tool call for later
          pendingToolCallRef.current = { callId, name, arguments: args };
          setPendingTransaction(resultData.transaction);

          // Update transcript
          setTranscript((prev) =>
            prev.map((e) =>
              e.id === toolEntry.id
                ? { ...e, text: `${name}: Waiting for signature...`, isFinal: false }
                : e
            )
          );
          return; // Don't send result yet - wait for signing
        } else {
          // Tool failed - send error result
          sendToolResult(callId, result);
          setTranscript((prev) =>
            prev.map((e) =>
              e.id === toolEntry.id
                ? { ...e, text: `${name}: ${result.error ?? 'Failed'}`, isFinal: true, toolResult: result }
                : e
            )
          );
          setStatus('connected');
          return;
        }
      }

      // Non-transaction tool - execute directly
      setStatus('processing');
      const result = await executeTool(name, args);

      // Update transcript with result
      setTranscript((prev) =>
        prev.map((e) =>
          e.id === toolEntry.id
            ? {
                ...e,
                text: `${name}: ${result.success ? 'Done' : result.error ?? 'Failed'}`,
                isFinal: true,
                toolResult: result,
              }
            : e
        )
      );

      // Send result back to AI
      sendToolResult(callId, result);
      setStatus('connected');
    },
    [executeTool, sendToolResult]
  );

  /** Handle data channel messages */
  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        // console.log('[voice] Message:', msg.type);

        switch (msg.type) {
          case 'input_audio_buffer.speech_started':
            setIsListening(true);
            getOrCreateEphemeralUserId();
            updateEphemeralUser({ status: 'speaking' });
            break;

          case 'input_audio_buffer.speech_stopped':
            setIsListening(false);
            break;

          case 'input_audio_buffer.committed':
            updateEphemeralUser({ text: 'Processing...', status: 'processing' });
            break;

          case 'conversation.item.input_audio_transcription':
            updateEphemeralUser({
              text: msg.transcript ?? 'Speaking...',
              status: 'speaking',
            });
            break;

          case 'conversation.item.input_audio_transcription.completed':
            updateEphemeralUser({
              text: msg.transcript || '',
              isFinal: true,
              status: 'final',
            });
            clearEphemeralUser();
            break;

          case 'response.audio_transcript.delta':
            setIsSpeaking(true);
            setTranscript((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'assistant' && !last.isFinal) {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...last,
                  text: last.text + msg.delta,
                };
                return updated;
              }
              return [
                ...prev,
                {
                  id: generateId(),
                  role: 'assistant',
                  text: msg.delta,
                  timestamp: new Date().toISOString(),
                  isFinal: false,
                },
              ];
            });
            break;

          case 'response.audio_transcript.done':
            setIsSpeaking(false);
            setTranscript((prev) => {
              if (prev.length === 0) return prev;
              const updated = [...prev];
              updated[updated.length - 1].isFinal = true;
              return updated;
            });
            break;

          case 'response.function_call_arguments.done':
            await handleToolCall(msg.call_id, msg.name, msg.arguments);
            break;

          case 'error':
            console.error('[voice] Server error:', msg.error);
            setError(msg.error?.message || 'Unknown error');
            break;
        }
      } catch (err) {
        console.error('[voice] Message parse error:', err);
      }
    },
    [getOrCreateEphemeralUserId, updateEphemeralUser, clearEphemeralUser, handleToolCall]
  );

  /** Start voice session */
  const startSession = useCallback(
    async (contacts: VoiceContact[] = [], walletContext?: WalletContext) => {
      try {
        setStatus('connecting');
        setError(null);
        setTranscript([]);

        // Store wallet context for tool execution
        walletContextRef.current = walletContext || null;

        // Request microphone
        console.log('[voice] Requesting microphone...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;

        // Setup audio context for visualization
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        // Get ephemeral token
        console.log('[voice] Fetching session token...');
        const tokenResponse = await fetch('/api/voice/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contacts }),
        });

        if (!tokenResponse.ok) {
          throw new Error(`Failed to get session: ${tokenResponse.status}`);
        }

        const sessionData = await tokenResponse.json();
        const ephemeralToken = sessionData.client_secret?.value;

        if (!ephemeralToken) {
          throw new Error('No ephemeral token in response');
        }

        // Create WebRTC connection
        console.log('[voice] Creating WebRTC connection...');
        const pc = new RTCPeerConnection();
        peerConnectionRef.current = pc;

        // Create audio element for AI voice output
        const audioEl = document.createElement('audio');
        audioEl.autoplay = true;

        // Handle incoming audio track (AI voice)
        pc.ontrack = (event) => {
          audioEl.srcObject = event.streams[0];

          // Setup analyser for volume visualization
          const audioCtx = new AudioContext();
          const src = audioCtx.createMediaStreamSource(event.streams[0]);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          src.connect(analyser);
          analyserRef.current = analyser;

          // Start volume monitoring
          volumeIntervalRef.current = window.setInterval(() => {
            setCurrentVolume(getVolume());
          }, 100);
        };

        // Create data channel for messages
        const dataChannel = pc.createDataChannel('response');
        dataChannelRef.current = dataChannel;

        dataChannel.onopen = () => {
          console.log('[voice] Data channel open');

          // Send session.update to configure the session after connection
          // This ensures proper turn detection and prevents multiple responses
          const sessionUpdate = {
            type: 'session.update',
            session: {
              modalities: ['text', 'audio'],
              input_audio_transcription: {
                model: 'whisper-1',
              },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 800, // Increased to prevent premature cutoffs
                create_response: true,
              },
            },
          };
          dataChannel.send(JSON.stringify(sessionUpdate));
          console.log('[voice] Session update sent');

          setStatus('connected');
        };

        dataChannel.onmessage = handleMessage;

        dataChannel.onerror = (err) => {
          console.error('[voice] Data channel error:', err);
          setError('Connection error');
        };

        // Add microphone track
        pc.addTrack(stream.getTracks()[0]);

        // Create and send offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const model = 'gpt-4o-realtime-preview-2024-12-17';
        const voice = 'verse';
        const realtimeUrl = `https://api.openai.com/v1/realtime?model=${model}&voice=${voice}`;

        const sdpResponse = await fetch(realtimeUrl, {
          method: 'POST',
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${ephemeralToken}`,
            'Content-Type': 'application/sdp',
          },
        });

        if (!sdpResponse.ok) {
          throw new Error(`WebRTC negotiation failed: ${sdpResponse.status}`);
        }

        const answerSdp = await sdpResponse.text();
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

        console.log('[voice] Session established');
      } catch (err) {
        console.error('[voice] Start session error:', err);
        setError(err instanceof Error ? err.message : 'Failed to start session');
        setStatus('error');
        cleanup();
      }
    },
    [cleanup, getVolume, handleMessage]
  );

  /** Stop voice session */
  const stopSession = useCallback(() => {
    console.log('[voice] Stopping session');
    cleanup();
    setStatus('idle');
    setPendingTransaction(null);
    // Refresh chat history
    mutate('/api/history?limit=50');
  }, [cleanup, mutate]);

  /** Called when transaction completes (signed and broadcast) */
  const onTransactionComplete = useCallback(
    (result: { success: boolean; txHash?: string; error?: string }) => {
      const pendingCall = pendingToolCallRef.current;
      if (!pendingCall) {
        console.warn('[voice] No pending tool call for transaction result');
        return;
      }

      console.log('[voice] Transaction complete:', result);

      // Update transcript
      setTranscript((prev) =>
        prev.map((e) =>
          e.toolName === pendingCall.name && !e.isFinal
            ? {
                ...e,
                text: result.success
                  ? `${pendingCall.name}: Success! TX: ${result.txHash?.slice(0, 10)}...`
                  : `${pendingCall.name}: ${result.error || 'Failed'}`,
                isFinal: true,
                toolResult: result,
              }
            : e
        )
      );

      // Send result to AI
      sendToolResult(pendingCall.callId, {
        success: result.success,
        data: result.success ? { txHash: result.txHash } : undefined,
        error: result.error,
      });

      // Refresh chat history in sidebar
      mutate('/api/history?limit=50');

      // Clear pending state
      pendingToolCallRef.current = null;
      setPendingTransaction(null);
      setStatus('connected');
    },
    [sendToolResult, mutate]
  );

  /** Called when transaction is cancelled */
  const onTransactionCancel = useCallback(() => {
    const pendingCall = pendingToolCallRef.current;
    if (!pendingCall) return;

    console.log('[voice] Transaction cancelled');

    // Update transcript
    setTranscript((prev) =>
      prev.map((e) =>
        e.toolName === pendingCall.name && !e.isFinal
          ? { ...e, text: `${pendingCall.name}: Cancelled by user`, isFinal: true }
          : e
      )
    );

    // Send cancellation to AI
    sendToolResult(pendingCall.callId, {
      success: false,
      error: 'Transaction cancelled by user',
    });

    pendingToolCallRef.current = null;
    setPendingTransaction(null);
    setStatus('connected');
  }, [sendToolResult]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    isActive,
    isListening,
    isSpeaking,
    transcript,
    currentVolume,
    error,
    pendingTransaction,
    startSession,
    stopSession,
    onTransactionComplete,
    onTransactionCancel,
  };
}
