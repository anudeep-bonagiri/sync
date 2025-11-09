import { useState } from 'react';
import { Clock, Zap, TrendingUp, Shield } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const metrics = [
  {
    icon: Clock,
    label: 'Detection Time',
    traditional: '15-30 min',
    selfHealing: '<30 sec',
    improvement: '30x faster'
  },
  {
    icon: Zap,
    label: 'Repair Speed',
    traditional: '2-4 hours',
    selfHealing: '2 min',
    improvement: '120x faster'
  },
  {
    icon: TrendingUp,
    label: 'Network Uptime',
    traditional: '99.5%',
    selfHealing: '99.99%',
    improvement: '10x reduction in downtime'
  },
  {
    icon: Shield,
    label: 'Customer Impact',
    traditional: 'Severe',
    selfHealing: 'None',
    improvement: 'Zero customer-facing outages'
  }
];

export default function CompetitiveAdvantage() {
  const [activeMode, setActiveMode] = useState<'traditional' | 'selfHealing'>('traditional');
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-32 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#0F0515] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#7C4DFF] rounded-full blur-[150px] opacity-10" />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-[#E20074] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#E20074] bg-clip-text text-transparent">
            Revolutionary Performance
          </h2>
          <p className="text-xl text-gray-400">
            See the difference autonomous AI makes
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative inline-flex p-1 rounded-full bg-gray-900 border border-gray-800">
            <div
              className="absolute inset-1 rounded-full bg-gradient-to-r from-[#E20074] to-[#7C4DFF] transition-all duration-300"
              style={{
                transform: activeMode === 'traditional' ? 'translateX(0)' : 'translateX(100%)',
                width: 'calc(50% - 8px)'
              }}
            />
            <button
              onClick={() => setActiveMode('traditional')}
              className={`relative z-10 px-8 py-3 rounded-full font-semibold transition-colors ${
                activeMode === 'traditional' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Traditional Monitoring
            </button>
            <button
              onClick={() => setActiveMode('selfHealing')}
              className={`relative z-10 px-8 py-3 rounded-full font-semibold transition-colors ${
                activeMode === 'selfHealing' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Self-Healing AI
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isBetter = activeMode === 'selfHealing';

            return (
              <div
                key={index}
                className="relative group"
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className={`relative p-8 rounded-2xl border transition-all duration-500 ${
                  isBetter
                    ? 'border-[#E20074] bg-gradient-to-br from-[#E20074]/20 to-[#7C4DFF]/10'
                    : 'border-gray-800 bg-gray-900/50'
                }`}>
                  {isBetter && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E20074]/20 to-[#7C4DFF]/20 blur-xl" />
                  )}

                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all ${
                      isBetter
                        ? 'bg-gradient-to-br from-[#E20074] to-[#7C4DFF]'
                        : 'bg-gray-800'
                    }`}>
                      <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-400 mb-4">
                      {metric.label}
                    </h3>

                    <div className="relative overflow-hidden h-20">
                      <div
                        className="absolute inset-0 transition-all duration-500"
                        style={{
                          transform: activeMode === 'traditional' ? 'translateY(0)' : 'translateY(-100%)',
                          opacity: activeMode === 'traditional' ? 1 : 0
                        }}
                      >
                        <div className="text-3xl font-bold text-white mb-2">
                          {metric.traditional}
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 transition-all duration-500"
                        style={{
                          transform: activeMode === 'selfHealing' ? 'translateY(0)' : 'translateY(100%)',
                          opacity: activeMode === 'selfHealing' ? 1 : 0
                        }}
                      >
                        <div className="text-3xl font-bold bg-gradient-to-r from-[#E20074] to-[#7C4DFF] bg-clip-text text-transparent mb-2">
                          {metric.selfHealing}
                        </div>
                      </div>
                    </div>

                    <div
                      className="overflow-hidden transition-all duration-500"
                      style={{
                        maxHeight: isBetter ? '50px' : '0px',
                        opacity: isBetter ? 1 : 0
                      }}
                    >
                      <div className="pt-4 border-t border-[#E20074]/30">
                        <p className="text-sm text-[#E20074] font-semibold">
                          {metric.improvement}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 p-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-[#E20074] to-[#7C4DFF] bg-clip-text text-transparent mb-2">
                $2.4M
              </div>
              <p className="text-gray-400">Annual savings per network</p>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-[#E20074] to-[#7C4DFF] bg-clip-text text-transparent mb-2">
                87%
              </div>
              <p className="text-gray-400">Reduction in customer churn</p>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-[#E20074] to-[#7C4DFF] bg-clip-text text-transparent mb-2">
                0
              </div>
              <p className="text-gray-400">Customer-facing outages</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
