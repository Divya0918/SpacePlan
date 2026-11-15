import React, { useState } from 'react';
import { Box, ArrowUp, Send, Check } from 'lucide-react';
import { Modal } from './Modal';

export const Footer: React.FC = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#151D18] text-white pt-20 pb-12 border-t border-[#25332A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info (col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#25362E] flex items-center justify-center text-white shadow-soft-sm">
                <Box className="w-5 h-5 text-[#D9633B]" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none block">
                  Space<span className="text-[#D9633B]">Plan</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-white/50 uppercase">
                  3D Interior Design SaaS
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Design, customize, and visualize your dream interior in 3D. 
              SpacePlan empowers homeowners, designers, and architects to eliminate guesswork 
              before physical remodeling starts.
            </p>

            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#D9633B]">
                Tagline
              </div>
              <div className="text-sm italic font-serif text-white/90">
                "Design Your Space. Visualize Your Future."
              </div>
            </div>
          </div>

          {/* Product Links (col 5-6) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Home Overview
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features & Tools
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#preview" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>3D Visualizer</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-[#D9633B] text-white">
                    Live
                  </span>
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Studio Info (col 7-8) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              SpacePlan Studio
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Pioneering interactive 3D spatial planning tools for modern homes and creative studios.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 space-y-1">
              <div><strong>Platform:</strong> SpacePlan SaaS Studio</div>
              <div><strong>Rendering:</strong> Real-time WebGL Engine</div>
              <div><strong>Core Stack:</strong> React, TypeScript, Three.js, Tailwind</div>
            </div>
            <div className="pt-1">
              <a href="#about" className="text-xs text-[#D9633B] hover:underline font-semibold">
                Read About Our Craft & Mission →
              </a>
            </div>
          </div>

          {/* Newsletter / Contact Quick Info (col 9-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              Stay Inspired
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Subscribe to receive weekly curated color palettes and 3D architectural interior guides.
            </p>

            <form onSubmit={handleNewsletter} className="relative mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#D9633B] pr-10"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-[#D9633B] hover:bg-[#C24F29] text-white flex items-center justify-center transition-colors"
                aria-label="Subscribe to newsletter"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] text-emerald-400 font-medium">
                Thank you for subscribing!
              </p>
            )}

            <div className="pt-2 text-xs text-white/60">
              Direct Contact: <a href="mailto:hello@spaceplan.design" className="text-[#D9633B] hover:underline">hello@spaceplan.design</a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © 2026 SpacePlan Studio. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Privacy Policy – SpacePlan Studio"
      >
        <p><strong>Effective Date:</strong> January 1, 2026</p>
        <p>
          SpacePlan Studio ("SpacePlan", "we", "us") values your privacy. 
          This Privacy Policy explains how information is handled within the SpacePlan 3D Interior Design SaaS web application.
        </p>
        <h4 className="font-bold text-[#1A231F] text-sm pt-2">1. Frontend Operation & Data Collection</h4>
        <p>
          This application operates purely client-side within your browser. 
          No personal information or architectural floor plans submitted via the demo form are permanently stored in an external database.
        </p>
        <h4 className="font-bold text-[#1A231F] text-sm pt-2">2. Local Storage & Cookies</h4>
        <p>
          Temporary session states (such as active 3D wall color selections and lighting presets) are retained purely in memory during your active browser session.
        </p>
        <h4 className="font-bold text-[#1A231F] text-sm pt-2">3. Contact Inquiries</h4>
        <p>
          For questions regarding this privacy notice, contact us at: <code>hello@spaceplan.design</code>.
        </p>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Terms of Service – SpacePlan Studio"
      >
        <p><strong>Effective Date:</strong> January 1, 2026</p>
        <p>
          Welcome to SpacePlan Studio. By accessing this SaaS marketing website and interactive 3D studio visualizer, 
          you agree to these Terms of Service.
        </p>
        <h4 className="font-bold text-[#1A231F] text-sm pt-2">1. Nature of the Service</h4>
        <p>
          SpacePlan provides a 3D visualization platform for room design, color planning, and spatial preview. 
          All sample prices (e.g. Free Starter Plan, $12/mo Studio Plan) are illustrative demonstration benchmarks.
        </p>
        <h4 className="font-bold text-[#1A231F] text-sm pt-2">2. Intellectual Property</h4>
        <p>
          All proprietary branding, procedural 3D room components, and interactive interfaces are developed 
          for SpacePlan Studio.
        </p>
        <h4 className="font-bold text-[#1A231F] text-sm pt-2">3. Limitation of Liability</h4>
        <p>
          SpacePlan 3D visual models are intended for layout estimation and aesthetic planning. 
          Structural architectural modifications should always be validated by licensed engineering professionals.
        </p>
      </Modal>

    </footer>
  );
};
