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
    <div className="flex h-screen bg-academy-50 overflow-hidden font-sans text-gray-900">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-academy-900 text-white border-b border-academy-800 px-4 h-14 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-blue-400" size={20} /> 
          <span className="font-serif font-bold tracking-wide">LinguaSpark</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 text-gray-300 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation (Dark Theme) */}
      <div className={`
        fixed md:relative z-40 h-full w-72 bg-academy-900 text-gray-300 border-r border-academy-800 shadow-2xl
        transition-transform duration-300 ease-in-out transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 flex-shrink-0 flex flex-col
      `}>
        {/* Desktop Sidebar Header */}
        <div className="hidden md:flex items-center h-16 px-6 bg-academy-900 border-b border-academy-800 shadow-sm z-10">
             <div className="flex items-center gap-3">
               <div className="bg-blue-600/20 p-1.5 rounded-lg text-blue-400 border border-blue-500/30">
                 <GraduationCap size={20} />
               </div>
               <div>
                 <h1 className="font-serif font-bold text-lg text-white tracking-wide leading-none">LinguaSpark</h1>
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
        
        {/* User Profile / Status */}
        <div className="p-4 bg-academy-950 border-t border-academy-800">
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-academy-800">
              AI
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-200">Gemini 2.5 Flash</p>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden bg-academy-50">
        <div className="md:hidden h-14 flex-shrink-0 bg-academy-900"></div> {/* Spacer for mobile header */}
        
        <div className="flex-1 relative overflow-hidden flex flex-col">
           <ContentArea lesson={currentLesson} />
        </div>

        {/* Live Tutor Bar (Fixed Bottom) */}
        <LiveTutor lesson={currentLesson} />

      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;