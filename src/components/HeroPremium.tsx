import { Link } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import { MedicalIcon, iconColor } from './MedicalIcons';

const STATS = [
  { value: '25+', label: 'Years of\nTrusted Care', icon: 'shield' },
  { value: '50+', label: 'Specialist\nDoctors', icon: 'doctor' },
  { value: '24/7', label: 'Emergency\nServices', icon: 'emergency' },
];

export default function HeroPremium() {
  const { settings, banners } = useHospital();

  const activeBanners = banners
    .filter((banner) => banner.active)
    .sort((a, b) => a.order - b.order);

  const banner = activeBanners[0];

  const heroTitle = 'Advanced Healthcare. Closer to You.';
  const heroSubtitle =
    banner?.subtitle ||
    'Comprehensive multispeciality care delivered by experienced doctors, advanced diagnostics, and a team that puts your well-being first.';

  const heroImage =
    banner?.image ||
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=900&fit=crop&auto=format&q=85';

  const buttonText =
  banner?.buttonText || 'Book an Appointment';

const buttonLink =
  banner?.buttonLink || '/contact';

  return (
    <section
      className="relative min-h-[700px] sm:min-h-[760px] lg:min-h-[820px] overflow-hidden flex items-center"
      style={{
        background:
          'linear-gradient(135deg, #060D1F 0%, #0B1A2E 50%, #0A1628 100%)',
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.045]">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hero-dots"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="15"
                cy="15"
                r="1.2"
                fill="white"
              />
            </pattern>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="url(#hero-dots)"
          />
        </svg>
      </div>

      {/* Glow effects */}
      <div
        className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(6,182,212,0.12) 0%, transparent 70%)',
          transform: 'translate(-30%, -30%)',
        }}
      />

      <div
        className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(14,89,115,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Hero image */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] z-0">
        <div className="absolute inset-0 bg-[#060D1F]/75 lg:hidden z-10" />

        <img
          src={heroImage}
          alt={heroTitle}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />

        {/* Desktop image gradient */}
        <div
          className="hidden lg:block absolute inset-y-0 left-0 w-[52%] z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #060D1F 0%, #060D1F 30%, rgba(6,13,31,0.92) 55%, rgba(6,13,31,0.4) 80%, transparent 100%)',
          }}
        />

        {/* Top gradient */}
        <div
          className="absolute inset-x-0 top-0 h-28 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(6,13,31,0.55), transparent)',
          }}
        />

        {/* Bottom gradient */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(6,13,31,0.6), transparent)',
          }}
        />

        {/* Stats card */}
        <div className="hidden lg:block absolute bottom-12 right-10 z-20 w-64">
          <div
            className="rounded-2xl p-5 shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow:
                '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Hospital Excellence
              </span>
            </div>

            <div className="space-y-4">
              {STATS.map((s) => (
                <div
                  key={s.value}
                  className="flex items-center gap-3.5"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{
                      background:
                        'rgba(6,182,212,0.12)',
                      border:
                        '1px solid rgba(6,182,212,0.2)',
                    }}
                  >
                    <MedicalIcon
                      name={s.icon as any}
                      size={18}
                      color={iconColor.white}
                      strokeWidth={2.2}
                    />
                  </div>

                  <div>
                    <div
                      className="text-xl font-bold leading-none mb-0.5"
                      style={{
                        fontFamily: 'var(--font-serif)',
                        color: '#ffffff',
                      }}
                    >
                      {s.value}
                    </div>

                    <div className="text-[11px] text-white/50 leading-tight whitespace-pre-line">
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointment card */}
        <div className="hidden lg:block absolute top-14 right-14 z-20">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border:
                '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/20 border border-[#06B6D4]/30 flex items-center justify-center text-sm">
              <MedicalIcon
                name="appointment"
                size={16}
                color={iconColor.white}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <div className="text-[11px] text-white/45 leading-none mb-0.5">
                Next Available
              </div>

              <div className="text-xs font-semibold text-white">
                Book Today
              </div>
            </div>

            <Link
              to="/contact"
              className="ml-1 px-3 py-1.5 bg-[#06B6D4] text-white text-[11px] font-semibold rounded-lg hover:bg-[#0891B2] transition-colors"
            >
              Reserve
            </Link>
          </div>
        </div>
      </div>

      {/* Curved divider */}
      <div
        className="hidden lg:block absolute inset-y-0 pointer-events-none"
        style={{
          left: 'calc(38% - 64px)',
          width: '140px',
          zIndex: 15,
        }}
      >
        <svg
          viewBox="0 0 140 820"
          preserveAspectRatio="none"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M140,0 C100,0 65,60 42,180 C22,290 16,390 28,510 C44,650 90,740 140,820 L0,820 L0,0 Z"
            fill="#060D1F"
          />
        </svg>
      </div>

      {/* Hero content */}
      <div
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-28 lg:py-0"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-xl lg:max-w-[50%]">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-[#06B6D4]" />

            <span
              className="text-[10.5px] font-semibold tracking-[0.22em] uppercase"
              style={{
                color: '#06B6D4',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Compassionate Care · Advanced Technology
            </span>
          </div>

          {/* Dynamic MongoDB title */}
          <h1
            className="text-5xl sm:text-6xl lg:text-[68px] text-white leading-[1.04] mb-7"
            style={{
              fontFamily: 'var(--font-serif)',
              letterSpacing: '-0.01em',
            }}
          >
            {heroTitle}
          </h1>

          {/* Dynamic MongoDB subtitle */}
          <p
            className="text-[17px] leading-[1.75] mb-10 max-w-[420px]"
            style={{
              color: 'rgba(255,255,255,0.62)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {heroSubtitle}
          </p>

          {/* Dynamic MongoDB CTA */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-8">
            <Link
              to={buttonLink}
              className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 font-semibold rounded-xl text-white text-[15px] transition-all duration-200"
              style={{
                background:
                  'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                boxShadow:
                  '0 4px 24px rgba(6,182,212,0.3)',
              }}
              onMouseEnter={(e) => {
                (
                  e.currentTarget as HTMLElement
                ).style.boxShadow =
                  '0 8px 32px rgba(6,182,212,0.45)';

                (
                  e.currentTarget as HTMLElement
                ).style.transform =
                  'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (
                  e.currentTarget as HTMLElement
                ).style.boxShadow =
                  '0 4px 24px rgba(6,182,212,0.3)';

                (
                  e.currentTarget as HTMLElement
                ).style.transform =
                  'translateY(0)';
              }}
            >
              {buttonText}

              <MedicalIcon
                name="arrow-right"
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                color={iconColor.white}
                strokeWidth={2.2}
              />
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 font-medium rounded-xl text-white text-[15px] transition-all duration-200 hover:bg-white/15"
              style={{
                background:
                  'rgba(255,255,255,0.08)',
                border:
                  '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Explore Our Services
            </Link>
          </div>

          {/* Emergency */}
          <div
            className="inline-flex max-w-full items-center gap-3 rounded-2xl px-4 sm:px-5 py-3.5 mb-8 sm:mb-10"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border:
                '1px solid rgba(239,68,68,0.25)',
            }}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                style={{ background: '#EF4444' }}
              />

              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ background: '#EF4444' }}
              />
            </span>

            <span
              className="text-sm font-semibold"
              style={{
                color: '#FCA5A5',
                letterSpacing: '0.01em',
              }}
            >
              24/7 Emergency Care
            </span>

            <div
              className="w-px h-4"
              style={{
                background:
                  'rgba(255,255,255,0.15)',
              }}
            />

            <a
              href={`tel:${settings.phone}`}
              className="text-sm font-semibold text-white/80 hover:text-white transition-colors truncate"
            >
              {settings.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};