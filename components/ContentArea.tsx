import React, { useState, useEffect } from 'react';
import { BookOpen, Languages, Sparkles, Image as ImageIcon } from 'lucide-react';
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

  // Reset state when lesson changes
  useEffect(() => {
    setExplanation(null);
    setGeneratedImage(null);
    setShowTranslation(false);
  }, [lesson.id]);

  const handleExplain = async () => {
    if (explanation) return;
    setLoadingExplain(true);
    const query = lesson.book === 5 ? "请像雅思考官一样分析这段内容，给出改进建议。" : "请解释本课的重点语法和生词。";
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
    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${isIELTS ? 'bg-purple-100 text-purple-800' : 'bg-brand-100 text-brand-800'}`}>
            {isIELTS ? '雅思听力 & 口语实战' : `第 ${lesson.book} 册 • 第 ${lesson.unit} 课`}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">{lesson.title}</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
             <span className="font-medium">{isIELTS ? '考查点:' : '学习重点:'}</span>
             <div className="flex flex-wrap gap-1">
               {lesson.grammarPoints.map(g => (
                 <span key={g} className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 text-xs">{g}</span>
               ))}
             </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
          <button 
            onClick={() => setShowTranslation(!showTranslation)}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Languages size={16} className="mr-2 text-brand-600" />
            {showTranslation ? '隐藏译文' : '显示译文'}
          </button>
          
          <button 
            onClick={handleVisualize}
            disabled={loadingImage || !!generatedImage}
            className="flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            <ImageIcon size={16} className="mr-2" />
            {loadingImage ? '正在绘制...' : (generatedImage ? '场景已生成' : '场景可视化')}
          </button>

          <button 
            onClick={handleExplain}
            disabled={loadingExplain}
            className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                isIELTS 
                ? 'bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100' 
                : 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <Sparkles size={16} className="mr-2" />
            {loadingExplain ? '正在分析...' : (isIELTS ? '考官点评' : 'AI 深度解析')}
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Text Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                <BookOpen size={14} className="mr-2" /> {isIELTS ? '试题 / 话题' : '课文原文'}
              </h3>
              <div className="prose prose-lg text-gray-800 leading-relaxed whitespace-pre-line font-serif">
                {lesson.content}
              </div>
            </div>

            {showTranslation && (
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">中文译文</h3>
                <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
                  {lesson.translation}
                </div>
              </div>
            )}
          </div>

          {/* AI / Visual Column */}
          <div className="space-y-6">
            
            {/* Generated Image */}
            {generatedImage && (
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 animate-in fade-in duration-700">
                <img src={generatedImage} alt="AI Generated Scene" className="w-full h-auto object-cover" />
                <div className="bg-white p-2 text-center text-xs text-gray-400">
                  AI 生成的场景图
                </div>
              </div>
            )}

            {/* AI Explanation */}
            {(explanation || loadingExplain) && (
              <div className={`p-6 rounded-2xl border ${isIELTS ? 'bg-purple-50/50 border-purple-100' : 'bg-amber-50/50 border-amber-100'}`}>
                 <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${isIELTS ? 'text-purple-600' : 'text-amber-600'}`}>
                  <Sparkles size={14} className="mr-2" /> {isIELTS ? '考官建议' : '语法与笔记'}
                </h3>
                {loadingExplain ? (
                  <div className="animate-pulse space-y-3">
                    <div className={`h-4 rounded w-3/4 ${isIELTS ? 'bg-purple-200' : 'bg-amber-200'}`}></div>
                    <div className={`h-4 rounded w-1/2 ${isIELTS ? 'bg-purple-200' : 'bg-amber-200'}`}></div>
                    <div className={`h-4 rounded w-5/6 ${isIELTS ? 'bg-purple-200' : 'bg-amber-200'}`}></div>
                  </div>
                ) : (
                   <div className="prose prose-sm text-gray-700 max-w-none">
                     <div dangerouslySetInnerHTML={{ 
                       __html: explanation?.replace(/\n/g, '<br/>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '' 
                      }} />
                   </div>
                )}
              </div>
            )}
            
            {/* Vocabulary List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">核心生词</h3>
              <ul className="space-y-3">
                {lesson.vocabulary.map((vocab) => (
                  <li key={vocab.word} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                    <span className="font-semibold text-gray-900 font-serif">{vocab.word}</span>
                    <span className="text-gray-500">{vocab.definition}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};