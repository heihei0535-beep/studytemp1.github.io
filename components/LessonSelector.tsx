import React, { useState } from 'react';
import { Book, Bookmark, Star } from 'lucide-react';
import { Lesson } from '../types';
import { lessons } from '../data/lessons';

interface LessonSelectorProps {
  currentLesson: Lesson;
  onSelectLesson: (lesson: Lesson) => void;
}

export const LessonSelector: React.FC<LessonSelectorProps> = ({ currentLesson, onSelectLesson }) => {
  const [activeBook, setActiveBook] = useState<number>(1);

  const books = [
    { id: 1, name: 'Book I' },
    { id: 2, name: 'Book II' },
    { id: 3, name: 'Book III' },
    { id: 5, name: 'IELTS' },
  ];

  const filteredLessons = lessons.filter(l => l.book === activeBook);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      
      {/* Elegant Tabs */}
      <div className="px-6 py-6 pb-2">
        <div className="flex gap-4 border-b border-paper-300 pb-px overflow-x-auto no-scrollbar">
          {books.map((book) => (
            <button
              key={book.id}
              onClick={() => setActiveBook(book.id)}
              className={`pb-3 text-xs font-serif font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                activeBook === book.id
                  ? 'text-ink-900 border-b-2 border-accent-600 mb-[-1px]'
                  : 'text-ink-400 hover:text-ink-600'
              }`}
            >
              {book.name}
            </button>
          ))}
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => {
            const isActive = currentLesson.id === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className={`w-full text-left px-4 py-4 rounded-lg flex items-start gap-4 transition-all duration-200 group border border-transparent ${
                  isActive
                    ? 'bg-white shadow-book border-paper-200'
                    : 'hover:bg-paper-200/50'
                }`}
              >
                {/* Number */}
                <span className={`
                  font-serif text-lg font-bold w-6 text-center leading-none mt-0.5
                  ${isActive ? 'text-accent-600' : 'text-paper-300 group-hover:text-ink-400'}
                `}>
                  {lesson.unit}
                </span>
                
                <div className="min-w-0 flex-1">
                  <h3 className={`font-serif text-base font-bold truncate transition-colors leading-tight ${
                    isActive ? 'text-ink-900' : 'text-ink-600'
                  }`}>
                    {lesson.title}
                  </h3>
                  <p className="text-[11px] text-ink-400 mt-1.5 uppercase tracking-wide">
                    {lesson.book === 5 ? 'Speaking Practice' : 'Essential Grammar'}
                  </p>
                </div>

                {isActive && <Bookmark size={16} className="text-accent-600 fill-current" />}
              </button>
            );
          })
        ) : (
          <div className="py-20 text-center opacity-40">
            <Book className="mx-auto mb-3 text-ink-300" size={24} />
            <p className="font-serif text-ink-400 text-sm italic">No lessons available</p>
          </div>
        )}
      </div>
    </div>
  );
};