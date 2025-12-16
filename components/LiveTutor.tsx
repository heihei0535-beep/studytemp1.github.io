import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Radio } from 'lucide-react';
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
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Setup Audio Output Context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const handleToggleConnection = async () => {
    if (isConnected) {
      clientRef.current?.disconnect();
      setIsConnected(false);
      setIsPlaying(false);
      return;
    }

    setError(null);
    
    // Initialize Client
    clientRef.current = new LiveTutorClient(lesson, {
      onOpen: () => {
        setIsConnected(true);
      },
      onClose: () => {
        setIsConnected(false);
        setIsPlaying(false);
      },
      onError: (err) => {
        setError(err.message || "连接错误");
        setIsConnected(false);
      },
      onAudioData: async (base64Data) => {
        if (!audioContextRef.current) return;
        
        setIsPlaying(true);
        const ctx = audioContextRef.current;
        
        // Use max of nextStartTime or currentTime to ensure gapless or immediate playback
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

        try {
          const audioBuffer = await decodeAudioData(
            decode(base64Data),
            ctx,
            24000,
            1
          );
          
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          
          source.addEventListener('ended', () => {
            sourcesRef.current.delete(source);
            if (sourcesRef.current.size === 0) {
              setIsPlaying(false);
            }
          });

          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += audioBuffer.duration;
          sourcesRef.current.add(source);
          
        } catch (e) {
          console.error("Audio decode error", e);
        }
      }
    });

    await clientRef.current.connect();
  };

  // Cleanup on unmount or lesson change
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
      sourcesRef.current.forEach(s => s.stop());
    };
  }, [lesson.id]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-brand-100 p-6 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">AI 实时外教</h3>
        <p className="text-gray-500 text-sm">与 AI 老师一对一练习《{lesson.title}》口语。</p>
      </div>

      <div className="relative">
        {/* Visual Pulse Effect */}
        {isConnected && (
          <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-20"></div>
        )}
        
        <button
          onClick={handleToggleConnection}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isConnected 
              ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
              : 'bg-brand-600 hover:bg-brand-700 shadow-brand-200'
          } shadow-xl text-white`}
        >
          {isConnected ? (
            <MicOff size={32} />
          ) : (
            <Mic size={32} />
          )}
        </button>
      </div>

      <div className="h-8 flex items-center justify-center space-x-2">
        {isConnected ? (
          <>
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-bounce' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-bounce delay-75' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-bounce delay-150' : 'bg-gray-300'}`}></div>
            <span className="text-sm font-medium text-gray-600 ml-2">
              {isPlaying ? 'AI 正在说...' : '正在听...'}
            </span>
          </>
        ) : (
          <span className="text-sm text-gray-400">点击麦克风开始对话</span>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 max-w-xs text-center">
          {error}
        </div>
      )}

      <div className="bg-brand-50 p-4 rounded-xl w-full text-xs text-gray-600">
        <strong>提示：</strong> 试着朗读一句课文，或者用中文问老师一个单词的意思！
      </div>
    </div>
  );
};