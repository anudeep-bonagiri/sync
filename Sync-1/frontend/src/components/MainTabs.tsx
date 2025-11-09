import React from 'react';

export type Tab = 'overview' | 'analysis' | 'analytics';

interface MainTabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'analysis', label: 'Live AI Analysis' },
  { id: 'analytics', label: 'Performance Analytics' },
];

export const MainTabs: React.FC<MainTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 dark:border-white/10">
      <nav className="-mb-px flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-2 px-2 border-b-2 font-medium text-sm transition-colors duration-200
              ${
                activeTab === tab.id
                  ? 'border-[#E20074] text-[#E20074] dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-[#9A9A9A] hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
