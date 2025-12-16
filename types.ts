export interface Lesson {
  id: string;
  book: number;
  unit: number;
  title: string;
  content: string;
  translation: string;
  grammarPoints: string[];
  vocabulary: { word: string; definition: string }[];
}

export enum AppMode {
  READING = 'READING',
  LIVE_TUTOR = 'LIVE_TUTOR',
  VISUALIZE = 'VISUALIZE'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
