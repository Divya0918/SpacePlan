import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { RoomPreview } from './components/RoomPreview';
import { Pricing } from './components/Pricing';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export function App() {
  const [selectedPlan, setSelectedPlan] = useState<string>('Studio Plan ($12/mo)');
  const [selectedRoomStyle, setSelectedRoomStyle] = useState<string>('Scandinavian');

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
  };

  const handleSelectRoomStyle = (styleName: string) => {
    setSelectedRoomStyle(`${styleName} Living Room`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A231F]">
      {/* Sticky Navigation */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Interactive 3D Room Visualizer (The Special Highlight) */}
        <RoomPreview onSelectPlanInterest={handleSelectRoomStyle} />

        {/* Pricing Section */}
        <Pricing onSelectPlan={handleSelectPlan} />

        {/* About Section */}
        <About />

        {/* Contact / Demo Request Section */}
        <Contact initialPlan={selectedPlan} initialRoomType={selectedRoomStyle} />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default App;
