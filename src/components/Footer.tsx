import { Link } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import { MedicalIcon, iconColor } from './MedicalIcons';

export default function Footer() {
  const { settings } = useHospital();

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/specialities', label: 'Specialities' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const services = [
    'General Medicine', 'General Surgery', 'Orthopaedics',
    'Cardiology', 'Oncology', 'Neurology',
    'Nephrology', 'Emergency Care', 'Diagnostics',
  ];

  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <div className="flex items-center justify-start mb-4">
            <img
              src={settings.logo}
              alt={settings.name}
              className="h-16 sm:h-18 w-auto max-w-[240px] object-contain rounded-lg bg-white/80 p-2"
            />
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-5">{settings.tagline}</p>
          <div className="flex gap-3">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Facebook">
                <MedicalIcon name="globe" size={16} className="text-white" strokeWidth={2.2} />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Instagram">
                <MedicalIcon name="camera" size={16} className="text-white" strokeWidth={2.2} />
              </a>
            )}
            {settings.youtube && (
              <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="YouTube">
                <MedicalIcon name="newspaper" size={16} className="text-white" strokeWidth={2.2} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-white/70 hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Services</h3>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s}>
                <Link to="/services" className="text-sm text-white/70 hover:text-white transition-colors">{s}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4">Contact</h3>
          <div className="space-y-3 text-sm text-white/70">
            <p className="flex gap-2">
              <MedicalIcon name="phone" size={16} className="mt-0.5 shrink-0" color={iconColor.white} strokeWidth={2.2} />
              <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">{settings.phone}</a>
            </p>
            <p className="flex gap-2">
              <MedicalIcon name="location" size={16} className="mt-0.5 shrink-0" color={iconColor.white} strokeWidth={2.2} />
              <span>{settings.address}</span>
            </p>
            <p className="flex gap-2">
              <MedicalIcon name="clock" size={16} className="mt-0.5 shrink-0" color={iconColor.white} strokeWidth={2.2} />
              <span>{settings.workingHours}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {settings.name}. All Rights Reserved.</p>
          <p>Privacy Policy · Terms &amp; Conditions</p>
        </div>
      </div>
    </footer>
  );
}
