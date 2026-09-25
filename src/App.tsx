import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { WhoWeArePage } from './pages/WhoWeArePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { WhatWeOfferPage } from './pages/WhatWeOfferPage';
import { TrainingProgramPage } from './pages/TrainingProgramPage';
import { LibraryPage } from './pages/LibraryPage';
import { GetInTouchPage } from './pages/GetInTouchPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

// Admin imports
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminDashboardPage } from './admin/AdminDashboardPage';
import { ApplicationsSection } from './admin/sections/ApplicationsSection';
import { ConsultantRequestsSection } from './admin/sections/ConsultantRequestsSection';
import { TeamSection } from './admin/sections/TeamSection';
import { ServicesSection } from './admin/sections/ServicesSection';
import { TrainingSection } from './admin/sections/TrainingSection';
import { FaqsSection } from './admin/sections/FaqsSection';
import { StatsSection } from './admin/sections/StatsSection';
import { ContactSection } from './admin/sections/ContactSection';
import { LegalSection } from './admin/sections/LegalSection';
import { LibrarySection } from './admin/sections/LibrarySection';
import { AdminsSection } from './admin/sections/AdminsSection';
import { ProfileSection } from './admin/sections/ProfileSection';

function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Admin Login (standalone layout) ── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ── Admin Dashboard & Management (protected by AdminLayout) ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="applications" element={<ApplicationsSection />} />
            <Route path="consultant-requests" element={<ConsultantRequestsSection />} />
            <Route path="team" element={<TeamSection />} />
            <Route path="services" element={<ServicesSection />} />
            <Route path="training" element={<TrainingSection />} />
            <Route path="faqs" element={<FaqsSection />} />
            <Route path="stats" element={<StatsSection />} />
            <Route path="contact" element={<ContactSection />} />
            <Route path="legal" element={<LegalSection />} />
            <Route path="library" element={<LibrarySection />} />
            <Route path="admins" element={<AdminsSection />} />
            <Route path="profile" element={<ProfileSection />} />
          </Route>

          {/* ── Public Website Routes ── */}
          <Route element={<RootLayout />}>
            {/* Main 6 Menus from Boss Content */}
            <Route path="/" element={<HomePage />} />
            <Route path="/who-we-are" element={<WhoWeArePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/what-we-offer" element={<WhatWeOfferPage />} />
            <Route path="/training" element={<TrainingProgramPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/get-in-touch" element={<GetInTouchPage />} />

            {/* Legal Pages */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Legacy Aliases & Redirects */}
            <Route path="/services" element={<Navigate to="/what-we-offer" replace />} />
            <Route path="/contact" element={<Navigate to="/get-in-touch" replace />} />
            <Route path="/meet-us" element={<Navigate to="/who-we-are" replace />} />
            <Route path="/team" element={<Navigate to="/who-we-are" replace />} />
            <Route path="/consultation" element={<Navigate to="/get-in-touch" replace />} />
            <Route path="/book-consultation" element={<Navigate to="/get-in-touch" replace />} />

            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;
