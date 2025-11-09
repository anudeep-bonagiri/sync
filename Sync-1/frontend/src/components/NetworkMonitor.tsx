
import React from 'react';
import type { NetworkRegion, RegionStatus } from '../types';

interface NetworkMonitorProps {
  regions: NetworkRegion[];
  activeRegion: NetworkRegion;
  setActiveRegion: (region: NetworkRegion) => void;
}

const statusStyles: Record<RegionStatus, { indicator: string; text: string; bg: string }> = {
  healthy: {
    indicator: 'bg-green-500',
    text: 'text-green-600 dark:text-green-300',
    bg: 'bg-green-500/10',
  },
  warning: {
    indicator: 'bg-yellow-500',
    text: 'text-yellow-600 dark:text-yellow-300',
    bg: 'bg-yellow-500/10',
  },
  critical: {
    indicator: 'bg-red-500',
    text: 'text-red-600 dark:text-red-300',
    bg: 'bg-red-500/10',
  },
};

export const NetworkMonitor: React.FC<NetworkMonitorProps> = ({ regions, activeRegion, setActiveRegion }) => {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Global Network Status</h2>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Region List */}
        <div className="md:col-span-1 flex flex-col gap-3">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setActiveRegion(region)}
              className={`p-3 rounded-lg text-left transition-colors duration-200 w-full ${
                activeRegion.id === region.id
                  ? 'bg-[#E20074]/10 dark:bg-[#E20074]/20 border-l-4 border-[#E20074]'
                  : 'bg-gray-100 dark:bg-[#111111] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] border-l-4 border-transparent'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${activeRegion.id === region.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-[#B3B3B3]'}`}>
                  {region.name}
                </span>
                <span className={`relative flex h-3 w-3`}>
                  <span className={`absolute inline-flex h-full w-full rounded-full ${statusStyles[region.status].indicator} opacity-75 ${region.status !== 'healthy' ? 'animate-ping' : ''}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${statusStyles[region.status].indicator}`}></span>
                </span>
              </div>
              <span className={`text-sm capitalize ${statusStyles[region.status].text}`}>{region.status}</span>
            </button>
          ))}
        </div>
        
        {/* Active Region Details */}
        <div className="md:col-span-2 bg-gray-100 dark:bg-[#111111] p-5 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{activeRegion.name}</h3>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[activeRegion.status].bg} ${statusStyles[activeRegion.status].text}`}>
            <span className={`h-2 w-2 rounded-full ${statusStyles[activeRegion.status].indicator}`}></span>
            <span>{activeRegion.status.charAt(0).toUpperCase() + activeRegion.status.slice(1)}</span>
          </div>
          <p className="mt-4 text-gray-600 dark:text-[#B3B3B3] whitespace-pre-wrap leading-relaxed">
            {activeRegion.details}
          </p>
        </div>
      </div>
    </div>
  );
};