import React, { useState } from 'react';
import type { CustomerIssue } from '../types';
import { SentimentCard } from './SentimentCard';
import { SadFace, HappyFace } from './icons';

interface LiveCustomerVoiceProps {
  issues: CustomerIssue[];
}

export const LiveCustomerVoice: React.FC<LiveCustomerVoiceProps> = ({ issues }) => {
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    setExpandedCardId(prevId => (prevId === id ? null : id));
  };

  const painPoints = issues
    .filter((issue) => issue.type === 'negative')
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 3);

  const delightMoments = issues
    .filter((issue) => issue.type === 'positive')
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-8 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg h-full flex flex-col">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Live Customer Voice</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {/* Pain Points Column */}
        <div>
          <h3 className="flex items-center gap-3 text-2xl font-semibold text-red-500 dark:text-red-400 mb-5">
            <SadFace className="w-6 h-6" />
            <span>Top Pain Points</span>
          </h3>
          <div className="space-y-4">
            {painPoints.map((issue) => (
              <SentimentCard 
                key={issue.id} 
                issue={issue} 
                isExpanded={expandedCardId === issue.id}
                onCardClick={() => handleCardClick(issue.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Delight Moments Column */}
        <div>
          <h3 className="flex items-center gap-3 text-2xl font-semibold text-green-600 dark:text-green-400 mb-5">
            <HappyFace className="w-6 h-6" />
            <span>Moments of Delight</span>
          </h3>
          <div className="space-y-4">
            {delightMoments.map((issue) => (
              <SentimentCard 
                key={issue.id} 
                issue={issue} 
                isExpanded={expandedCardId === issue.id}
                onCardClick={() => handleCardClick(issue.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};