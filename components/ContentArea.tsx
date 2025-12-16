import React, { useState, useEffect } from 'react';
import { BookOpen, Languages, Sparkles, Image as ImageIcon, PenTool } from 'lucide-react';
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
    if (explanation) return;
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

  const isIELTS = lesson.book === 5;

  return (
    <div className="flex-1 overflow-y-auto bg-paper">
      {/* Top Banner / Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8 md:px-12 sticky top-0 z-10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${isIELTS ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                    {isIELTS ? 'IELTS Speaking' : `Book ${lesson.book} • Unit ${lesson.unit}`}
                </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-black text-academy-900 mb-4 leading-tight">
                {lesson.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
                {lesson.grammarPoints.map(g => (
                    <span key={g} className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                        {g}
                    </span>
                ))}
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-8 pb-32">
        
        {/* Toolbar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <button 
                onClick={() => setShowTranslation(!showTranslation)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all ${showTranslation ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
            >
                <Languages size={14} className="mr-2" />
                译文
            </button>
            <button 
                onClick={handleVisualize}
                disabled={loadingImage || !!generatedImage}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
                <ImageIcon size={14} className="mr-2" />
                {loadingImage ? '绘制中...' : '可视化'}
            </button>
            <button 
                onClick={handleExplain}
                disabled={loadingExplain}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isIELTS ? 'text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100' : 'text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100'}`}
            >
                <Sparkles size={14} className="mr-2" />
                {loadingExplain ? '思考中...' : 'AI 解析'}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Reading Column */}
            <div className="lg:col-span-7 space-y-8">
                {/* Article Card */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-academy-900"></div>
                    <div className="prose prose-lg prose-slate font-serif text-gray-800 leading-loose">
                        {lesson.content.split('\n').map((line, i) => (
                            <p key={i} className="mb-4">{line}</p>
                        ))}
                    </div>
                </div>

                {showTranslation && (
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in slide-in-from-top-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Chinese Translation</h4>
                        <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                            {lesson.translation}
                        </div>
                    </div>
                )}
            </div>

            {/* Side Column (AI & Vocab) */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* Image Card */}
                {generatedImage && (
                    <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 animate-in zoom-in-95 duration-500">
                        <img src={generatedImage} className="w-full h-auto" alt="Scene" />
                    </div>
                )}

                {/* AI Explanation Card */}
                {(explanation || loadingExplain) && (
                    <div className={`p-5 rounded-xl border ${isIELTS ? 'bg-purple-50/80 border-purple-100' : 'bg-amber-50/80 border-amber-100'}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={16} className={isIELTS ? "text-purple-600" : "text-amber-600"} />
                            <h3 className={`text-sm font-bold ${isIELTS ? "text-purple-800" : "text-amber-800"}`}>
                                AI 笔记
                            </h3>
                        </div>
                        {loadingExplain ? (
                            <div className="space-y-2 opacity-50">
                                <div className="h-2 bg-gray-400 rounded w-3/4 animate-pulse"></div>
                                <div className="h-2 bg-gray-400 rounded w-1/2 animate-pulse"></div>
                            </div>
                        ) : (
                            <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: explanation?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') || '' }} />
                        )}
                    </div>
                )}

                {/* Vocab Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                        <PenTool size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase">Key Vocabulary</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {lesson.vocabulary.map((v) => (
                            <div key={v.word} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                <div className="font-serif font-bold text-academy-900">{v.word}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{v.definition}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};