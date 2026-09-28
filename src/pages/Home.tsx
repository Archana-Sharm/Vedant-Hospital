import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import HeroPremium from '../components/HeroPremium';
import { MedicalIcon, getServiceIcon, getSpecialityIcon, iconColor } from '../components/MedicalIcons';
import { BrandIcon } from '../components/BrandIcons';

function HeroSlider() {
  const { banners } = useHospital();
  const active = banners.filter((b) => b.active).sort((a, b) => a.order - b.order);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (active.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % active.length), 6000);
    return () => clearInterval(id);
  }, [active.length]);

  if (!active.length) return (
    <div className="relative min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center text-white px-6">
        <h1 className="font-serif text-5xl mb-4">Vedant Multispeciality Hospital</h1>
        <p className="text-white/80 text-lg">Comprehensive Healthcare. Compassionate Care.</p>
      </div>
    </div>
  );

  const slide = active[idx];

  return (
    <div className="relative min-h-screen overflow-hidden bg-primary-dark">
      {active.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={b.image}
            alt={b.title}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/60 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-32 w-full">
          <div className="max-w-2xl">
            <span className="inline-block mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-accent border border-accent/40 rounded-full px-3 py-1">
              Pimpri-Chinchwad · Maharashtra
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              {slide.title}
            </h1>
            <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={slide.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors"
              >
                {slide.ctaText}
                <MedicalIcon name="arrow-right" size={16} color={iconColor.white} strokeWidth={2.2} />
              </Link>
              <a
                href="tel:+919325039914"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                <MedicalIcon name="phone" size={16} color={iconColor.white} strokeWidth={2.2} />
                Emergency 24/7
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {active.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`rounded-full transition-all ${i === idx ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCounter({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const steps = 60;
        const step = end / steps;
        let current = 0;
        const interval = setInterval(() => {
          current = Math.min(current + step, end);
          setCount(Math.floor(current));
          if (current >= end) clearInterval(interval);
        }, duration / steps);
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-serif text-white mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm text-white/60 uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function Home() {
  const { services, doctors, specialities, socialPosts, settings } = useHospital();
  const ref = useScrollReveal();
  const [socialTab, setSocialTab] = useState<'all' | 'facebook' | 'instagram' | 'youtube'>('all');

  const activeServices = services.filter((s) => s.active).sort((a, b) => a.order - b.order).slice(0, 8);
  const activeDoctors = doctors.filter((d) => d.active).sort((a, b) => a.order - b.order).slice(0, 6);
  const activeSpecialities = specialities.filter((s) => s.active).sort((a, b) => a.order - b.order);
  const filteredPosts = socialPosts.filter((p) => p.active && (socialTab === 'all' || p.platform === socialTab)).sort((a, b) => a.order - b.order);

  const platformLabel: Record<string, string> = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube' };
  const platformColor: Record<string, string> = { facebook: 'text-blue-600', instagram: 'text-pink-600', youtube: 'text-red-600' };
  const brandPlatforms = ['facebook', 'instagram', 'youtube'] as const;

  return (
    <div ref={ref}>
      <HeroPremium />

      {/* Stats */}
      <section className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
          <StatCounter end={15} label="Specialities" suffix="+" />
          <StatCounter end={20} label="Specialist Doctors" suffix="+" />
          <StatCounter end={24} label="Hour Emergency" suffix="/7" />
          <StatCounter end={13} label="Insurance Partners" suffix="+" />
        </div>
      </section>

      {/* About */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal-left">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4 block">About Us</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-text mb-6 leading-snug">
              Comprehensive Care<br />Under One Roof
            </h2>
            <p className="text-text-muted leading-relaxed mb-5">
              Vedant Multispeciality Hospital is a multispeciality healthcare facility located in Sambhajinagar, Chinchwad, Pimpri-Chinchwad, Maharashtra. The hospital provides a wide range of medical, surgical, diagnostic, emergency and inpatient healthcare services.
            </p>
            <p className="text-text-muted leading-relaxed mb-8">
              Our multidisciplinary healthcare setup brings together specialist medical departments, diagnostic facilities, emergency care, surgical services and supporting healthcare facilities to provide comprehensive healthcare under one roof.
            </p>
            <div className="flex gap-6 mb-8">
              <div>
                <div className="text-2xl font-serif text-primary font-semibold">Our Vision</div>
                <p className="text-sm text-text-muted mt-1">Comprehensive, accessible and quality healthcare with commitment to patient safety.</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <div className="text-2xl font-serif text-primary font-semibold">Our Mission</div>
                <p className="text-sm text-text-muted mt-1">Coordinated healthcare through experienced professionals and a patient-focused approach.</p>
              </div>
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
              Learn more about us
              <MedicalIcon name="arrow-right" size={16} color={iconColor.navy} strokeWidth={2.2} />
            </Link>
          </div>
          <div className="reveal-right relative">
            <img
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=700&fit=crop&auto=format"
              alt="Vedant Multispeciality Hospital"
              className="w-full h-[480px] object-cover rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-5 max-w-[200px]">
              <div className="text-3xl font-serif text-primary font-bold">24/7</div>
              <div className="text-sm text-text-muted mt-1">Emergency & Ambulance Services Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">What We Offer</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-text mb-4">Our Medical Services</h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Comprehensive medical and healthcare services for patients requiring consultation, diagnosis, treatment, surgery, emergency care and hospitalisation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeServices.map((s, i) => (
              <div
                key={s.id}
                className={`reveal bg-white rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition-all cursor-default`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-accent ring-1 ring-inset ring-primary/10">
                  <MedicalIcon name={getServiceIcon(s.name)} size={26} color={iconColor.teal} strokeWidth={2.1} />
                </div>
                <h3 className="font-semibold text-text mb-2 leading-snug">{s.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
              View All Services
              <MedicalIcon name="arrow-right" size={16} color={iconColor.navy} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>

      {/* Specialities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">Our Expertise</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-text mb-4">Clinical Specialities</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeSpecialities.map((s, i) => (
              <div
                key={s.id}
                className="reveal group bg-white border border-border rounded-xl p-5 hover:border-primary hover:shadow-md transition-all cursor-default"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-accent transition-colors group-hover:bg-primary group-hover:text-white">
                  <MedicalIcon name={getSpecialityIcon(s.name)} size={23} strokeWidth={2.1} />
                </div>
                <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors leading-snug">{s.name}</h3>
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4 reveal">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">Our Team</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-text">Expert Doctors &amp; Specialists</h2>
            </div>
            <Link to="/doctors" className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all shrink-0">
              View All Doctors
              <MedicalIcon name="arrow-right" size={16} color={iconColor.navy} strokeWidth={2.2} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeDoctors.map((d, i) => (
              <div
                key={d.id}
                className="reveal bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="h-56 bg-primary-50 overflow-hidden">
                  <img src={d.photo} alt={d.name} className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">{d.department}</div>
                  <h3 className="font-semibold text-text text-lg mb-0.5">{d.name}</h3>
                  <p className="text-sm text-text-muted mb-1">{d.qualification} · {d.specialization}</p>
                  <p className="text-xs text-text-light">{d.experience} experience</p>
                  {d.timing && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-xs text-text-muted">
                      <MedicalIcon name="clock" size={14} color={iconColor.muted} strokeWidth={2.2} />
                      {d.timing}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal-left">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4 block">Why Vedant</span>
            <h2 className="font-serif text-3xl sm:text-4xl mb-8 leading-snug">Trusted Healthcare<br />for Every Family</h2>
            <div className="space-y-5">
              {[
                { icon: 'hospital', title: 'Comprehensive Under One Roof', desc: 'Speciality, super-speciality, surgical, diagnostic and emergency care all at one location.' },
                { icon: 'doctor', title: 'Experienced Specialists', desc: 'Our panel of 20+ specialists brings clinical expertise across all major medical disciplines.' },
                { icon: 'emergency', title: '24/7 Emergency Services', desc: 'Casualty department, ICU, HDU, ambulance and specialist support available round the clock.' },
                { icon: 'shield', title: 'Cashless Insurance Support', desc: 'Empanelled with 13+ insurance companies and TPA partners for cashless treatment.' },
                { icon: 'scan', title: 'Advanced Diagnostics', desc: 'CT Scan, Digital X-Ray, Pathology Lab, Ultrasonography, ECG and Echo Doppler on-site.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="shrink-0 mt-0.5 flex items-center justify-center rounded-lg bg-white/10 w-10 h-10 border border-white/10">
                    <MedicalIcon name={item.icon as any} size={18} color={iconColor.white} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{item.title}</div>
                    <div className="text-sm text-white/70 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-right">
            <img
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=700&h=600&fit=crop&auto=format"
              alt="Hospital facilities"
              className="w-full h-[500px] object-cover rounded-2xl opacity-90"
            />
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">Stay Connected</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-text mb-4">Follow Our Latest Updates</h2>
            <p className="text-text-muted">Stay informed with health tips, hospital news and updates from Vedant.</p>
          </div>

          {/* Platform tabs */}
          <div className="flex justify-center gap-2 mb-10 reveal flex-wrap">
            {(['all', 'facebook', 'instagram', 'youtube'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSocialTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                  socialTab === tab
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text-muted border-border hover:border-primary hover:text-primary'
                }`}
              >
                {tab === 'all' ? (
                  'All'
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <BrandIcon name={tab} size={14} />
                    {platformLabel[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPosts.map((post, i) => (
              <a
                key={post.id}
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal group bg-white border border-border rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img src={post.thumbnail} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {post.platform === 'youtube' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <MedicalIcon name="arrow-right" size={18} color={iconColor.white} strokeWidth={2.2} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ${platformColor[post.platform]}`}>
                    <BrandIcon name={brandPlatforms.find((platform) => platform === post.platform) ?? 'facebook'} size={14} />
                    {platformLabel[post.platform]}
                  </div>
                  <p className="text-sm text-text leading-relaxed line-clamp-3">{post.caption}</p>
                  <p className="text-xs text-text-light mt-2">{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </a>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <p className="text-center text-text-muted py-12">No posts available.</p>
          )}

          <div className="flex justify-center gap-4 mt-10 reveal flex-wrap">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
                <BrandIcon name="facebook" size={17} />
                Follow on Facebook
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
                <BrandIcon name="instagram" size={17} />
                Follow on Instagram
              </a>
            )}
            {settings.youtube && (
              <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-[#FF0000] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
                <BrandIcon name="youtube" size={17} />
                Subscribe on YouTube
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center reveal">
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Need Medical Assistance?</h2>
          <p className="text-white/85 mb-8 max-w-lg mx-auto">Our emergency and casualty department is available 24 hours. Ambulance support is available.</p>
          <div className="flex justify-center flex-wrap gap-4">
            <a href={`tel:${settings.emergencyContact}`} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent font-bold rounded-xl text-lg hover:bg-white/90 transition-colors">
              <MedicalIcon name="phone" size={18} color={iconColor.teal} strokeWidth={2.2} />
              {settings.emergencyContact}
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/40 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors">
              <MedicalIcon name="appointment" size={18} color={iconColor.white} strokeWidth={2.2} />
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
