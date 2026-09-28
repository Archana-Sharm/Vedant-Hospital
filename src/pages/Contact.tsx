import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MedicalIcon, iconColor } from '../components/MedicalIcons';

function sanitize(val: string) {
  return val.replace(/[<>'"&]/g, '');
}

export default function Contact() {
  const { settings } = useHospital();
  const ref = useScrollReveal();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || !/^[\d\s\+\-]{7,15}$/.test(form.phone)) e.phone = 'Valid phone number required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1200);
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: sanitize(e.target.value) })),
  });

  const inputClass = (key: string) =>
    `w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
      errors[key] ? 'border-danger bg-danger/5' : 'border-border bg-white focus:border-primary'
    }`;

  const faqs = [
    { q: 'What services does Vedant provide?', a: 'Speciality, super-speciality, surgical, diagnostic, emergency and critical-care services.' },
    { q: 'Is the hospital open 24 hours?', a: 'Yes. The hospital is open 24 hours.' },
    { q: 'Does the hospital provide emergency services?', a: 'Yes. Accident, Trauma & Emergency Services and a Casualty Department are available.' },
    { q: 'Does the hospital provide cashless treatment?', a: 'Yes, through 13+ insurance companies and TPA partners, subject to policy coverage and approval.' },
    { q: 'What diagnostic services are available?', a: 'Pathology, Digital X-Ray, CT Scan, Ultrasonography, ECG, 2D Echo Colour Doppler, Stress Test and Endoscopy.' },
    { q: 'How can I book an appointment?', a: 'Use the form on this page or call +91 93250 39914.' },
  ];

  return (
    <div ref={ref}>
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-5">Contact Us</h1>
          <p className="text-white/70 max-w-xl mx-auto text-lg">For appointments, medical services, diagnostics, insurance assistance or hospital information.</p>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14">
          {/* Info */}
          <div className="reveal-left space-y-8">
            <div>
              <h2 className="font-serif text-2xl text-text mb-6">Get In Touch</h2>
              <div className="space-y-5">
                {[
                  { icon: 'location', label: 'Our Address', value: settings.address },
                  { icon: 'phone', label: 'Phone', value: settings.phone, href: `tel:${settings.phone}` },
                  { icon: 'emergency', label: 'Emergency', value: settings.emergencyContact, href: `tel:${settings.emergencyContact}` },
                  { icon: 'mail', label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
                  { icon: 'clock', label: 'Hospital Hours', value: settings.workingHours },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <div className="mt-0.5 flex items-center justify-center rounded-lg bg-primary-50 text-primary w-10 h-10">
                      <MedicalIcon name={item.icon as any} size={18} color={iconColor.navy} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div className="text-xs text-text-light uppercase tracking-wider mb-1">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-text font-medium hover:text-primary transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-text font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp */}
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
            )}

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-border h-56">
              <iframe
                title="Vedant Hospital Location"
                src="https://maps.google.com/maps?q=Vedant+Multispeciality+Hospital+Chinchwad&output=embed&z=15"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <div className="reveal-right">
            <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
              <h2 className="font-serif text-2xl text-text mb-6">Book an Appointment</h2>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="mb-4 flex justify-center">
                    <MedicalIcon name="check" size={32} color={iconColor.teal} strokeWidth={3} />
                  </div>
                  <h3 className="font-semibold text-text text-xl mb-2">Message Sent!</h3>
                  <p className="text-text-muted text-sm">We'll contact you shortly to confirm your appointment.</p>
                  <button onClick={() => { setStatus('idle'); setForm({ name: '', phone: '', email: '', message: '' }); }} className="mt-6 px-5 py-2.5 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Full Name *</label>
                    <input type="text" placeholder="Your name" className={inputClass('name')} maxLength={100} {...field('name')} />
                    {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Mobile Number *</label>
                    <input type="tel" placeholder="+91 XXXXX XXXXX" className={inputClass('phone')} maxLength={15} {...field('phone')} />
                    {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Email Address *</label>
                    <input type="email" placeholder="your@email.com" className={inputClass('email')} maxLength={150} {...field('email')} />
                    {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Message *</label>
                    <textarea placeholder="Describe your requirement or preferred appointment time..." className={`${inputClass('message')} resize-none h-32`} maxLength={500} {...field('message')} />
                    {errors.message && <p className="text-xs text-danger mt-1">{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Book Appointment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 reveal">
            <h2 className="font-serif text-3xl text-text">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="reveal bg-white border border-border rounded-xl overflow-hidden group"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <summary className="px-6 py-4 font-medium text-text cursor-pointer list-none flex items-center justify-between gap-4 hover:text-primary transition-colors">
                  {faq.q}
                  <svg className="w-4 h-4 shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="px-6 pb-5 text-sm text-text-muted leading-relaxed border-t border-border pt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
