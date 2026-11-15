import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  HeartHandshake, 
  Award, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { value: '10,000+', label: 'Dream Rooms Planned' },
    { value: '5,000+', label: 'Curated 3D Furniture Assets' },
    { value: '60 FPS', label: 'Zero-Lag WebGL Rendering' },
    { value: '99.4%', label: 'Design Satisfaction Rate' },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Democratizing Interior Architecture',
      description: 'We believe anyone should be able to visualize their dream living space without learning complex, expensive CAD software.',
    },
    {
      icon: Award,
      title: 'Design Precision & Realism',
      description: 'Every mesh, light reflection, and texture in SpacePlan matches authentic manufacturer dimensions and physical material properties.',
    },
    {
      icon: HeartHandshake,
      title: 'Seamless Collaboration',
      description: 'Bridge the communication gap between homeowners, interior designers, architects, and remodeling contractors effortlessly.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#FAF7F2] relative border-t border-[#EDE6DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column About Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          
          {/* Left Column: Image Mosaic */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] bg-[#EFECE6] border border-[#E8DFD3] shadow-soft-xl">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern architectural interior design space"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-[#EDE4D8] shadow-soft-xl max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2A4136] text-white flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5 text-[#D9633B]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A231F]">SpacePlan Architectural Lab</div>
                    <div className="text-[10px] text-[#78877E] font-medium">Design Without Boundaries</div>
                  </div>
                </div>
                <p className="text-[11px] text-[#5A675F] mt-2.5 leading-snug">
                  Empowering modern homeowners and interior stylists with cutting-edge real-time WebGL spatial architecture.
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Mission & Vision Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A4136]/10 border border-[#2A4136]/20 text-[#2A4136] text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-[#D9633B]" />
              Our Vision & Craft
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A231F] tracking-tight leading-tight">
              Bridging the Gap Between <br className="hidden sm:inline" />
              <span className="italic text-[#D9633B]">Pure Imagination</span> and Reality.
            </h2>

            <p className="text-[#56645C] text-base sm:text-lg leading-relaxed">
              Founded on the belief that everyone deserves an environment that inspires them, 
              SpacePlan was created to replace flat, uninspiring 2D floor plans with dynamic, 
              spatially accurate 3D environments that run instantly in the browser.
            </p>

            <p className="text-[#68766E] text-sm sm:text-base leading-relaxed">
              Whether you are revamping a single studio corner or coordinating a multi-room renovation, 
              our browser-based platform allows you to test furniture proportions, try daring wall colors, 
              and inspect daylight illumination before spending a single dollar on contractor labor.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Zero plugins or heavy software installation',
                'Physically based rendering (PBR) lighting',
                'Curated contemporary & heritage aesthetics',
                'Direct PDF & CAD itemized export',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#324037]">
                  <CheckCircle2 className="w-4 h-4 text-[#D9633B] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A231F] hover:bg-[#2A3730] text-white text-xs font-bold transition-all shadow-soft-sm"
              >
                <span>Request a Free Studio Demo</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-2 text-xs text-[#6F7D74] font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Frontend Interactive Sandbox</span>
              </div>
            </div>

          </div>

        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white rounded-3xl p-8 border border-[#E8DFD3] shadow-soft-sm mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1A231F]">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-[#76847C] uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-[#F8F4EE] rounded-2xl p-6 border border-[#E8DFD3] space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-[#D9633B] flex items-center justify-center shadow-soft-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-semibold text-[#1A231F]">
                  {val.title}
                </h4>
                <p className="text-[#64726A] text-xs leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
