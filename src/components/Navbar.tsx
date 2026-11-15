import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Box } from 'lucide-react';

interface NavbarProps {
  onOpenDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: '3D Studio Workspace', href: '#preview', badge: 'Live CAD' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine active section
      const sections = ['hero', 'features', 'how-it-works', 'preview', 'pricing', 'about', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/90 backdrop-blur-md shadow-soft-sm py-3.5 border-b border-[#EAE2D5]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with 3D cube / house mark */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1C2621] flex items-center justify-center text-white shadow-soft-md group-hover:scale-105 transition-transform duration-200">
              <Box className="w-5 h-5 text-[#5F4336]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1A231F] leading-none">
                Space<span className="text-[#5F4336]">Plan</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-[#728077] uppercase mt-0.5">
                3D Interior Studio
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#EAE2D5] shadow-soft-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#1A231F] bg-[#EDE5D8]'
                      : 'text-[#5A6860] hover:text-[#1A231F] hover:bg-[#F3ECE2]'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#5F4336] text-white">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Get Started Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => {
                handleLinkClick(e, '#contact');
                if (onOpenDemo) onOpenDemo();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5F4336] hover:bg-[#4E362B] text-white text-xs font-bold tracking-wide shadow-soft-md hover:shadow-soft-lg border border-[#866350]/30 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#1A231F] hover:bg-[#EFE8DD] transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#FAF7F2] border-b border-[#E5DCD0] shadow-soft-xl px-4 py-6 transition-all duration-300 animate-fadeIn">
          <div className="flex flex-col gap-2 max-w-md mx-auto">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`px-4 py-3 text-sm font-semibold rounded-xl flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[#2A4136] text-white'
                      : 'text-[#3E4D45] hover:bg-[#EFE7DB]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#5F4336] text-white">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
            <div className="pt-4 mt-2 border-t border-[#EAE2D5]">
              <a
                href="#contact"
                onClick={(e) => {
                  handleLinkClick(e, '#contact');
                  if (onOpenDemo) onOpenDemo();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#5F4336] text-white text-sm font-bold shadow-soft-md"
              >
                <span>Request Free Demo</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
