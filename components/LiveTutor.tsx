import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Power, Activity } from 'lucide-react';
import { Lesson } from '../types';
import { LiveTutorClient, decode, decodeAudioData } from '../services/geminiService';

interface LiveTutorProps {
  lesson: Lesson;
}

export const LiveTutor: React.FC<LiveTutorProps> = ({ lesson }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const clientRef = useRef<LiveTutorClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Initialize AudioContext only when needed or on mount, but handle errors gracefully
  useEffect(() => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
        }
    } catch (e) {
        console.error("AudioContext not supported or failed to initialize", e);
    }
    
    return () => { 
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(console.error); 
        }
    };
  }, []);

  const toggleConnection = async () => {
    if (isConnected) {
      if (clientRef.current) {
        clientRef.current.disconnect();
        clientRef.current = null;
      }
      setIsConnected(false);
      setIsPlaying(false);
      return;
    }

    setError(null);
    
    // Ensure AudioContext is ready
    if (audioContextRef.current?.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (e) {
        console.error("Failed to resume AudioContext", e);
      }
    }
    
    clientRef.current = new LiveTutorClient(lesson, {
      onOpen: () => setIsConnected(true),
      onClose: () => {
        setIsConnected(false);
        setIsPlaying(false);
      },
      onError: (err) => {
        setError("Mic/Net Error");
        setIsConnected(false);
      },
      onAudioData: async (base64Data) => {
        if (!audioContextRef.current) return;
        setIsPlaying(true);
        const ctx = audioContextRef.current;
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

        try {
          const audioBuffer = await decodeAudioData(decode(base64Data), ctx, 24000, 1);
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          source.addEventListener('ended', () => {
             setIsPlaying(false);
          });
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += audioBuffer.duration;
        } catch (e) { console.error(e); }
      }
    });

    await clientRef.current.connect();
  };

  useEffect(() => {
    return () => {
      if (clientRef.current) {
          clientRef.current.disconnect();
          clientRef.current = null;
      }
    };
  }, [lesson.id]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pointer-events-none">
      <div className={`
        pointer-events-auto
        flex items-center gap-4 bg-ink-900 text-paper-50 rounded-full px-2 py-2 shadow-float border border-ink-800
        transition-all duration-300
        ${isConnected ? 'pl-6 pr-2' : 'pl-2 pr-6'}
      `}>
        
        {/* Status Indicator */}
        <div className={`
          h-10 w-10 rounded-full flex items-center justify-center transition-all
          ${isConnected 
            ? 'bg-accent-600 text-white' 
            : 'bg-ink-800 text-ink-400'
          }
        `}>
           {isConnected ? <Activity size={18} className={isPlaying ? "animate-pulse" : ""} /> : <Mic size={18} />}
        </div>

        {/* Text Area */}
        <div className="flex flex-col justify-center min-w-[120px]">
           <span className="text-xs font-bold tracking-wider uppercase text-paper-300">
             {isConnected ? 'Session Active' : 'AI Tutor'}
           </span>
           <span className="text-[10px] text-ink-500 font-mono truncate max-w-[150px]">
             {isConnected ? (isPlaying ? 'Speaking...' : 'Listening...') : 'Ready to start'}
           </span>
        </div>

        {/* Action Button */}
        <button
          onClick={toggleConnection}
          className={`
            h-10 px-6 rounded-full font-bold text-xs uppercase tracking-widest transition-all
            ${isConnected 
               ? 'bg-ink-800 text-white hover:bg-ink-700' 
               : 'bg-paper-50 text-ink-900 hover:bg-white'
            }
          `}
        >
          {isConnected ? 'End' : 'Start'}
        </button>
        
        {error && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent-600 text-white text-[10px] px-2 py-1 rounded shadow-sm">
                {error}
            </div>
        )}
      </div>
    </div>
  );
}