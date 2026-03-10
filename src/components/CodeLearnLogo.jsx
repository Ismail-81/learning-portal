import React from 'react';

export default function CodeLearnLogo({ darkMode = false }) {
  return (
    <div className="flex items-center gap-3">
      <a href="/" className="flex items-center gap-3.5 group">
        {/* Universal Interlocked CL - Works on Light & Dark */}
        <div className="relative w-16 h-11 flex items-center">
          {/* C Shadow Layer */}
          <span 
            className={`absolute left-0.5 top-0.5 text-5xl font-extrabold leading-none opacity-30 transition-all duration-400 group-hover:opacity-20 ${
              darkMode ? 'text-indigo-300' : 'text-indigo-200'
            }`}
            style={{ 
              fontFamily: 'ui-serif, Georgia, serif', 
              letterSpacing: '-0.05em',
              filter: 'blur(0.5px)'
            }}>
            C
          </span>
          
          {/* Letter C - Main Layer with Adaptive Gradient */}
          <span 
            className="absolute left-0 top-0 text-5xl font-extrabold leading-none transition-all duration-300 group-hover:scale-105" 
            style={{ 
              fontFamily: 'ui-serif, Georgia, serif', 
              letterSpacing: '-0.05em',
              background: darkMode 
                ? 'linear-gradient(145deg, #a5b4fc 0%, #c7d2fe 100%)'
                : 'linear-gradient(145deg, #4f46e5 0%, #5b21b6 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
            C
          </span>
          
          {/* L Glow Effect */}
          <span 
            className={`absolute left-6 top-1 text-4xl font-bold leading-none opacity-40 transition-all duration-400 group-hover:opacity-60 ${
              darkMode ? 'text-blue-200' : 'text-blue-300'
            }`}
            style={{ 
              fontFamily: 'ui-monospace, monospace', 
              transform: 'rotate(-8deg)',
              filter: 'blur(3px)'
            }}>
            L
          </span>
          
          {/* Letter L - Main Layer with Adaptive Gradient */}
          <span 
            className="absolute left-6 top-1 text-4xl font-bold leading-none transition-all duration-300 group-hover:scale-105 group-hover:rotate-[-10deg]" 
            style={{ 
              fontFamily: 'ui-monospace, monospace', 
              transform: 'rotate(-8deg)',
              background: darkMode
                ? 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
            L
          </span>
          
          {/* Code Bracket Accent */}
          <span className={`absolute -left-1 top-2 text-sm font-bold opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-0.5 ${
            darkMode ? 'text-indigo-300' : 'text-indigo-400'
          }`}>
            {'{'}
          </span>
          <span className={`absolute right-0 bottom-1 text-sm font-bold opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 ${
            darkMode ? 'text-blue-300' : 'text-blue-400'
          }`}>
            {'}'}
          </span>
        </div>
        
        {/* Universal Logo Text */}
        <div className="flex flex-col -space-y-1">
          <div className="flex items-baseline">
            <span 
              className="text-2xl font-black transition-all duration-300 group-hover:tracking-tighter" 
              style={{ 
                fontFamily: 'ui-sans-serif, system-ui, sans-serif', 
                letterSpacing: '-0.03em',
                background: darkMode
                  ? 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'
                  : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
              Code
            </span>
            <span 
              className={`text-2xl font-light transition-all duration-300 group-hover:font-normal ${
                darkMode 
                  ? 'text-indigo-100 group-hover:text-white' 
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}
              style={{ 
                fontFamily: 'ui-sans-serif, system-ui, sans-serif', 
                letterSpacing: '0.01em'
              }}>
              Learn
            </span>
          </div>
          <span className={`text-xs font-medium tracking-wider opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 ${
            darkMode ? 'text-indigo-300' : 'text-indigo-500'
          }`}>
            INTERACTIVE CODING
          </span>
        </div>
      </a>
    </div>
  );
}