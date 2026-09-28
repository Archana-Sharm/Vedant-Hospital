import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MedicalIcon } from '../components/MedicalIcons';

export default function About() {
  const ref = useScrollReveal();

  const facilities = [
    { icon: 'bed', label: 'ICU' }, { icon: 'bed', label: 'HDU' },
    { icon: 'hospital', label: 'Modular OTs' }, { icon: 'flask', label: 'Dialysis Centre' },
    { icon: 'flask', label: 'Pathology Lab' }, { icon: 'scan', label: 'Digital X-Ray' },
    { icon: 'scan', label: 'CT Scan' }, { icon: 'scan', label: 'Ultrasonography' },
    { icon: 'pulse', label: 'ECG' }, { icon: 'heart', label: '2D Echo Doppler' },
    { icon: 'dumbbell', label: 'Stress Test' }, { icon: 'scan', label: 'Endoscopy' },
    { icon: 'emergency', label: 'Casualty & Emergency' }, { icon: 'pill', label: '24-Hr Pharmacy' },
    { icon: 'ambulance', label: 'Ambulance Service' }, { icon: 'dumbbell', label: 'Physiotherapy' },
  ];

  const floors = [
    { floor: 'Basement', items: ['Nephroplus Dialysis Centre', 'X-Ray & CT Scan Department', 'Oxygen Plant', 'STP Plant', 'Biomedical Waste Storage'] },
    { floor: 'Ground Floor', items: ['Reception', 'OPD 1 to 5', 'Casualty Department', 'Physiotherapy', 'Sonography Department'] },
    { floor: 'First Floor', items: ['Accounts, Billing & Mediclaim', 'HR Department', 'Male General Ward', 'Female General Ward', 'Pathology Lab'] },
    { floor: 'Second Floor', items: ['ICU', 'HDU', 'Store Room', 'OT Complex', 'Endoscopy Room'] },
    { floor: 'Third Floor', items: ['Deluxe Room 1 & 2', 'Private Room 1 & 2', 'Semi-Private Room 1 to 6'] },
  ];

  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&h=600&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-5">About Us</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
            Vedant Multispeciality Hospital — comprehensive healthcare for families in Chinchwad and Pimpri-Chinchwad.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal-left">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4 block">Who We Are</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-text mb-6">Vedant Multispeciality Hospital</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              Vedant Multispeciality Hospital is a multispeciality healthcare facility located in Sambhajinagar, Chinchwad, Pimpri-Chinchwad, Maharashtra.
            </p>
            <p className="text-text-muted leading-relaxed mb-4">
              The hospital provides a wide range of medical, surgical, diagnostic, emergency and inpatient healthcare services. Our multidisciplinary healthcare setup brings together specialist medical departments, diagnostic facilities, emergency care, surgical services and supporting healthcare facilities to provide comprehensive healthcare under one roof.
            </p>
            <p className="text-text-muted leading-relaxed mb-8">
              Our approach focuses on accessible healthcare, specialist consultation, diagnostic support, emergency care, surgical treatment, inpatient care and patient-focused services.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-primary-50 rounded-xl p-5">
                <div className="font-serif text-xl text-primary mb-2">Our Vision</div>
                <p className="text-sm text-text-muted">To provide comprehensive, accessible and quality healthcare services with commitment to patient safety, clinical care and patient well-being.</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-5">
                <div className="font-serif text-xl text-primary mb-2">Our Mission</div>
                <p className="text-sm text-text-muted">To provide coordinated healthcare through experienced medical professionals, comprehensive hospital facilities and a patient-focused approach.</p>
              </div>
            </div>
          </div>
          <div className="reveal-right">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&h=600&fit=crop&auto=format"
              alt="Hospital interior"
              className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">Infrastructure</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-text">Hospital Facilities</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {facilities.map((f, i) => (
              <div key={f.label} className="reveal bg-white rounded-xl p-5 text-center hover:shadow-md transition-shadow" style={{ transitionDelay: `${i * 40}ms` }}>
                <div className="mb-3 flex justify-center">
                  <MedicalIcon name={f.icon as any} size={30} className="text-primary" strokeWidth={2.2} />
                </div>
                <div className="text-sm font-semibold text-text">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floor Directory */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">Navigate</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-text">Floor Directory</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {floors.map((f, i) => (
              <div key={f.floor} className="reveal bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center">{i}</div>
                  <h3 className="font-semibold text-text">{f.floor}</h3>
                </div>
                <ul className="space-y-2">
                  {f.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="text-primary mt-0.5">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cashless */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal">
            <h2 className="font-serif text-3xl sm:text-4xl mb-4">Cashless Facility</h2>
            <p className="text-white/70 max-w-xl mx-auto">Cashless treatment support through leading Insurance Companies and TPA Partners.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-10 reveal">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-white/80 uppercase tracking-wider text-sm">Insurance Companies</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Bajaj Allianz', 'ICICI Lombard', 'ManipalCigna', 'HDFC ERGO', 'National Insurance', 'Reliance General', 'Star Health', 'SBI General', 'New India Assurance', 'Oriental Insurance', 'United India', 'Go Digit'].map((name) => (
                  <div key={name} className="bg-white/10 rounded-lg px-3 py-2 text-sm text-white/80">{name}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-4 text-white/80 uppercase tracking-wider">TPA Partners</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Medi Assist', 'MD India Health', 'Paramount Health', 'Heritage Health', 'Family Health Plan', 'Raksha Health', 'Vidal Health', 'East West Assist', 'Medsave Health', 'Gennis India', 'Health India', 'Safeway India'].map((name) => (
                  <div key={name} className="bg-white/10 rounded-lg px-3 py-2 text-sm text-white/80">{name}</div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-white/50 text-sm mt-8 reveal">
            Cashless treatment is subject to policy coverage, eligibility, pre-authorisation and insurer/TPA approval.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center reveal">
          <h2 className="font-serif text-3xl text-text mb-4">Ready to Book a Consultation?</h2>
          <p className="text-text-muted mb-8">Our team is available to assist with appointments, specialist referrals and general enquiries.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
            Book an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
