import { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';

import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

export default function AdminSettings() {
  const { settings, updateSettings } = useHospital();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const field = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const sections = [
    {
      title: 'Hospital Identity',
      fields: [
        { label: 'Hospital Name', key: 'name' as const, placeholder: 'Vedant Multispeciality Hospital' },
        { label: 'Tagline', key: 'tagline' as const, placeholder: 'Comprehensive Healthcare...' },
        { label: 'Logo URL', key: 'logo' as const, placeholder: 'https://...' },
      ],
    },
    {
      title: 'Contact Information',
      fields: [
        { label: 'Primary Phone', key: 'phone' as const, placeholder: '+91 93250 39914' },
        { label: 'Alternate Phone', key: 'alternatePhone' as const, placeholder: '' },
        { label: 'Emergency Contact', key: 'emergencyContact' as const, placeholder: '+91 93250 39914' },
        { label: 'WhatsApp Number', key: 'whatsapp' as const, placeholder: '+919325039914' },
        { label: 'Email', key: 'email' as const, placeholder: 'info@vedanthospital.com' },
        { label: 'Working Hours', key: 'workingHours' as const, placeholder: 'Open 24 Hours' },
      ],
    },
    {
      title: 'Location',
      fields: [
        { label: 'Address', key: 'address' as const, placeholder: 'MQ6W+299, Sambhajinagar...', textarea: true },
        { label: 'Google Maps Link', key: 'mapsLink' as const, placeholder: 'https://maps.google.com/...' },
      ],
    },
    {
      title: 'Social Media',
      fields: [
        { label: 'Facebook URL', key: 'facebook' as const, placeholder: 'https://facebook.com/...' },
        { label: 'Instagram URL', key: 'instagram' as const, placeholder: 'https://instagram.com/...' },
        { label: 'YouTube URL', key: 'youtube' as const, placeholder: 'https://youtube.com/...' },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-semibold text-text">Hospital Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white border border-border rounded-xl p-6">
            <h2 className="font-semibold text-text mb-5 pb-3 border-b border-border">{section.title}</h2>
            <div className="space-y-4">
              {section.fields.map((f) => (
                <div key={f.key as string}>
                  <label className="block text-sm font-medium text-text mb-1.5">{f.label}</label>
                  {(f as { textarea?: boolean }).textarea ? (
                    <textarea {...field(f.key)} placeholder={f.placeholder} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-20" />
                  ) : (
                    <input type="text" {...field(f.key)} placeholder={f.placeholder} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logo preview */}
        {form.logo && (
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="font-semibold text-text mb-4">Logo Preview</h2>
            <img src={form.logo} alt="Logo preview" className="max-h-24 max-w-48 object-contain border border-border rounded-lg p-2 bg-muted" />
          </div>
        )}

        <div className="flex items-center gap-4">
          <button type="submit" className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
            Save Settings
          </button>
          {saved && (
            <span className="text-success text-sm font-medium flex items-center gap-1.5">
              <MedicalIcon name="check" size={14} color={iconColor.teal} strokeWidth={2.5} /> Settings saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
