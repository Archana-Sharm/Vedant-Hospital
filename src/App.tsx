import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { useEffect } from 'react';

import { HospitalProvider } from './context/HospitalContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Specialities from './pages/Specialities';
import Contact from './pages/Contact';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBanners from './pages/admin/AdminBanners';
import AdminDoctors from './pages/admin/AdminDoctors';

import AdminSpecialities from './pages/admin/AdminSpecialities';
import AdminSocialPosts from './pages/admin/AdminSocialPosts';
import AdminSettings from './pages/admin/AdminSettings';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PublicLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/specialities" element={<Specialities />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <HospitalProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollToTop />

          <Routes>

            {/* ================= ADMIN LOGIN ================= */}

            <Route
              path="/admin"
              element={<AdminLogin />}
            />

            {/* ================= ADMIN PANEL ================= */}

            <Route
              path="/admin/*"
              element={<AdminLayout />}
            >
              <Route
                path="dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="banners"
                element={<AdminBanners />}
              />

              <Route
                path="doctors"
                element={<AdminDoctors />}
              />

              <Route
                path="specialities"
                element={<AdminSpecialities />}
              />

              <Route
                path="social"
                element={<AdminSocialPosts />}
              />

              <Route
                path="settings"
                element={<AdminSettings />}
              />
            </Route>

            {/* ================= PUBLIC WEBSITE ================= */}

            <Route
              path="/*"
              element={<PublicLayout />}
            />

          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </HospitalProvider>
  );
}
