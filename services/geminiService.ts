import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type } from "@google/genai";
import { Lesson } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Standard Generation ---

export const explainText = async (lesson: Lesson, query: string): Promise<string> => {
  try {
    const prompt = `
      你是一位精通“新概念英语”的资深英语老师。
      当前课程: 第 ${lesson.book} 册, 第 ${lesson.unit} 课 - "${lesson.title}".
      课文内容: "${lesson.content}"
      语法重点: ${lesson.grammarPoints.join(', ')}.

      学生问题: "${query}"

      请针对提供的课文内容，用中文提供简洁、有帮助的解释。
      解释语法点时要深入浅出，适合中国学生理解。
      使用 Markdown 格式进行排版。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "暂时无法生成解释。";
  } catch (error) {
    console.error("Explanation error:", error);
    return "连接 AI 老师失败。";
  }
};

export const generateLessonImage = async (lesson: Lesson): Promise<string | null> => {
  try {
    const prompt = `A realistic, high-quality illustration of the following scene from an English textbook story: ${lesson.content}. No text in the image. Artistic style: Digital painting, detailed.`;
    
    // Using generateContent with image model as per guidelines for standard implementation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        // Nano banana models don't support responseMimeType
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image gen error:", error);
    return null;
  }
};

// --- Live API Helpers ---

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


// --- Live API Client Wrapper ---

export interface LiveClientCallbacks {
  onOpen: () => void;
  onClose: () => void;
  onAudioData: (base64Data: string) => void;
  onError: (error: any) => void;
  onTranscription?: (userText: string, modelText: string) => void;
}

export class LiveTutorClient {
  private sessionPromise: Promise<any> | null = null;
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isActive = false;

  constructor(private lesson: Lesson, private callbacks: LiveClientCallbacks) {}

  async connect() {
    if (this.isActive) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            this.isActive = true;
            this.callbacks.onOpen();
            this.startAudioStreaming();
          },
          onmessage: (message: LiveServerMessage) => {
            // Audio Output
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              this.callbacks.onAudioData(audioData);
            }
            
            // Transcription logic
            if (message.serverContent?.turnComplete && this.callbacks.onTranscription) {
                 // Simplified for this demo: actual implementation would aggregate partials
            }
          },
          onclose: () => {
            this.isActive = false;
            this.callbacks.onClose();
          },
          onerror: (err) => {
            this.callbacks.onError(err);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are a supportive, encouraging English tutor helping a Chinese student practice New Concept English. 
          Current Lesson: ${this.lesson.title}. 
          Content: ${this.lesson.content}.
          Your goal: Roleplay the scenario in the text if applicable, or ask the user questions about the text. 
          Correct their pronunciation and grammar gently. Speak clearly and slowly.
          Important: Primarily speak English to help the student learn, but if the student is confused, you can briefly explain in Chinese.`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        }
      });

    } catch (e) {
      this.callbacks.onError(e);
    }
  }

  private startAudioStreaming() {
    if (!this.audioContext || !this.stream || !this.sessionPromise) return;

    this.source = this.audioContext.createMediaStreamSource(this.stream);
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = createBlob(inputData);
      
      this.sessionPromise!.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  disconnect() {
    this.isActive = false;
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
    }
    if (this.source) {
      this.source.disconnect();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    if(this.sessionPromise) {
        this.sessionPromise.then(session => {
            if(typeof (session as any).close === 'function') {
                (session as any).close();
            }
        });
    }
  }
}