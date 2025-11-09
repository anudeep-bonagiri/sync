import { useEffect, useRef, useState } from 'react';
import catIcon from '../assets/cat-icon.png';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      connections: number[];
    }> = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        connections: []
      });
    }

    let animationId: number;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameInterval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, i) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

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

            if (dist < 120) {
              const opacity = 1 - dist / 120;
              ctx.strokeStyle = `rgba(226, 0, 116, ${opacity * 0.2})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        });

        lastTime = currentTime - (deltaTime % frameInterval);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      setCanvasSize();
      particles.forEach(particle => {
        particle.x = Math.min(particle.x, canvas.width);
        particle.y = Math.min(particle.y, canvas.height);
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="relative h-screen overflow-hidden bg-[#0A0A0A]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-[#E20074]/10 via-transparent to-[#7C4DFF]/10 z-0" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <div className="mb-6 md:mb-8 relative fade-in">
          <div className="relative">
            <img 
              src={catIcon} 
              alt="Sync Cat" 
              className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 relative z-10 drop-shadow-[0_0_20px_rgba(226,0,116,0.5)]" 
            />
            <div className="absolute inset-0 blur-2xl bg-[#E20074] opacity-50" />
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-[#E20074] to-[#7C4DFF] bg-clip-text text-transparent leading-tight fade-in-delay-1">
          Sync
        </h1>

        <div className="h-20 md:h-24 mb-8 md:mb-12 fade-in-delay-2">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light max-w-2xl sm:max-w-3xl lg:max-w-4xl leading-relaxed px-2">
            {words.slice(0, taglineIndex).join(' ')}
            {taglineIndex < words.length && <span className="animate-pulse">|</span>}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-6 w-full sm:w-auto px-2 fade-in-delay-3">
          <a
            href="https://www.youtube.com/watch?v=sskMo1zCaXM"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-6 sm:px-10 py-3 md:py-5 bg-gradient-to-r from-[#E20074] to-[#7C4DFF] rounded-lg font-semibold text-sm md:text-lg overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-[#E20074]/50 whitespace-nowrap transform-gpu"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C4DFF] to-[#E20074] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">See the AI Repair Itself</span>
          </a>

          <a
            href="https://devpost.com/software/sync-ai-gltbhz"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-6 sm:px-10 py-3 md:py-5 border-2 border-[#E20074] rounded-lg font-semibold text-sm md:text-lg overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-[#E20074]/30 whitespace-nowrap transform-gpu"
          >
            <div className="absolute inset-0 bg-[#E20074] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Watch Live Simulation</span>
          </a>
        </div>

      </div>
    </div>
  );
}
