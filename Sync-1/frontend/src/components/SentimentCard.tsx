// Fix: Create full content for the SentimentCard component.
import React from 'react';
import type { CustomerIssue } from '../types';
import { ChevronsRight } from './icons';

interface SentimentCardProps {
  issue: CustomerIssue;
  isExpanded: boolean;
  onCardClick: () => void;
}

const getSentimentColor = (type: 'positive' | 'negative') => {
  return type === 'negative' ? 'border-red-500/50' : 'border-green-500/50';
};

export const SentimentCard: React.FC<SentimentCardProps> = ({ issue, isExpanded, onCardClick }) => {
  return (
    <div 
      className={`bg-gray-100 dark:bg-[#111111] p-5 rounded-lg border-l-4 ${getSentimentColor(issue.type)} cursor-pointer transition-all duration-300 hover:bg-gray-200 dark:hover:bg-[#2A2A2A]`}
      onClick={onCardClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 pr-2">
          <p className="font-semibold text-gray-800 dark:text-white text-lg">{issue.description}</p>
          <p className="text-base text-gray-500 dark:text-[#9A9A9A] mt-1">{issue.mentions.toLocaleString()} mentions</p>
        </div>
        <ChevronsRight className={`w-5 h-5 text-gray-400 dark:text-[#767676] transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
      </div>
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10 animate-fade-in">
          <p className="text-lg text-gray-600 dark:text-[#B3B3B3]">{issue.summary}</p>
        </div>
      )}
    </div>
  );
};

// Add a simple fade-in animation for the expanded content in your global CSS or a style tag if needed.
// For example, in your index.css:
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
*/