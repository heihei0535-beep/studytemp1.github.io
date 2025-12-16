import React, { useState } from 'react';
import { Book, ChevronRight, Library } from 'lucide-react';
import { Lesson } from '../types';
import { lessons } from '../data/lessons';

interface LessonSelectorProps {
  currentLesson: Lesson;
  onSelectLesson: (lesson: Lesson) => void;
}

export const LessonSelector: React.FC<LessonSelectorProps> = ({ currentLesson, onSelectLesson }) => {
  const [activeBook, setActiveBook] = useState<number>(1);

  // Define books structure
  const books = [
    { id: 1, name: '第一册', desc: '英语初阶' },
    { id: 2, name: '第二册', desc: '实践与进步' },
    { id: 3, name: '第三册', desc: '培养技能' },
    { id: 4, name: '第四册', desc: '流利英语' },
  ];

  // Filter lessons based on active book
  const filteredLessons = lessons.filter(l => l.book === activeBook);

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Main Menu (Book Selector) */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
          <Library size={14} className="mr-1" /> 课程选择
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {books.map((book) => (
            <button
              key={book.id}
              onClick={() => setActiveBook(book.id)}
              className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 text-left ${
                activeBook === book.id
                  ? 'bg-brand-500 border-brand-600 text-white shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-brand-300 hover:bg-brand-50'
              }`}
            >
              <div className="font-bold">{book.name}</div>
              <div className={`text-xs ${activeBook === book.id ? 'text-brand-100' : 'text-gray-400'}`}>
                {book.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-400">
            {books.find(b => b.id === activeBook)?.name} 课程目录
          </h3>
        </div>
        
        <div className="py-2">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-brand-50 transition-colors ${
                  currentLesson.id === lesson.id ? 'bg-brand-50 border-r-4 border-brand-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg shrink-0 ${currentLesson.id === lesson.id ? 'bg-brand-200 text-brand-700' : 'bg-gray-100 text-gray-500'}`}>
                    <Book size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">第 {lesson.unit} 课</p>
                    <p className={`text-sm font-semibold truncate ${currentLesson.id === lesson.id ? 'text-brand-900' : 'text-gray-700'}`}>
                      {lesson.title}
                    </p>
                  </div>
                </div>
                {currentLesson.id === lesson.id && <ChevronRight size={16} className="text-brand-500 shrink-0" />}
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              <p>暂无该册课程数据</p>
              <p className="text-xs mt-1">(请添加更多课程数据)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};