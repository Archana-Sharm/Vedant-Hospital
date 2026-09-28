import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Link } from 'react-router-dom';

export default function Doctors() {
  const { doctors } = useHospital();
  const ref = useScrollReveal();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const activeDoctors = doctors.filter((d) => d.active).sort((a, b) => a.order - b.order);
  const departments = ['all', ...Array.from(new Set(activeDoctors.map((d) => d.department)))];
  const filtered = filter === 'all' ? activeDoctors : activeDoctors.filter((d) => d.department === filter);
  const selectedDoctor = activeDoctors.find((d) => d.id === selected);

  return (
    <div ref={ref}>
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&h=500&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-5">Our Doctors</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Specialist doctors across a wide range of medical and surgical departments.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Department filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center reveal">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                  filter === dept
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text-muted border-border hover:border-primary hover:text-primary'
                }`}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((d, i) => (
              <div
                key={d.id}
                className="reveal bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                style={{ transitionDelay: `${i * 60}ms` }}
                onClick={() => setSelected(d.id)}
              >
                <div className="h-52 bg-primary-50 overflow-hidden">
                  <img src={d.photo} alt={d.name} className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">{d.department}</div>
                  <h3 className="font-semibold text-text text-lg leading-snug mb-0.5">{d.name}</h3>
                  <p className="text-sm text-text-muted">{d.qualification}</p>
                  <p className="text-sm text-text-muted">{d.specialization}</p>
                  {d.experience && (
                    <p className="text-xs text-text-light mt-2">{d.experience} experience</p>
                  )}
                  <button className="mt-4 w-full py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-text-muted py-12">No doctors found.</p>
          )}
        </div>
      </section>

      {/* Doctor modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="w-full h-64 object-cover object-top rounded-t-2xl" />
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-2">{selectedDoctor.department}</div>
              <h2 className="font-serif text-2xl text-text mb-1">{selectedDoctor.name}</h2>
              <p className="text-text-muted mb-4">{selectedDoctor.qualification} · {selectedDoctor.specialization}</p>
              {selectedDoctor.description && <p className="text-sm text-text-muted leading-relaxed mb-5">{selectedDoctor.description}</p>}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedDoctor.experience && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-text-light mb-1">Experience</div>
                    <div className="font-medium text-text">{selectedDoctor.experience}</div>
                  </div>
                )}
                {selectedDoctor.designation && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-text-light mb-1">Designation</div>
                    <div className="font-medium text-text">{selectedDoctor.designation}</div>
                  </div>
                )}
                {selectedDoctor.timing && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-text-light mb-1">Consultation Timing</div>
                    <div className="font-medium text-text">{selectedDoctor.timing}</div>
                  </div>
                )}
                {selectedDoctor.fees && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-text-light mb-1">Consultation Fee</div>
                    <div className="font-medium text-text">{selectedDoctor.fees}</div>
                  </div>
                )}
              </div>
              <Link to="/contact" onClick={() => setSelected(null)} className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      )}

      <section className="py-14 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center reveal">
          <h2 className="font-serif text-2xl sm:text-3xl text-text mb-4">Book a Consultation</h2>
          <p className="text-text-muted mb-6 max-w-lg mx-auto">Contact us to schedule an appointment with any of our specialists.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
