import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MedicalIcon, getServiceIcon, iconColor } from '../components/MedicalIcons';

export default function Services() {
  const { services } = useHospital();
  const ref = useScrollReveal();
  const [filter, setFilter] = useState<string>('all');

  const activeServices = services.filter((s) => s.active).sort((a, b) => a.order - b.order);
  const categories = ['all', ...Array.from(new Set(activeServices.map((s) => s.category)))];
  const filtered = filter === 'all' ? activeServices : activeServices.filter((s) => s.category === filter);

  return (
    <div ref={ref}>
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1400&h=500&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-5">Our Services</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Comprehensive medical and healthcare services across speciality, super-speciality, surgical, diagnostic and emergency care.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center reveal">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors capitalize ${
                  filter === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text-muted border-border hover:border-primary hover:text-primary'
                }`}
              >
                {cat === 'all' ? 'All Services' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s, i) => (
              <div
                key={s.id}
                className="reveal bg-white border border-border rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition-all"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="mb-5 flex items-center justify-start">
                  <MedicalIcon name={getServiceIcon(s.name)} size={32} color={iconColor.teal} strokeWidth={2.2} />
                </div>
                <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-2">{s.category}</div>
                <h3 className="font-semibold text-text text-lg mb-2">{s.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency banner */}
      <section className="py-14 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 reveal">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">Medical Emergency?</h2>
            <p className="text-white/80">Our casualty department and ICU are available 24/7.</p>
          </div>
          <a href="tel:+919325039914" className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-white text-accent font-bold rounded-xl hover:bg-white/90 transition-colors text-lg">
            <MedicalIcon name="phone" size={18} color={iconColor.teal} strokeWidth={2.2} />
            +91 93250 39914
          </a>
        </div>
      </section>
    </div>
  );
}
