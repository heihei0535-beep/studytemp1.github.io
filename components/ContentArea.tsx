import React, { useState, useEffect } from 'react';
import { Languages, Sparkles, Image as ImageIcon, BookOpen, Quote } from 'lucide-react';
import { Lesson } from '../types';
import { explainText, generateLessonImage } from '../services/geminiService';

interface ContentAreaProps {
  lesson: Lesson;
}

export const ContentArea: React.FC<ContentAreaProps> = ({ lesson }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    setExplanation(null);
    setGeneratedImage(null);
    setShowTranslation(false);
  }, [lesson.id]);

  const handleExplain = async () => {
    if (explanation) {
        setExplanation(null);
        return;
    }
    setLoadingExplain(true);
    const query = lesson.book === 5 ? "作为考官点评这段内容。" : "解析本课语法重点。";
    const text = await explainText(lesson, query);
    setExplanation(text);
    setLoadingExplain(false);
  };

  const handleVisualize = async () => {
    if (generatedImage) return;
    setLoadingImage(true);
    const imgData = await generateLessonImage(lesson);
    setGeneratedImage(imgData);
    setLoadingImage(false);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-paper-50">
      <div className="max-w-3xl mx-auto px-8 md:px-16 py-16 pb-48">
        
        {/* Lesson Header */}
        <header className="mb-12 text-center border-b border-paper-200 pb-8">
            <div className="text-xs font-bold text-accent-600 uppercase tracking-[0.2em] mb-4">
                Unit {lesson.unit}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-ink-900 mb-6 leading-tight">
                {lesson.title}
            </h1>
            <div className="flex justify-center gap-4 text-xs font-serif italic text-ink-500">
                {lesson.grammarPoints.map((g, i) => (
                    <span key={i}>
                         {g} {i < lesson.grammarPoints.length - 1 && "•"}
                    </span>
                ))}
            </div>
        </header>

        {/* Toolbar - Inline & Minimal */}
        <div className="flex justify-center gap-6 mb-12">
             <button 
                onClick={() => setShowTranslation(!showTranslation)}
                className={`text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${showTranslation ? 'text-accent-600' : 'text-ink-400 hover:text-ink-800'}`}
             >
                <Languages size={14} />
                {showTranslation ? 'Hide CN' : 'Translate'}
             </button>
             <button 
                onClick={handleVisualize}
                disabled={loadingImage || !!generatedImage}
                className="text-xs font-bold uppercase tracking-widest text-ink-400 hover:text-ink-800 transition-colors flex items-center gap-2 disabled:opacity-30"
             >
                <ImageIcon size={14} />
                {loadingImage ? 'Drawing...' : 'Visualize'}
             </button>
             <button 
                onClick={handleExplain}
                className={`text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${explanation || loadingExplain ? 'text-accent-600' : 'text-ink-400 hover:text-ink-800'}`}
             >
                <Sparkles size={14} />
                {loadingExplain ? 'Analysing...' : 'AI Notes'}
             </button>
        </div>

        {/* Dynamic Content */}
        <div className="space-y-10">
            
            {/* Image Card */}
            {generatedImage && (
                <div className="p-2 bg-white border border-paper-200 shadow-book rotate-1 transition-transform hover:rotate-0">
                    <img src={generatedImage} className="w-full h-auto aspect-video object-cover filter sepia-[0.2]" alt="Scene" />
                </div>
            )}

            {/* AI Notes - Stick Note Style */}
            {(explanation || loadingExplain) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 font-serif text-ink-800 text-sm leading-relaxed shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-yellow-700 font-bold uppercase text-xs tracking-wider">
                        <Sparkles size={12} />
                        <span>Tutor's Comments</span>
                    </div>
                    {loadingExplain ? (
                        <div className="animate-pulse space-y-2">
                             <div className="h-2 bg-yellow-200/50 rounded w-3/4"></div>
                             <div className="h-2 bg-yellow-200/50 rounded w-5/6"></div>
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: explanation?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') || '' }} />
                    )}
                </div>
            )}

            {/* Main Content - Typography Focus */}
            <div className="relative">
                <Quote className="absolute -top-6 -left-8 text-paper-200 transform -scale-x-100" size={64} />
                <div className="prose prose-xl prose-stone max-w-none font-serif text-ink-800 leading-loose">
                    {lesson.content.split('\n').map((paragraph, idx) => (
                        paragraph.trim() && (
                            <p key={idx} className="mb-6">
                                {paragraph}
                            </p>
                        )
                    ))}
                </div>
            </div>

            {/* Translation - Side Note Style */}
            {showTranslation && (
                <div className="mt-12 pt-8 border-t border-paper-200">
                    <h4 className="font-sans text-xs font-bold text-ink-400 uppercase tracking-widest mb-4">Translation</h4>
                    <p className="font-serif text-ink-600 leading-relaxed whitespace-pre-line text-lg">
                        {lesson.translation}
                    </p>
                </div>
            )}

            {/* Vocabulary Table */}
            <div className="mt-16 bg-white border border-paper-200 rounded-sm p-8 shadow-book">
                <h4 className="font-sans text-xs font-bold text-ink-400 uppercase tracking-widest mb-6 text-center">Vocabulary List</h4>
                <div className="grid grid-cols-1 gap-4">
                    {lesson.vocabulary.map((v) => (
                        <div key={v.word} className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-paper-100 pb-2 last:border-0">
                            <span className="font-serif font-bold text-lg text-ink-900">{v.word}</span>
                            <span className="font-sans text-sm text-ink-500 italic">{v.definition}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};