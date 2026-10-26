import { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Link } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  designation: string;
  department: string;
  timing: string;
  fees: string;
  description: string;
  photo: string;
  active: boolean;
  order: number;
}

const API_URL = 'http://localhost:5000/api/doctors';

export default function Doctors() {
  const ref = useScrollReveal();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==========================================
  // FETCH DOCTORS FROM MONGODB
  // ==========================================

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();

        const formattedDoctors = data.map((doctor: any) => ({
          id: doctor._id,
          name: doctor.name || '',
          qualification: doctor.qualification || '',
          specialization: doctor.specialization || '',
          experience: doctor.experience || '',
          designation: doctor.designation || '',
          department: doctor.department || '',
          timing: doctor.timing || '',
          fees: doctor.fees || '',
          description: doctor.description || '',
          photo: doctor.photo || '',
          active: doctor.active ?? true,
          order: doctor.order ?? 1,
        }));

        setDoctors(formattedDoctors);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setError('Unable to load doctors at the moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // ==========================================
  // ACTIVE DOCTORS
  // ==========================================

  const activeDoctors = doctors
    .filter((d) => d.active)
    .sort((a, b) => a.order - b.order);

  // ==========================================
  // DEPARTMENTS
  // ==========================================

  const departments = [
    'all',
    ...Array.from(
      new Set(
        activeDoctors
          .map((d) => d.department)
          .filter((department) => department.trim() !== '')
      )
    ),
  ];

  // ==========================================
  // FILTERED DOCTORS
  // ==========================================

  const filtered =
    filter === 'all'
      ? activeDoctors
      : activeDoctors.filter((d) => d.department === filter);

  const selectedDoctor = activeDoctors.find(
    (d) => d.id === selected
  );

  return (
    <div ref={ref}>

      {/* ==========================================
          HERO
      ========================================== */}

      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&h=500&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-5">
            Our Doctors
          </h1>

          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Specialist doctors across a wide range of medical and surgical departments.
          </p>
        </div>
      </section>

      {/* ==========================================
          DOCTORS SECTION
      ========================================== */}

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Loading */}

          {loading && (
            <div className="text-center py-12">
              <p className="text-text-muted">
                Loading doctors...
              </p>
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="text-center py-12">
              <p className="text-red-500">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Department Filter */}

              {departments.length > 1 && (
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
                      {dept === 'all'
                        ? 'All Departments'
                        : dept}
                    </button>
                  ))}
                </div>
              )}

              {/* Doctors Grid */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {filtered.map((d, i) => (
                  <div
                    key={d.id}
                    className="reveal bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                    style={{
                      transitionDelay: `${i * 60}ms`,
                    }}
                    onClick={() => setSelected(d.id)}
                  >

                    {/* Doctor Image */}

                    <div className="h-52 bg-primary-50 overflow-hidden">

                      {d.photo ? (
                        <img
                          src={d.photo}
                          alt={d.name}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/40">
                          <svg
                            className="w-20 h-20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}

                    </div>

                    {/* Doctor Information */}

                    <div className="p-5">

                      {d.department && (
                        <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">
                          {d.department}
                        </div>
                      )}

                      <h3 className="font-semibold text-text text-lg leading-snug mb-0.5">
                        {d.name}
                      </h3>

                      <p className="text-sm text-text-muted">
                        {d.qualification}
                      </p>

                      {d.specialization && (
                        <p className="text-sm text-text-muted">
                          {d.specialization}
                        </p>
                      )}

                      {d.experience && (
                        <p className="text-xs text-text-light mt-2">
                          {d.experience} experience
                        </p>
                      )}

                      <button
                        className="mt-4 w-full py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(d.id);
                        }}
                      >
                        View Profile
                      </button>

                    </div>
                  </div>
                ))}

              </div>

              {/* No Doctors */}

              {filtered.length === 0 && (
                <p className="text-center text-text-muted py-12">
                  No doctors found.
                </p>
              )}
            </>
          )}

        </div>
      </section>

      {/* ==========================================
          DOCTOR MODAL
      ========================================== */}

      {selectedDoctor && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >

          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Doctor Image */}

            <div className="relative">

              {selectedDoctor.photo ? (
                <img
                  src={selectedDoctor.photo}
                  alt={selectedDoctor.name}
                  className="w-full h-64 object-cover object-top rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-64 bg-primary-50 flex items-center justify-center rounded-t-2xl">
                  <svg
                    className="w-24 h-24 text-primary/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

            </div>

            {/* Doctor Details */}

            <div className="p-6">

              {selectedDoctor.department && (
                <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-2">
                  {selectedDoctor.department}
                </div>
              )}

              <h2 className="font-serif text-2xl text-text mb-1">
                {selectedDoctor.name}
              </h2>

              <p className="text-text-muted mb-4">
                {selectedDoctor.qualification}

                {selectedDoctor.specialization && (
                  <> · {selectedDoctor.specialization}</>
                )}
              </p>

              {selectedDoctor.description && (
                <p className="text-sm text-text-muted leading-relaxed mb-5">
                  {selectedDoctor.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">

                {selectedDoctor.experience && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-text-light mb-1">
                      Experience
                    </div>

                    <div className="font-medium text-text">
                      {selectedDoctor.experience}
                    </div>
                  </div>
                )}

                {selectedDoctor.designation && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-text-light mb-1">
                      Designation
                    </div>

                    <div className="font-medium text-text">
                      {selectedDoctor.designation}
                    </div>
                  </div>
                )}

                {selectedDoctor.timing && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-text-light mb-1">
                      Consultation Timing
                    </div>

                    <div className="font-medium text-text">
                      {selectedDoctor.timing}
                    </div>
                  </div>
                )}

                {selectedDoctor.fees && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-text-light mb-1">
                      Consultation Fee
                    </div>

                    <div className="font-medium text-text">
                      {selectedDoctor.fees}
                    </div>
                  </div>
                )}

              </div>

              <Link
                to="/contact"
                onClick={() => setSelected(null)}
                className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Book Appointment
              </Link>

            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          BOOK CONSULTATION
      ========================================== */}

      <section className="py-14 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center reveal">

          <h2 className="font-serif text-2xl sm:text-3xl text-text mb-4">
            Book a Consultation
          </h2>

          <p className="text-text-muted mb-6 max-w-lg mx-auto">
            Contact us to schedule an appointment with any of our specialists.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Book Appointment
          </Link>

        </div>
      </section>

    </div>
  );
}