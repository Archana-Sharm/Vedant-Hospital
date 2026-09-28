import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/specialities', label: 'Specialities' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { settings } = useHospital();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={settings.name}>
          {settings.logo ? (
            <img
              src={settings.logo}
              alt={settings.name}
              className="h-10 sm:h-12 lg:h-14 w-auto max-w-[190px] object-contain"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-serif text-lg font-bold">V</div>
              <div className="hidden sm:block">
                <div className={`text-sm font-semibold leading-tight ${scrolled ? 'text-text' : 'text-white'}`}>
                  Vedant Multispeciality
                </div>
                <div className={`text-xs leading-tight ${scrolled ? 'text-text-muted' : 'text-white/80'}`}>Hospital</div>
              </div>
            </div>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-primary bg-primary-50'
                    : scrolled
                    ? 'text-text hover:text-primary hover:bg-muted'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${settings.phone}`}
            className={`text-sm font-medium ${scrolled ? 'text-primary' : 'text-white'}`}
          >
            {settings.phone}
          </a>
          <Link
            to="/contact"
            className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-dark transition-colors"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 rounded-md ${scrolled ? 'text-text' : 'text-white'}`}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-border shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm font-medium rounded-md ${
                    isActive ? 'text-primary bg-primary-50' : 'text-text hover:bg-muted'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="block mt-2 px-4 py-3 bg-accent text-white text-sm font-semibold rounded-lg text-center"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
