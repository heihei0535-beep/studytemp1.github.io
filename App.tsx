import React, { useState } from 'react';
import { Layout, Menu, X, GraduationCap } from 'lucide-react';
import { lessons } from './data/lessons';
import { LessonSelector } from './components/LessonSelector';
import { ContentArea } from './components/ContentArea';
import { LiveTutor } from './components/LiveTutor';
import { Lesson } from './types';

function App() {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(lessons[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 h-16 flex items-center justify-between shadow-sm">
        <h1 className="font-bold text-brand-700 flex items-center gap-2 text-lg">
            <GraduationCap className="text-brand-600" size={24} /> LinguaSpark
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed md:relative z-40 h-full w-72 bg-white border-r border-gray-200 shadow-[2px_0_10px_-3px_rgba(0,0,0,0.1)]
        transition-transform duration-300 ease-in-out transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 flex-shrink-0 flex flex-col
      `}>
        {/* Desktop Sidebar Header */}
        <div className="hidden md:flex items-center h-20 px-6 border-b border-gray-100 bg-white">
             <div className="flex items-center gap-3">
               <div className="bg-brand-600 p-1.5 rounded-lg text-white">
                 <GraduationCap size={20} />
               </div>
               <div>
                 <h1 className="font-bold text-lg text-gray-900 tracking-tight leading-none">LinguaSpark</h1>
                 <p className="text-[10px] text-gray-500 font-medium tracking-wide mt-1 uppercase">AI Language Tutor</p>
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
        
        {/* User Profile / Footer Placeholder */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
              ME
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-700">Learning Mode</p>
              <p className="text-[10px] text-gray-400">Gemini 2.5 Flash</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden bg-white/50">
        <div className="md:hidden h-16 flex-shrink-0"></div> {/* Spacer for mobile header */}
        
        <div className="flex-1 relative overflow-hidden">
           <ContentArea lesson={currentLesson} />
           
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>

        {/* Floating Live Tutor Panel - Positioned Bottom Right */}
        <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end pointer-events-none">
            {/* Pointer events allowed only on the interactive component */}
            <div className="pointer-events-auto shadow-2xl rounded-3xl">
                <LiveTutor lesson={currentLesson} />
            </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-[1px] z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;