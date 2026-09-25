import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { contactHandles } from '../../data/bossContent';

const menuLinks = [
  { to: '/', label: 'Home' },
  { to: '/who-we-are', label: 'Who We Are' },
  { to: '/about', label: 'About Us' },
  { to: '/what-we-offer', label: 'What We Offer' },
  { to: '/training', label: 'Training Program' },
  { to: '/library', label: 'Library' },
  { to: '/get-in-touch', label: 'Get in Touch' },
];

const offerList = [
  'Climate Finance Proposal Design',
  'Carbon Market Projects Design',
  'Stakeholder Engagement',
  'Strategic Environmental Impact Assessment',
  'Social & Environmental Impact Assessment',
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#03180f] text-gray-300 pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-layout mx-auto px-layout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-emerald-900/60">
          {/* Col 1: Brand & Overview */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-11 sm:h-12 px-2.5 py-1 rounded-xl bg-white shadow-md border border-white/20 flex items-center justify-center shrink-0">
                <img src="/images/logoofthewebsite.png" alt="Climate Concern Logo" className="h-full w-auto object-contain" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-tight">
                Climate Concern <span className="text-[#00e074]">Rwanda</span>
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed pr-4">
              Climate Concern, a consulting company established in 2012 and based in Kigali. Providing expert services in sectors relevant to environment and climate change across Rwanda and the East African Community (EAC).
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-medium border border-emerald-800/80 self-start">
              <span>Established 2012</span>
              <span>•</span>
              <span>Kigali, Rwanda</span>
            </div>
          </div>

          {/* Col 2: Navigation Menus */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              {menuLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: What We Offer */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              What We Offer
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
              {offerList.map((service) => (
                <li key={service} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e074] mt-2 shrink-0" />
                  <Link to="/what-we-offer" className="hover:text-white transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Handles & Physical Address (Directly from Boss Document) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00e074] shrink-0 mt-1" />
                <span className="leading-snug">{contactHandles.physicalAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00e074] shrink-0" />
                <a href={`tel:${contactHandles.phoneClean}`} className="hover:text-white transition-colors font-medium">
                  {contactHandles.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00e074] shrink-0" />
                <a href={`mailto:${contactHandles.email}`} className="hover:text-white transition-colors">
                  {contactHandles.email}
                </a>
              </div>

              {/* Social Handles specified by boss */}
              <div className="mt-2 pt-3 border-t border-emerald-900/60 flex flex-col gap-1.5 text-xs text-emerald-200/90">
                <span className="font-bold text-white uppercase tracking-wider">Social Handles:</span>
                <div className="flex flex-wrap gap-3 mt-1">
                  <a
                    href={contactHandles.xUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors px-2.5 py-1 rounded bg-white/5 border border-white/10"
                  >
                    X: <span className="font-semibold text-white">{contactHandles.x}</span>
                  </a>
                  <a
                    href={contactHandles.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors px-2.5 py-1 rounded bg-white/5 border border-white/10"
                  >
                    LinkedIn: <span className="font-semibold text-white">{contactHandles.linkedin}</span>
                  </a>
                  <a
                    href={contactHandles.igUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors px-2.5 py-1 rounded bg-white/5 border border-white/10"
                  >
                    IG: <span className="font-semibold text-white">{contactHandles.ig}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © {new Date().getFullYear()} Climate Concern Rwanda. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/who-we-are" className="hover:text-white transition-colors">Who We Are</Link>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/what-we-offer" className="hover:text-white transition-colors">What We Offer</Link>
            <Link to="/training" className="hover:text-white transition-colors">Training Program</Link>
            <Link to="/library" className="hover:text-white transition-colors">Library</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
