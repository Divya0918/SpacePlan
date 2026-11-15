import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Building2, 
  Copy, 
  Check, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import type { DemoFormData, FormErrors } from '../types';

interface ContactProps {
  initialPlan?: string;
  initialRoomType?: string;
}

export const Contact: React.FC<ContactProps> = ({ 
  initialPlan = 'Studio Plan ($12/mo)', 
  initialRoomType = 'Living Room' 
}) => {
  const [formData, setFormData] = useState<DemoFormData>({
    fullName: '',
    email: '',
    roomType: initialRoomType,
    planInterest: initialPlan,
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Email format validation regex
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate async network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D9633B', '#2A4136', '#EAE2D5', '#D4AF37'],
        });
      } catch (err) {
        console.log('Confetti effect:', err);
      }
    }, 700);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@spaceplan.design');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      roomType: 'Living Room',
      planInterest: 'Studio Plan ($12/mo)',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const roomOptions = [
    'Living Room',
    'Master Bedroom',
    'Studio Apartment',
    'Dining / Kitchen',
    'Home Office',
    'Full Home Remodel',
  ];

  return (
    <section id="contact" className="py-24 bg-[#F5EFE6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A4136]/10 border border-[#2A4136]/20 text-[#2A4136] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D9633B]" />
            Request Free Studio Demo
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A231F] tracking-tight mb-4">
            Ready to Design Your Dream Space?
          </h2>
          <p className="text-[#5B6961] text-base sm:text-lg leading-relaxed">
            Discover how SpacePlan can help you bring your interior design ideas to life. 
            Request an interactive demo or get in touch with our design studio specialists.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Product Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-[#E5DDD2] shadow-soft-md space-y-6">
              
              <div>
                <span className="text-xs font-bold text-[#D9633B] uppercase tracking-wider">
                  Product & Studio
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#1A231F] mt-1">
                  SpacePlan Studio
                </h3>
                <p className="text-xs text-[#6B7971] mt-2 leading-relaxed">
                  Web-based 3D interior design and spatial planning platform. 
                  Designed to bridge conceptual sketches and architectural realization.
                </p>
              </div>

              {/* Email Block with Copy Button */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2A4136] text-white flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#D9633B]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#7A8880] uppercase tracking-wider">Direct Inquiries</div>
                    <a 
                      href="mailto:hello@spaceplan.design" 
                      className="text-sm font-bold text-[#1A231F] hover:text-[#D9633B] transition-colors"
                    >
                      hello@spaceplan.design
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-xl bg-white hover:bg-[#EFE8DD] text-[#55635B] border border-[#E0D7C9] transition-all"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Response Time & Location */}
              <div className="space-y-4 pt-2 border-t border-[#F0EAE0]">
                <div className="flex items-center gap-3 text-xs text-[#526058]">
                  <Clock className="w-4 h-4 text-[#D9633B] shrink-0" />
                  <span>Rapid response guarantee: within <strong>2 business hours</strong></span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#526058]">
                  <MapPin className="w-4 h-4 text-[#D9633B] shrink-0" />
                  <span>Studio Headquarters: 540 Design District Blvd, Suite 400</span>
                </div>
              </div>

            </div>

            {/* SpacePlan Studio Guarantee Box */}
            <div className="bg-[#1C2621] rounded-3xl p-7 text-white shadow-soft-lg space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#D9633B]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#D9633B]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#D9633B]">
                  Design Excellence
                </span>
              </div>
              <h4 className="font-serif text-lg font-semibold text-white">
                SpacePlan Enterprise & Studio Assurance
              </h4>
              <p className="text-xs text-white/75 leading-relaxed">
                Experience architectural accuracy, physically based rendering, and seamless cross-device spatial exploration built for creators worldwide.
              </p>
              <div className="pt-2 text-[11px] font-bold tracking-wider text-white/60 uppercase">
                Tagline: "Design Your Space. Visualize Your Future."
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Demo Request Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E5DDD2] shadow-soft-xl">
              
              {isSubmitted ? (
                // Success Confirmation State
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1A231F]">
                      Demo Request Received!
                    </h3>
                    <p className="text-[#5F6E66] text-sm sm:text-base max-w-md mx-auto mt-2 leading-relaxed">
                      Thank you, <strong className="text-[#1A231F]">{formData.fullName}</strong>. We have registered your inquiry 
                      for <strong className="text-[#D9633B]">{formData.roomType}</strong> visual staging. 
                      A personalized 3D sandbox access link has been prepared for <strong className="text-[#1A231F]">{formData.email}</strong>.
                    </p>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE4D8] max-w-sm mx-auto text-left text-xs space-y-1.5 text-[#54625A]">
                    <div><strong>Selected Plan:</strong> {formData.planInterest}</div>
                    <div><strong>Room Target:</strong> {formData.roomType}</div>
                    <div><strong>Status:</strong> Immediate Instant Access Enabled</div>
                  </div>

                  <button
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2A4136] hover:bg-[#1C2621] text-white text-xs font-bold transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Submit Another Request</span>
                  </button>
                </div>
              ) : (
                // Demo Request Form
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="border-b border-[#F0EAE0] pb-4">
                    <h3 className="font-serif text-2xl font-semibold text-[#1A231F]">
                      Schedule a Personalized Demo
                    </h3>
                    <p className="text-xs text-[#718077] mt-1">
                      Fill out your room specifications to receive interactive sample layouts.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="text-xs font-bold text-[#1A231F] flex items-center justify-between">
                      <span>Full Name <span className="text-[#D9633B]">*</span></span>
                      {errors.fullName && (
                        <span className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.fullName}
                        </span>
                      )}
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-sm border bg-[#FAF8F5] focus:bg-white transition-all outline-none ${
                        errors.fullName 
                          ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100' 
                          : 'border-[#E0D7C9] focus:border-[#D9633B] focus:ring-2 focus:ring-[#D9633B]/20'
                      }`}
                      required
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-[#1A231F] flex items-center justify-between">
                      <span>Email Address <span className="text-[#D9633B]">*</span></span>
                      {errors.email && (
                        <span className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </span>
                      )}
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. eleanor@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-sm border bg-[#FAF8F5] focus:bg-white transition-all outline-none ${
                        errors.email 
                          ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100' 
                          : 'border-[#E0D7C9] focus:border-[#D9633B] focus:ring-2 focus:ring-[#D9633B]/20'
                      }`}
                      required
                    />
                  </div>

                  {/* Room Type Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1A231F] block">
                      Target Room Project
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {roomOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, roomType: opt })}
                          className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                            formData.roomType === opt
                              ? 'bg-[#2A4136] text-white border-[#2A4136] shadow-soft-sm'
                              : 'bg-[#FAF8F5] text-[#55635B] border-[#E2D9CC] hover:bg-[#F2ECE2]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-[#1A231F] flex items-center justify-between">
                      <span>Specific Design Goals or Dimensions <span className="text-[#84928A] font-normal">(Optional)</span></span>
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Tell us about your room size, preferred furniture aesthetic, or remodel challenges..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm border border-[#E0D7C9] bg-[#FAF8F5] focus:bg-white focus:border-[#D9633B] focus:ring-2 focus:ring-[#D9633B]/20 transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-[#D9633B] hover:bg-[#C24F29] text-white font-bold text-sm shadow-soft-lg hover:shadow-soft-xl transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying & Preparing 3D Space...</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        <span>Request Studio Demo</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-[#829088]">
                    100% frontend assignment demo. By submitting, you agree to our standard academic simulation terms.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
