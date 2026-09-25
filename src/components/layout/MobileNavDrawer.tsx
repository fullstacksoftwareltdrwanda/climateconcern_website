import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, Home, Users, Info, Briefcase, GraduationCap, BookOpen, Phone, ArrowRight } from 'lucide-react';
import { contactHandles } from '../../data/bossContent';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const mobileLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/who-we-are', label: 'Who We Are', icon: Users },
  { to: '/about', label: 'About Us', icon: Info },
  { to: '/what-we-offer', label: 'What We Offer', icon: Briefcase },
  { to: '/training', label: 'Training Program', icon: GraduationCap },
  { to: '/library', label: 'Library', icon: BookOpen },
];

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 bottom-0 w-5/6 max-w-sm bg-[#041d13] text-white shadow-2xl flex flex-col justify-between p-6 overflow-y-auto border-l border-emerald-800/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Drawer Top */}
          <div className="flex items-center justify-between pb-6 border-b border-emerald-900/60">
            <div className="flex items-center gap-3">
              <div className="h-10 px-2 py-1 rounded-xl bg-white shadow-md border border-white/20 flex items-center justify-center shrink-0">
                <img
                  src="/images/logoofthewebsite.png"
                  alt="Climate Concern Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-white leading-tight">Climate Concern</span>
                <span className="text-xs text-emerald-300 font-medium">Kigali, Rwanda</span>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links list */}
          <nav className="flex flex-col gap-1.5 mt-6">
            {mobileLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#00a859] text-white font-semibold shadow-md'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400/60" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom CTA block */}
        <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-emerald-900/60">
          <Link
            to="/get-in-touch#hire-consultant"
            onClick={() => {
              onClose();
              const el = document.getElementById('hire-consultant');
              if (el) {
                setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
              }
            }}
            className="w-full py-3 rounded-xl bg-[#00a859] text-white font-semibold text-center text-sm shadow-md hover:bg-[#00c968] transition-colors flex items-center justify-center gap-2"
          >
            <span>Get Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`tel:${contactHandles.phoneClean}`}
            className="w-full py-2.5 rounded-xl bg-white/10 text-gray-200 font-medium text-center hover:bg-white/15 transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#00e074]" />
            Call {contactHandles.phone}
          </a>
        </div>
      </div>
    </div>
  );
};
