
import React from 'react';
import type { Simulation, Agent } from '../types';
import { Cpu, DollarSign, Server, Users, CheckCircle, AlertTriangle } from './icons';

const AgentIcon: React.FC<{name: Agent['name']}> = ({ name }) => {
    switch(name) {
        case 'Cost Analysis': return <DollarSign className="w-6 h-6 text-gray-400 dark:text-[#767676]" />;
        case 'Uptime Impact': return <Server className="w-6 h-6 text-gray-400 dark:text-[#767676]" />;
        case 'Customer Impact': return <Users className="w-6 h-6 text-gray-400 dark:text-[#767676]" />;
        default: return <Cpu className="w-6 h-6 text-gray-400 dark:text-[#767676]" />;
    }
}

const AgentCard: React.FC<{agent: Agent}> = ({ agent }) => {
    return (
        <div className="flex items-center gap-4 bg-gray-100 dark:bg-[#111111] p-3 rounded-lg">
            <div className="flex-shrink-0">
                <AgentIcon name={agent.name} />
            </div>
            <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{agent.name}</p>
                <p className="text-sm text-gray-500 dark:text-[#9A9A9A]">{agent.message}</p>
            </div>
            <div className="flex-shrink-0">
                {agent.status === 'running' && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-[#2979FF]"></div>}
                {agent.status === 'complete' && <CheckCircle className="w-5 h-5 text-[#00C853]" />}
            </div>
        </div>
    )
}


interface AISimulationProps {
  simulation: Simulation;
  onTriggerAnalysis?: (regionId?: string) => void;
  isActive?: boolean;
}

export const AISimulation: React.FC<AISimulationProps> = ({ simulation, onTriggerAnalysis, isActive }) => {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {simulation.isActive ? 'AI Simulation in Progress' : 'AI Network Analysis'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-[#B3B3B3]">{simulation.stage}</p>
        </div>
        {!isActive && onTriggerAnalysis && (
          <button
            onClick={() => onTriggerAnalysis()}
            className="flex items-center gap-2 px-4 py-2 bg-[#E20074] hover:bg-[#C60062] text-white rounded-lg font-semibold transition-colors shadow-lg shadow-[#E20074]/30"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Trigger Network Outage</span>
          </button>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-semibold text-[#E20074]">Analysis Progress</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{simulation.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-[#2A2A2A] rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-in-out shadow-lg shadow-[#E20074]/50"
            style={{ width: `${simulation.progress}%`, backgroundColor: '#E20074', minWidth: simulation.progress > 0 ? '2px' : '0' }}
          ></div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="space-y-3">
        {simulation.agents.map(agent => <AgentCard key={agent.name} agent={agent} />)}
      </div>
    </div>
  );
};