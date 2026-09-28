import { Link } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MedicalIcon, getSpecialityIcon, iconColor } from '../components/MedicalIcons';

export default function Specialities() {
  const { specialities, doctors } = useHospital();
  const ref = useScrollReveal();

  const activeSpecialities = specialities.filter((s) => s.active).sort((a, b) => a.order - b.order);

  return (
    <div ref={ref}>
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1400&h=500&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-5">Clinical Specialities</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Advanced specialist care across multiple medical and surgical disciplines under one roof.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSpecialities.map((s, i) => {
              const relatedDoctors = doctors.filter((d) => d.active && d.department.toLowerCase().includes(s.name.split(' ')[0].toLowerCase())).slice(0, 3);
              return (
                <div
                  key={s.id}
                  className="reveal bg-white border border-border rounded-xl p-7 hover:shadow-md hover:border-primary/30 transition-all"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="mb-5 flex items-center justify-start">
                    <MedicalIcon name={getSpecialityIcon(s.name)} size={30} color={iconColor.teal} strokeWidth={2.2} />
                  </div>
                  <h2 className="font-serif text-xl text-text mb-3">{s.name}</h2>
                  <p className="text-sm text-text-muted leading-relaxed mb-5">{s.description}</p>
                  {relatedDoctors.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-text-light mb-2 uppercase tracking-wider">Specialists</p>
                      <div className="space-y-1.5">
                        {relatedDoctors.map((d) => (
                          <div key={d.id} className="text-sm text-text-muted">{d.name} <span className="text-text-light">— {d.qualification}</span></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-8 text-center reveal">
          <div>
            <div className="text-4xl font-serif mb-2">{activeSpecialities.length}+</div>
            <div className="text-white/70 text-sm">Clinical Specialities</div>
          </div>
          <div>
            <div className="text-4xl font-serif mb-2">{doctors.filter((d) => d.active).length}+</div>
            <div className="text-white/70 text-sm">Specialist Doctors</div>
          </div>
          <div>
            <div className="text-4xl font-serif mb-2">24/7</div>
            <div className="text-white/70 text-sm">Emergency Services</div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center reveal">
          <h2 className="font-serif text-2xl sm:text-3xl text-text mb-4">Need a Specialist Consultation?</h2>
          <div className="flex justify-center flex-wrap gap-4">
            <Link to="/contact" className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">Book Appointment</Link>
            <Link to="/doctors" className="px-6 py-3 border border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors">Meet Our Doctors</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
