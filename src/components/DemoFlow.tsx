import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Cpu, Radio, TrendingUp } from 'lucide-react';

const timeline = [
  {
    id: 1,
    title: 'Tower Outage Detected',
    icon: Radio,
    time: '00:00',
    status: 'critical',
    description: 'Cell tower 4729 experiencing connectivity failure',
    metrics: { affected: '2,400 users', severity: 'High' }
  },
  {
    id: 2,
    title: 'Anomaly Detection',
    icon: AlertTriangle,
    time: '00:30',
    status: 'warning',
    description: 'AI identifies pattern matching hardware degradation',
    metrics: { confidence: '94%', type: 'Hardware' }
  },
  {
    id: 3,
    title: 'Virtual Repair Simulation',
    icon: Cpu,
    time: '01:15',
    status: 'processing',
    description: 'GPU accelerated scenario modeling in progress',
    metrics: { scenarios: '1,247', optimal: 'Route 3B' }
  },
  {
    id: 4,
    title: 'Fix Deployment',
    icon: CheckCircle2,
    time: '02:00',
    status: 'success',
    description: 'Autonomous traffic rerouting implemented',
    metrics: { success: '99.2%', downtime: '0ms' }
  },
  {
    id: 5,
    title: 'Customer Sentiment Recovery',
    icon: TrendingUp,
    time: '05:00',
    status: 'success',
    description: 'User satisfaction returns to baseline',
    metrics: { satisfaction: '87%', complaints: '-95%' }
  }
];

export default function DemoFlow() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-[#0F0515] to-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E20074] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#E20074] bg-clip-text text-transparent">
            Autonomous Repair in Action
          </h2>
          <p className="text-xl text-gray-400">
            Watch the AI detect, simulate, and resolve network issues
          </p>
        </div>

        <div className="mb-12">
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#E20074] to-[#7C4DFF] -translate-y-1/2 transition-all duration-1000"
              style={{ width: `${(activeStep / (timeline.length - 1)) * 100}%` }}
            />

            <div className="relative flex justify-between">
              {timeline.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStep;
                const isPast = index < activeStep;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className="group flex flex-col items-center"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-[#E20074] to-[#7C4DFF] border-[#E20074] scale-125 shadow-2xl shadow-[#E20074]/50'
                          : isPast
                          ? 'bg-[#E20074] border-[#E20074]'
                          : 'bg-gray-900 border-gray-800 group-hover:border-gray-700'
                      }`}
                    >
                      <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                    <span className="mt-3 text-xs text-gray-400 font-mono">{step.time}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative p-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E20074] to-[#7C4DFF]" />

            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  timeline[activeStep].status === 'critical' ? 'bg-red-500' :
                  timeline[activeStep].status === 'warning' ? 'bg-yellow-500' :
                  timeline[activeStep].status === 'processing' ? 'bg-blue-500' :
                  'bg-green-500'
                }`} />
                <span className="text-sm text-gray-400 font-mono uppercase tracking-wider">
                  {timeline[activeStep].status}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">
                {timeline[activeStep].title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {timeline[activeStep].description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(timeline[activeStep].metrics).map(([key, value]) => (
                <div key={key} className="p-4 rounded-xl bg-black/40 border border-gray-800">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                    {key}
                  </div>
                  <div className="text-xl font-bold text-[#E20074]">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative p-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl overflow-hidden">
            <h4 className="text-xl font-semibold text-white mb-6">Visual Network State</h4>

            <div className="relative h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    const x = Math.cos(angle) * 100;
                    const y = Math.sin(angle) * 100;
                    const isAffected = activeStep <= 1 && i === 3;

                    return (
                      <div
                        key={i}
                        className="absolute w-4 h-4 rounded-full transition-all duration-500"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          backgroundColor: isAffected ? '#ef4444' : activeStep >= 3 ? '#22c55e' : '#3b82f6',
                          boxShadow: `0 0 20px ${isAffected ? '#ef4444' : activeStep >= 3 ? '#22c55e' : '#3b82f6'}`
                        }}
                      />
                    );
                  })}

                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: activeStep >= 3 ? '#22c55e' : activeStep >= 2 ? '#3b82f6' : '#ef4444',
                      boxShadow: `0 0 40px ${activeStep >= 3 ? '#22c55e' : activeStep >= 2 ? '#3b82f6' : '#ef4444'}`
                    }}
                  />

                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    const x = Math.cos(angle) * 100;
                    const y = Math.sin(angle) * 100;

                    return (
                      <div
                        key={i}
                        className="absolute left-1/2 top-1/2 w-px h-[100px] origin-top transition-all duration-500"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                          background: `linear-gradient(to bottom, ${
                            activeStep >= 3 ? '#22c55e' : activeStep >= 2 ? '#3b82f6' : '#ef4444'
                          }, transparent)`
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
