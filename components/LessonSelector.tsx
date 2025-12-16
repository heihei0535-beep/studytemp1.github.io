import React, { useState } from 'react';
import { Book, ChevronRight, Library, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Lesson } from '../types';
import { lessons } from '../data/lessons';

interface LessonSelectorProps {
  currentLesson: Lesson;
  onSelectLesson: (lesson: Lesson) => void;
}

export const LessonSelector: React.FC<LessonSelectorProps> = ({ currentLesson, onSelectLesson }) => {
  const [activeBook, setActiveBook] = useState<number>(1);

  const books = [
    { id: 1, name: 'Book 1', desc: '初阶' },
    { id: 2, name: 'Book 2', desc: '进阶' },
    { id: 3, name: 'Book 3', desc: '高阶' },
    { id: 5, name: 'IELTS', desc: '雅思', isSpecial: true },
  ];

  const filteredLessons = lessons.filter(l => l.book === activeBook);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-academy-900">
      
      {/* Book Tabs */}
      <div className="px-4 py-4 border-b border-academy-800 bg-academy-900">
        <div className="flex space-x-1 bg-academy-800 p-1 rounded-lg">
          {books.map((book) => (
            <button
              key={book.id}
              onClick={() => setActiveBook(book.id)}
              className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                activeBook === book.id
                  ? (book.isSpecial ? 'bg-purple-600 text-white shadow' : 'bg-blue-600 text-white shadow')
                  : 'text-gray-400 hover:text-gray-200 hover:bg-academy-700'
              }`}
            >
              {book.name}
            </button>
          ))}
        </div>
        <div className="mt-2 text-center text-xs text-gray-500">
            {books.find(b => b.id === activeBook)?.desc} 课程
        </div>
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => {
            const isActive = currentLesson.id === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className={`group w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-all duration-200 border border-transparent ${
                  isActive
                    ? 'bg-academy-800 border-academy-700 shadow-md'
                    : 'hover:bg-academy-800/50 hover:border-academy-800'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isActive 
                      ? (lesson.book === 5 ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white')
                      : 'bg-academy-700 text-gray-400 group-hover:bg-academy-600'
                  }`}>
                    {lesson.book === 5 ? 'I' : lesson.unit}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-gray-200'}`}>
                      {lesson.title}
                    </p>
                  </div>
                </div>
                {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                )}
              </button>
            );
          })
        ) : (
          <div className="py-12 text-center">
            <Library className="mx-auto text-academy-700 mb-2" size={32} />
            <p className="text-sm text-academy-500">暂无课程</p>
          </div>
        )}
      </div>
    </div>
  );
};