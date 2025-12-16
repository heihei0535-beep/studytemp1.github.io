import React, { useState } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';
import { lessons } from './data/lessons';
import { LessonSelector } from './components/LessonSelector';
import { ContentArea } from './components/ContentArea';
import { LiveTutor } from './components/LiveTutor';
import { Lesson } from './types';

function App() {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(lessons[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-paper-50 text-ink-900 overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-paper-50/90 backdrop-blur-sm border-b border-paper-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap size={24} className="text-ink-900" />
          <span className="font-serif font-bold text-lg">LinguaSpark</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 text-ink-500 hover:text-ink-900 transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar - Academic Style */}
      <aside className={`
        fixed md:relative z-40 h-full w-80 bg-paper-100 border-r border-paper-200
        transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform 
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
        md:translate-x-0 flex-shrink-0 flex flex-col
      `}>
        {/* Logo Area */}
        <div className="hidden md:flex flex-col justify-center h-24 px-8 border-b border-paper-200/50">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-ink-900 rounded-full flex items-center justify-center text-paper-50 shadow-md">
                 <GraduationCap size={20} />
               </div>
               <div>
                 <h1 className="font-serif font-bold text-xl text-ink-900 tracking-tight">LinguaSpark</h1>
                 <p className="text-[10px] text-ink-500 font-medium tracking-widest uppercase mt-0.5">Classic Edition</p>
               </div>
             </div>
        </div>
        
        <LessonSelector 
          currentLesson={currentLesson} 
          onSelectLesson={(l) => {
            setCurrentLesson(l);
            setIsSidebarOpen(false);
          }} 
        />
        
        {/* User Profile - Subtle */}
        <div className="p-6 border-t border-paper-200 bg-paper-100">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xs font-medium text-ink-500 font-mono">Gemini 2.5 Active</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden bg-paper-50">
        <div className="md:hidden h-16 flex-shrink-0"></div> 
        
        <div className="flex-1 relative overflow-hidden flex flex-col">
           <ContentArea lesson={currentLesson} />
        </div>

        {/* Floating Live Tutor Bar */}
        <LiveTutor lesson={currentLesson} />

      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-ink-900/10 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;