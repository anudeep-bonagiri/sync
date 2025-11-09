import { useEffect, useRef, useState } from 'react';
import { Zap } from 'lucide-react';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [taglineIndex, setTaglineIndex] = useState(0);

  const tagline = "An AI that fixes the network before anyone notices it broke.";
  const words = tagline.split(' ');

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(prev => {
        if (prev < words.length) return prev + 1;
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      connections: number[];
    }> = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: []
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        const dx = mousePos.x - particle.x;
        const dy = mousePos.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          particle.x += dx * 0.01;
          particle.y += dy * 0.01;
        }

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, 3);
        gradient.addColorStop(0, '#E20074');
        gradient.addColorStop(1, 'rgba(226, 0, 116, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const opacity = 1 - dist / 100;
            ctx.strokeStyle = `rgba(226, 0, 116, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  };

  return (
    <div
      className="relative h-screen overflow-hidden bg-[#0A0A0A]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-[#E20074]/10 via-transparent to-[#7C4DFF]/10 z-0" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <div className="mb-6 md:mb-8 relative">
          <Zap className="w-16 h-16 md:w-20 md:h-20 text-[#E20074] animate-pulse" strokeWidth={1.5} />
          <div className="absolute inset-0 blur-2xl bg-[#E20074] opacity-50" />
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-[#E20074] to-[#7C4DFF] bg-clip-text text-transparent leading-tight">
          Adaptive Network<br className="hidden sm:block" />Repair Agent
        </h1>

        <div className="h-20 md:h-24 mb-8 md:mb-12">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light max-w-2xl sm:max-w-3xl lg:max-w-4xl leading-relaxed px-2">
            {words.slice(0, taglineIndex).join(' ')}
            {taglineIndex < words.length && <span className="animate-pulse">|</span>}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-6 w-full sm:w-auto px-2">
          <button className="group relative px-6 sm:px-10 py-3 md:py-5 bg-gradient-to-r from-[#E20074] to-[#7C4DFF] rounded-lg font-semibold text-sm md:text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#E20074]/50 whitespace-nowrap">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C4DFF] to-[#E20074] opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">See the AI Repair Itself</span>
          </button>

          <button className="group relative px-6 sm:px-10 py-3 md:py-5 border-2 border-[#E20074] rounded-lg font-semibold text-sm md:text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#E20074]/30 whitespace-nowrap">
            <div className="absolute inset-0 bg-[#E20074] opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Watch Live Simulation</span>
          </button>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#E20074] rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#E20074] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
