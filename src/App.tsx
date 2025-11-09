import { useEffect } from 'react';
import Hero from './components/Hero';
import ConceptSection from './components/ConceptSection';
import Dashboard from './components/Dashboard';
import WhySection from './components/WhySection';
import DemoFlow from './components/DemoFlow';
import TechStack from './components/TechStack';
import CompetitiveAdvantage from './components/CompetitiveAdvantage';
import Team from './components/Team';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed') || '0.5');
        const yPos = -(scrolled * speed);
        (el as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.title = 'Adaptive Network Repair Agent - Self-Healing AI';
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased">
      <Hero />
      <ConceptSection />
      <Dashboard />
      <WhySection />
      <DemoFlow />
      <TechStack />
      <CompetitiveAdvantage />
      <Team />
      <Footer />
    </div>
  );
}

export default App;
