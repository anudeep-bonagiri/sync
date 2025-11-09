import { useState, useEffect } from 'react';
import { Brain, Cpu, Zap, Network, Database, Cloud } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

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
  const [radius, setRadius] = useState(280);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 768) {
        setRadius(200);
      } else if (window.innerWidth < 1024) {
        setRadius(240);
      } else {
        setRadius(280);
      }
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  return (
    <section ref={ref} className="relative py-20 md:py-32 lg:py-40 px-4 sm:px-6 bg-gradient-to-b from-[#0A0A0A] to-[#0F0515] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#E20074] rounded-full blur-[200px] opacity-5 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#7C4DFF] rounded-full blur-[200px] opacity-5 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(226,0,116,0.08),transparent_60%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 lg:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-white via-[#E20074] to-[#7C4DFF] bg-clip-text text-transparent">
            Powered by Best-in-Class AI
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade technologies working in harmony
          </p>
        </div>

        {/* Main tech stack visualization */}
        <div className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center justify-center">
          {/* Connection lines SVG */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-full h-full max-w-5xl max-h-5xl" 
              viewBox="0 0 1000 1000" 
              preserveAspectRatio="xMidYMid meet"
              style={{ opacity: 0.4 }}
            >
              <defs>
                {technologies.map((tech, i) => (
                  <linearGradient key={i} id={`lineGradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={tech.color} stopOpacity="0.3" />
                    <stop offset="50%" stopColor={tech.color} stopOpacity={hoveredIndex === i ? "0.6" : "0.2"} />
                    <stop offset="100%" stopColor="#E20074" stopOpacity="0.1" />
                  </linearGradient>
                ))}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {technologies.map((tech, i) => {
                const angle = (i / technologies.length) * Math.PI * 2 - Math.PI / 2;
                // Scale radius for SVG viewBox (1000x1000) - make lines slightly longer than cards
                const svgRadius = (radius / 280) * 350;
                const centerX = 500;
                const centerY = 500;
                const x = centerX + Math.cos(angle) * svgRadius;
                const y = centerY + Math.sin(angle) * svgRadius;
                const isActive = hoveredIndex === i;

                return (
                  <g key={i}>
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={x}
                      y2={y}
                      stroke={`url(#lineGradient-${i})`}
                      strokeWidth={isActive ? "3" : "2"}
                      opacity={hoveredIndex === null ? 0.25 : isActive ? 0.8 : 0.15}
                      className="transition-all duration-500 ease-out"
                      filter={isActive ? "url(#glow)" : "none"}
                    />
                    {isActive && (
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill={tech.color}
                        opacity="0.6"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Brain Icon */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E20074] to-[#7C4DFF] blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-[#E20074] via-[#7C4DFF] to-[#E20074] p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center">
                  <Brain 
                    className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 relative z-10" 
                    strokeWidth={1.5}
                    style={{ 
                      color: '#E20074',
                      filter: 'drop-shadow(0 0 12px rgba(226, 0, 116, 0.6))'
                    }} 
                  />
                </div>
              </div>
              <div className="absolute -inset-4 rounded-full border border-[#E20074]/20 animate-ping" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* Technology Cards */}
          {technologies.map((tech, index) => {
            const angle = (index / technologies.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const Icon = tech.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="absolute left-1/2 top-1/2 z-10"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`group relative transition-all duration-500 ease-out transform-gpu ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  } ${isHovered ? 'scale-110 z-20' : 'scale-100'}`}
                  style={{
                    transitionDelay: isVisible ? `${index * 80}ms` : '0ms'
                  }}
                >
                  {/* Glow effect */}
                  <div 
                    className={`absolute -inset-2 rounded-2xl blur-xl transition-opacity duration-500 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background: `radial-gradient(circle, ${tech.color}40, transparent 70%)`
                    }}
                  />

                  {/* Card */}
                  <div
                    className={`relative px-8 py-10 md:px-10 md:py-12 rounded-2xl border backdrop-blur-xl transition-all duration-500 ${
                      isHovered
                        ? 'border-[#E20074]/50 bg-gradient-to-br from-gray-900/90 to-black/90 shadow-2xl'
                        : 'border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-black/40'
                    }`}
                    style={{
                      boxShadow: isHovered 
                        ? `0 20px 60px -10px ${tech.color}30, 0 0 40px ${tech.color}20` 
                        : '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                      minWidth: '180px',
                      maxWidth: '200px'
                    }}
                  >
                    {/* Icon container */}
                    <div className="flex justify-center mb-6">
                      <div
                        className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center transition-all duration-500 ${
                          isHovered ? 'scale-110' : 'scale-100'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${tech.color}15, ${tech.color}05)`,
                          boxShadow: isHovered 
                            ? `0 0 30px ${tech.color}40, inset 0 0 20px ${tech.color}20` 
                            : `0 0 15px ${tech.color}20`
                        }}
                      >
                        <Icon
                          className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-500"
                          style={{ 
                            color: tech.color,
                            filter: isHovered ? `drop-shadow(0 0 8px ${tech.color})` : 'none'
                          }}
                          strokeWidth={1.5}
                        />
                        {isHovered && (
                          <div 
                            className="absolute inset-0 rounded-xl animate-ping"
                            style={{ 
                              background: tech.color,
                              opacity: 0.2,
                              animationDuration: '2s'
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-center text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {tech.name}
                    </h3>

                    {/* Description */}
                    <div
                      className="overflow-hidden transition-all duration-500"
                      style={{
                        maxHeight: isHovered ? '80px' : '0px',
                        opacity: isHovered ? 1 : 0
                      }}
                    >
                      <p className="text-center text-sm text-gray-400 leading-relaxed px-2">
                        {tech.role}
                      </p>
                    </div>

                    {/* Accent line */}
                    <div 
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500 ${
                        isHovered ? 'w-3/4 opacity-100' : 'w-0 opacity-0'
                      }`}
                      style={{
                        background: `linear-gradient(90deg, transparent, ${tech.color}, transparent)`
                      }}
                    />
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
