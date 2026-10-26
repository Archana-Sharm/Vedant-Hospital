import { useHospital } from '../../context/HospitalContext';
import { Link } from 'react-router-dom';

import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

export default function AdminDashboard() {
  const {
    banners,
    doctors,
    specialities,
    socialPosts,
    settings,
  } = useHospital();

  const stats = [
    {
      label: 'Total Doctors',
      value: doctors.length,
      active: doctors.filter((d) => d.active).length,
      to: '/admin/doctors',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Specialities',
      value: specialities.length,
      active: specialities.filter((s) => s.active).length,
      to: '/admin/specialities',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Active Banners',
      value: banners.filter((b) => b.active).length,
      active: banners.length,
      to: '/admin/banners',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Social Posts',
      value: socialPosts.length,
      active: socialPosts.filter((p) => p.active).length,
      to: '/admin/social',
      color: 'bg-pink-50 text-pink-600',
    },
  ];

  const quickActions = [
    {
      label: 'Add Doctor',
      to: '/admin/doctors',
      icon: 'doctor',
    },
    {
      label: 'Manage Banners',
      to: '/admin/banners',
      icon: 'image',
    },
    {
      label: 'Add Social Post',
      to: '/admin/social',
      icon: 'newspaper',
    },
    {
      label: 'Update Contact',
      to: '/admin/settings',
      icon: 'phone',
    },
    {
      label: 'View Website',
      to: '/',
      icon: 'globe',
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-semibold text-text">
          Dashboard
        </h1>

        <p className="text-text-muted text-sm mt-1">
          Welcome back. Here's an overview of your hospital content.
        </p>
      </div>

      {/* Hospital Info */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">

          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-serif text-xl font-bold">
            V
          </div>

          <div>
            <div className="font-semibold text-text">
              {settings.name}
            </div>

            <div className="text-sm text-text-muted">
              {settings.address}
            </div>
          </div>

        </div>

        <div className="flex flex-wrap gap-4 text-sm text-text-muted">

          <span className="inline-flex items-center gap-2">
            <MedicalIcon
              name="phone"
              size={14}
              color={iconColor.navy}
              strokeWidth={2.2}
            />

            {settings.phone}
          </span>

          <span className="inline-flex items-center gap-2">
            <MedicalIcon
              name="clock"
              size={14}
              color={iconColor.navy}
              strokeWidth={2.2}
            />

            {settings.workingHours}
          </span>

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="bg-white border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all"
          >

            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-3 ${s.color}`}
            >
              {s.label[0]}
            </div>

            <div className="text-2xl font-semibold text-text mb-0.5">
              {s.value}
            </div>

            <div className="text-xs text-text-muted">
              {s.label}
            </div>

            <div className="text-xs text-success mt-1">
              {s.active} active
            </div>

          </Link>
        ))}

      </div>

      {/* Quick Actions */}
      <div>

        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="bg-white border border-border rounded-xl p-4 text-center hover:shadow-md hover:border-primary/30 transition-all"
            >

              <div className="mb-2 flex justify-center">
                <MedicalIcon
                  name={a.icon as any}
                  size={22}
                  color={iconColor.teal}
                  strokeWidth={2.2}
                />
              </div>

              <div className="text-xs font-medium text-text">
                {a.label}
              </div>

            </Link>
          ))}

        </div>

      </div>

    </div>
  );
}
