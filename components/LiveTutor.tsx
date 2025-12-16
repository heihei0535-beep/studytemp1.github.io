import React, { useEffect, useState, useRef } from 'react';
import { Mic, Activity, Headphones, Power } from 'lucide-react';
import { Lesson } from '../types';
import { LiveTutorClient, decode, decodeAudioData } from '../services/geminiService';

interface LiveTutorProps {
  lesson: Lesson;
}

export const LiveTutor: React.FC<LiveTutorProps> = ({ lesson }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const clientRef = useRef<LiveTutorClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const timerRef = useRef<number | undefined>(undefined);

  // Timer logic
  useEffect(() => {
    if (isConnected) {
      timerRef.current = window.setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    } else {
      setDuration(0);
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio Context Setup
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    return () => { audioContextRef.current?.close(); };
  }, []);

  const toggleConnection = async () => {
    if (isConnected) {
      clientRef.current?.disconnect();
      setIsConnected(false);
      setIsPlaying(false);
      return;
    }

    setError(null);

    // Resume AudioContext context if suspended (browser autoplay policy)
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    clientRef.current = new LiveTutorClient(lesson, {
      onOpen: () => setIsConnected(true),
      onClose: () => {
        setIsConnected(false);
        setIsPlaying(false);
      },
      onError: (err) => {
        setError(err.name === 'NotAllowedError' ? "请允许麦克风权限" : "连接断开");
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
            sourcesRef.current.delete(source);
            if (sourcesRef.current.size === 0) setIsPlaying(false);
          });
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += audioBuffer.duration;
          sourcesRef.current.add(source);
        } catch (e) { console.error(e); }
      }
    });

    await clientRef.current.connect();
  };

  useEffect(() => {
    return () => {
      if (clientRef.current) clientRef.current.disconnect();
    };
  }, [lesson.id]);

  return (
    <div className="fixed bottom-0 left-0 md:left-72 right-0 z-50">
      {/* Main Console Bar */}
      <div className={`
        relative flex items-center justify-between px-6 py-4 transition-all duration-500 ease-in-out
        ${isConnected ? 'bg-academy-900 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.2)]' : 'bg-white border-t border-gray-200 shadow-sm'}
      `}>
        
        {/* Left: Status & Info */}
        <div className="flex items-center gap-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300
            ${isConnected ? 'bg-red-500/20 text-red-500' : 'bg-blue-50 text-blue-600'}
          `}>
             {isConnected ? <Activity className="animate-pulse" /> : <Headphones />}
          </div>
          <div>
            <h3 className={`text-sm font-bold ${isConnected ? 'text-white' : 'text-gray-900'}`}>
              {isConnected ? 'Live Session Active' : 'AI Speaking Partner'}
            </h3>
            <div className="flex items-center gap-2 text-xs">
              {isConnected ? (
                <>
                  <span className="text-red-400 font-mono">{formatTime(duration)}</span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span className="text-gray-400">{isPlaying ? 'AI Speaking...' : 'Listening...'}</span>
                </>
              ) : (
                <span className="text-gray-500">Ready to practice "{lesson.title}"</span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Visualizer (Only visible when connected) */}
        {isConnected && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 h-8">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`w-1.5 bg-blue-400 rounded-full transition-all duration-150 ease-in-out ${isPlaying ? 'animate-pulse' : ''}`}
                style={{ 
                  height: isPlaying ? `${Math.random() * 24 + 8}px` : '4px',
                  opacity: isPlaying ? 1 : 0.3
                }}
              />
            ))}
          </div>
        )}

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {error && (
            <span className="hidden md:inline text-xs text-red-500 font-medium mr-2">{error}</span>
          )}
          
          <button
            onClick={toggleConnection}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-lg transform active:scale-95
              ${isConnected 
                ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-500/20' 
                : 'bg-academy-900 hover:bg-academy-800 text-white ring-4 ring-gray-200'
              }
            `}
          >
            {isConnected ? (
              <>
                <Power size={16} />
                <span>End Session</span>
              </>
            ) : (
              <>
                <Mic size={16} />
                <span>Start Talking</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Decorative gradient line at the top of the bar */}
      <div className={`h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-opacity duration-300 ${isConnected ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
}