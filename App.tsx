import React, { useState } from 'react';
import { Layout, Menu, X } from 'lucide-react';
import { lessons } from './data/lessons';
import { LessonSelector } from './components/LessonSelector';
import { ContentArea } from './components/ContentArea';
import { LiveTutor } from './components/LiveTutor';
import { Lesson } from './types';

function App() {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(lessons[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h1 className="font-bold text-brand-600 flex items-center gap-2">
            <Layout size={20} /> 新概念 AI 伴侣
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar (Lesson Selector) */}
      <div className={`
        fixed md:relative z-40 h-full transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 bg-white border-r border-gray-200 flex-shrink-0
      `}>
        <div className="md:hidden h-16"></div> {/* Spacer for mobile header */}
        <div className="hidden md:flex items-center h-16 px-6 border-b border-gray-100 bg-white">
             <h1 className="font-extrabold text-xl text-brand-600 tracking-tight flex items-center gap-2">
                 <Layout className="text-brand-500" /> 新概念 AI 伴侣
             </h1>
        </div>
        <LessonSelector 
          currentLesson={currentLesson} 
          onSelectLesson={(l) => {
            setCurrentLesson(l);
            setIsSidebarOpen(false);
          }} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
        <div className="md:hidden h-16 flex-shrink-0"></div> {/* Spacer for mobile header */}
        
        {/* Main Lesson View */}
        <ContentArea lesson={currentLesson} />

        {/* Floating Live Tutor Panel */}
        <div className="absolute bottom-6 right-6 z-30 w-full max-w-sm px-4 md:px-0 pointer-events-none">
            {/* Wrapper to allow pointer events on the card itself but not the full overlay area if expanded in future */}
            <div className="pointer-events-auto">
                <LiveTutor lesson={currentLesson} />
            </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;