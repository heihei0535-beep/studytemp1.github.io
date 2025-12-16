import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Zap, Activity, X } from 'lucide-react';
import { Lesson } from '../types';
import { LiveTutorClient, decode, decodeAudioData } from '../services/geminiService';

interface LiveTutorProps {
  lesson: Lesson;
}

export const LiveTutor: React.FC<LiveTutorProps> = ({ lesson }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const clientRef = useRef<LiveTutorClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Setup Audio Output Context
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const handleToggleConnection = async () => {
    if (isConnected) {
      clientRef.current?.disconnect();
      setIsConnected(false);
      setIsPlaying(false);
      setIsExpanded(false);
      return;
    }

    setError(null);
    setIsExpanded(true); // Auto expand on connect

    // Resume AudioContext on user interaction
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
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
        if (err.name === 'NotAllowedError') {
             setError("需麦克风权限");
        } else {
             setError("连接中断");
             console.error(err);
        }
        setIsConnected(false);
      },
      onAudioData: async (base64Data) => {
        if (!audioContextRef.current) return;
        
        setIsPlaying(true);
        const ctx = audioContextRef.current;
        
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

  useEffect(() => {
    return () => {
      if (clientRef.current) clientRef.current.disconnect();
      sourcesRef.current.forEach(s => s.stop());
    };
  }, [lesson.id]);

  // Collapsed State (Just a FAB)
  if (!isExpanded && !isConnected) {
    return (
      <button
        onClick={handleToggleConnection}
        className="group flex items-center justify-center w-14 h-14 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-200"
        title="开启 AI 语音外教"
      >
        <Mic size={24} className="group-hover:animate-bounce" />
      </button>
    );
  }

  // Expanded / Active State (Dynamic Island Panel)
  return (
    <div className={`
      bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 
      transition-all duration-500 ease-out overflow-hidden
      ${isConnected ? 'ring-2 ring-brand-500/50' : ''}
      w-full md:w-80
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm font-bold text-gray-700">AI 语音外教</span>
        </div>
        <button 
          onClick={() => {
            if (isConnected) handleToggleConnection();
            setIsExpanded(false);
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-5 flex flex-col items-center space-y-5">
        
        {/* Visualizer Circle */}
        <div className="relative group">
          {isConnected && (
            <>
              <div className={`absolute inset-0 bg-brand-500 rounded-full opacity-20 blur-xl transition-all duration-300 ${isPlaying ? 'scale-150' : 'scale-100'}`}></div>
              <div className={`absolute inset-0 border-2 border-brand-200 rounded-full animate-[ping_2s_infinite] opacity-30`}></div>
            </>
          )}
          
          <button
            onClick={handleToggleConnection}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
              isConnected 
                ? 'bg-gradient-to-b from-red-500 to-red-600 text-white hover:shadow-red-200' 
                : 'bg-gradient-to-b from-brand-500 to-brand-600 text-white hover:shadow-brand-200'
            }`}
          >
            {isConnected ? (
              isPlaying ? <Activity size={32} className="animate-pulse" /> : <MicOff size={28} />
            ) : (
              <Mic size={28} />
            )}
          </button>
        </div>

        {/* Status Text */}
        <div className="text-center space-y-1">
          {error ? (
            <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>
          ) : isConnected ? (
            <>
              <p className="text-brand-900 font-bold text-base">
                {isPlaying ? '正在说话...' : '聆听中...'}
              </p>
              <p className="text-gray-500 text-xs">
                {isPlaying ? '请仔细听' : '请回答问题或朗读'}
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-800 font-medium">准备好了吗？</p>
              <p className="text-gray-500 text-xs">点击麦克风开始《{lesson.title}》练习</p>
            </>
          )}
        </div>
      </div>

      {/* Footer Hint */}
      {isConnected && (
        <div className="bg-brand-50/50 px-4 py-2 text-center border-t border-brand-100/50">
          <p className="text-[10px] text-brand-600 font-medium flex items-center justify-center gap-1">
            <Zap size={10} /> 全程英语交流，遇阻可讲中文
          </p>
        </div>
      )}
    </div>
  );
};