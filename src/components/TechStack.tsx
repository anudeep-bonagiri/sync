import { useState } from 'react';
import { Brain, Cpu, Zap, Network, Database, Cloud } from 'lucide-react';

const technologies = [
  {
    name: 'Nemotron',
    icon: Brain,
    role: 'Multi-agent reasoning and decision-making',
    color: '#76B900'
  },
  {
    name: 'Brev',
    icon: Cpu,
    role: 'GPU-accelerated simulation environment',
    color: '#2979FF'
  },
  {
    name: 'MCP',
    icon: Network,
    role: 'Model coordination protocol',
    color: '#26C6DA'
  },
  {
    name: 'ReAct',
    icon: Zap,
    role: 'Reasoning and action framework',
    color: '#E20074'
  },
  {
    name: 'APIs',
    icon: Cloud,
    role: 'Real-time network telemetry integration',
    color: '#7C4DFF'
  },
  {
    name: 'PostgreSQL',
    icon: Database,
    role: 'Time-series network state storage',
    color: '#4CAF50'
  }
];

export default function TechStack() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,0,116,0.1),transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-[#E20074] bg-clip-text text-transparent">
            Powered by Best-in-Class AI
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            Enterprise-grade technologies working in harmony
          </p>
        </div>

        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 800 600">
              {technologies.map((_, i) => {
                const angle = (i / technologies.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 200;
                const x = 400 + Math.cos(angle) * radius;
                const y = 300 + Math.sin(angle) * radius;

                return (
                  <g key={i}>
                    <line
                      x1="400"
                      y1="300"
                      x2={x}
                      y2={y}
                      stroke={technologies[i].color}
                      strokeWidth="2"
                      opacity={hoveredIndex === null ? 0.3 : hoveredIndex === i ? 0.8 : 0.1}
                      className="transition-all duration-300"
                      style={{
                        filter: hoveredIndex === i ? `drop-shadow(0 0 8px ${technologies[i].color})` : 'none'
                      }}
                    />

                    {hoveredIndex === i && (
                      <>
                        <circle
                          cx={400 + Math.cos(angle) * radius * 0.3}
                          cy={300 + Math.sin(angle) * radius * 0.3}
                          r="3"
                          fill={technologies[i].color}
                          className="animate-pulse"
                        />
                        <circle
                          cx={400 + Math.cos(angle) * radius * 0.6}
                          cy={300 + Math.sin(angle) * radius * 0.6}
                          r="3"
                          fill={technologies[i].color}
                          className="animate-pulse"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#E20074] to-[#7C4DFF] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E20074] to-[#7C4DFF] blur-2xl opacity-50 animate-pulse" />
              <Brain className="w-16 h-16 text-white relative z-10" strokeWidth={1.5} />
            </div>
          </div>

          {technologies.map((tech, index) => {
            const angle = (index / technologies.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 140;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const Icon = tech.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="absolute left-1/2 top-1/2 transition-all duration-300"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isHovered ? 1.05 : 1})`
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`relative p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-300 w-32 md:w-40 ${
                  isHovered
                    ? 'border-gray-700 bg-gray-900/90 shadow-2xl'
                    : 'border-gray-800 bg-gray-900/70'
                }`}
                style={{
                  boxShadow: isHovered ? `0 0 40px ${tech.color}40` : 'none'
                }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="w-12 md:w-16 h-12 md:h-16 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-all duration-300"
                      style={{
                        backgroundColor: `${tech.color}20`,
                        boxShadow: isHovered ? `0 0 20px ${tech.color}40` : 'none'
                      }}
                    >
                      <Icon
                        className="w-6 md:w-8 h-6 md:h-8"
                        style={{ color: tech.color }}
                        strokeWidth={1.5}
                      />
                    </div>

                    <h3 className="text-sm md:text-lg font-bold text-white mb-1 md:mb-2 leading-tight">
                      {tech.name}
                    </h3>

                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: isHovered ? '80px' : '0px',
                        opacity: isHovered ? 1 : 0
                      }}
                    >
                      <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                        {tech.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
