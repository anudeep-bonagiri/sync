import { useEffect } from 'react';
import Hero from './components/Hero';
import ConceptSection from './components/ConceptSection';
import Dashboard from './components/Dashboard';
import WhySection from './components/WhySection';
import DemoFlow from './components/DemoFlow';
import TechStack from './components/TechStack';
// import CompetitiveAdvantage from './components/CompetitiveAdvantage';
import Team from './components/Team';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    document.title = 'Sync - Self-Healing AI';
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased">
      <Hero />
      <ConceptSection />
      <Dashboard />
      <WhySection />
      <DemoFlow />
      <TechStack />
      <Team />
      <Footer />
    </div>
  );
}

export default App;
