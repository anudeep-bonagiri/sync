import { useState } from 'react';
import { Eye, AlertTriangle, Cpu, Wrench } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const steps = [
  {
    icon: Eye,
    title: 'Monitor',
    description: 'Real-time network surveillance across all nodes',
    metrics: ['99.9% Coverage', '< 50ms Latency']
  },
  {
    icon: AlertTriangle,
    title: 'Detect',
    description: 'AI-powered anomaly detection and prediction',
    metrics: ['95% Accuracy', '30s Detection']
  },
  {
    icon: Cpu,
    title: 'Simulate',
    description: 'GPU-accelerated virtual repair scenarios',
    metrics: ['1000x Faster', 'Multi-Agent']
  },
  {
    icon: Wrench,
    title: 'Repair',
    description: 'Autonomous deployment and network healing',
    metrics: ['99% Success', 'Zero Downtime']
  }
];

export default function ConceptSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-20 md:py-32 px-4 sm:px-6 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E20074] to-transparent opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-12 md:mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-[#E20074] bg-clip-text text-transparent">
            Self-Healing in Four Steps
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            From detection to deployment in seconds, not hours
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredIndex === index;
            const isActive = hoveredIndex !== null;

            return (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-[#E20074] to-[#7C4DFF] z-0">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-[#E20074] to-[#7C4DFF] transition-all duration-500"
                      style={{
                        filter: isHovered ? 'blur(4px)' : 'blur(0px)',
                        opacity: isHovered ? 1 : 0.5
                      }}
                    />
                  </div>
                )}

                <div
                  className={`relative p-4 md:p-8 rounded-xl md:rounded-2xl border transition-all duration-500 ease-out transform-gpu ${
                    isHovered
                      ? 'border-[#E20074] bg-gradient-to-br from-[#E20074]/20 to-[#7C4DFF]/10 md:scale-105 shadow-2xl shadow-[#E20074]/50'
                      : isActive
                      ? 'border-gray-800 bg-[#0A0A0A]/50 opacity-60'
                      : 'border-gray-800 bg-[#0A0A0A]/50 hover:border-gray-700'
                  } ${isVisible ? `opacity-100 translate-y-0 delay-${index * 100}` : 'opacity-0 translate-y-10'}`}
                  style={{
                    transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
                    transform: isHovered ? 'translateY(-10px) scale(1.05)' : isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)'
                  }}
                >
                  <div className="relative mb-4 md:mb-6">
                    <div className={`w-12 md:w-16 h-12 md:h-16 rounded-lg md:rounded-xl bg-gradient-to-br flex items-center justify-center transition-all duration-500 ${
                      isHovered
                        ? 'from-[#E20074] to-[#7C4DFF] md:scale-110'
                        : 'from-gray-800 to-gray-900'
                    }`}>
                      <Icon className="w-6 md:w-8 h-6 md:h-8 text-white" strokeWidth={1.5} />
                    </div>
                    {isHovered && (
                      <div className="absolute inset-0 blur-xl bg-[#E20074] opacity-50 rounded-lg md:rounded-xl" />
                    )}
                  </div>

                  <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-white">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-4 md:mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <div
                    className="space-y-2 overflow-hidden transition-all duration-500"
                    style={{
                      maxHeight: isHovered ? '200px' : '0px',
                      opacity: isHovered ? 1 : 0
                    }}
                  >
                    {step.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 text-xs md:text-sm"
                        style={{
                          transitionDelay: `${i * 100}ms`
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E20074] flex-shrink-0" />
                        <span className="text-gray-300 font-mono">{metric}</span>
                      </div>
                    ))}
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
