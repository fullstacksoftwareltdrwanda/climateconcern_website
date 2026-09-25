import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, GraduationCap, Users } from 'lucide-react';

const dockLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/what-we-offer', label: 'Services', icon: Briefcase },
  { to: '/training', label: 'Training', icon: GraduationCap },
  { to: '/who-we-are', label: 'Who We Are', icon: Users },
];

export const MobileBottomDock: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 pb-safe md:hidden shadow-lg">
      <div className="grid grid-cols-4 px-2 py-1.5">
        {dockLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                isActive ? 'text-[#00652c] font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
