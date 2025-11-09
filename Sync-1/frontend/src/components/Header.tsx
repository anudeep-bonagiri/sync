
import React from 'react';
import { Sun, Moon } from './icons';

interface HeaderProps {
  lastUpdated: Date;
  theme: string;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lastUpdated, theme, toggleTheme }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-1">
        <img 
          src="https://media.discordapp.net/attachments/1433686408265994321/1437023947978838046/Generated_Image_November_08__2025_-_10_02PM-removebg-preview.png?ex=6911bc57&is=69106ad7&hm=b516a99c3596f6487de009cd7f61f9ee4fc52fcac14994499269c43227ebccb3&=&format=webp&quality=lossless&width=1000&height=1000" 
          alt="Sync Logo" 
          className="w-20 h-20 object-contain mt-[5px] ml-[10px]"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight -ml-[8px]">
          Sync
        </h1>
      </div>
      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DE55A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00C853]"></span>
          </span>
          <span className="text-sm text-gray-600 dark:text-[#B3B3B3]">Live Status</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-[#9A9A9A]">
          Last Update: {lastUpdated.toLocaleTimeString()}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-[#0A0A0A] focus:ring-[#E20074]"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
        </button>
      </div>
    </header>
  );
};