import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, PhoneCall, ArrowRight } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';
import { contactHandles } from '../../data/bossContent';

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/who-we-are', label: 'Who We Are' },
  { to: '/about', label: 'About Us' },
  { to: '/what-we-offer', label: 'What We Offer' },
  { to: '/training', label: 'Training Program' },
  { to: '/library', label: 'Library' },
];

export const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#031d12]/95 backdrop-blur-md border-b border-emerald-800/40 shadow-xl'
            : 'bg-[#031d12]/90 backdrop-blur-md border-b border-white/10 shadow-lg'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 lg:gap-4 flex-nowrap">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="h-11 sm:h-12 px-2.5 py-1 rounded-xl bg-white shadow-md border border-white/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/images/logoofthewebsite.png"
                alt="Climate Concern Rwanda Logo"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="flex flex-col shrink-0">
              <span className="font-display text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white leading-tight whitespace-nowrap">
                Climate Concern <span className="text-[#00e074]">Rwanda</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-emerald-300/80 font-medium hidden xl:block whitespace-nowrap">
                Environmental & Climate Consulting • Kigali
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — 6 Menus */}
          <nav className="hidden min-[900px]:flex items-center gap-0.5 xl:gap-1 bg-white/5 p-1 rounded-full border border-white/10 shrink-0 flex-nowrap shadow-inner backdrop-blur-sm">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#00a859] text-white font-semibold shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons — Phone + Get Consultation CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap">
            {/* Phone Number */}
            <a
              href={`tel:${contactHandles.phoneClean}`}
              className="hidden sm:flex items-center gap-1.5 text-xs xl:text-[13px] font-medium text-white/90 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 transition-all whitespace-nowrap shrink-0 shadow-xs"
              title="Call Kigali Office"
            >
              <div className="w-4 h-4 rounded-full bg-[#00a859]/30 flex items-center justify-center shrink-0">
                <PhoneCall className="w-2.5 h-2.5 text-[#00e074] shrink-0" />
              </div>
              <span className="whitespace-nowrap">{contactHandles.phone}</span>
            </a>

            {/* Get Consultation CTA Button — scrolls directly down to form */}
            <Link
              to="/get-in-touch#hire-consultant"
              onClick={() => {
                const el = document.getElementById('hire-consultant');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4.5 py-2 rounded-full bg-[#00a859] hover:bg-[#00c968] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-emerald-900/50 transition-all whitespace-nowrap shrink-0"
            >
              <span>Get Consultation</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="min-[900px]:hidden w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};
