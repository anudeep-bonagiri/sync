
import React from 'react';
import type { CustomerIssue } from '../types';
import { TrendingUp, TrendingDown } from './icons';

interface CustomerPainPointsProps {
  issues: CustomerIssue[];
}

const getSentimentColor = (sentiment: number) => {
  if (sentiment > 70) return 'bg-[#B71C1C]';
  if (sentiment > 55) return 'bg-[#FF6D00]';
  return 'bg-[#FBC02D]';
};

export const CustomerPainPoints: React.FC<CustomerPainPointsProps> = ({ issues }) => {
  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-white/10 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Top 5 Customer Pain Points</h2>
      <ul className="space-y-4">
        {issues.map((issue) => (
          <li key={issue.id} className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-white font-medium">{issue.description}</p>
              <p className="text-sm text-[#9A9A9A]">{issue.mentions.toLocaleString()} mentions</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${issue.sentiment > 60 ? 'text-[#FF1744]' : 'text-[#FFD740]'}`}>
                {issue.sentiment}% neg.
              </span>
              <div className="w-16 h-2 bg-[#4A4A4A] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${getSentimentColor(issue.sentiment)}`}
                  style={{ width: `${issue.sentiment}%` }}
                ></div>
              </div>
               {issue.trend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
               {issue.trend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
