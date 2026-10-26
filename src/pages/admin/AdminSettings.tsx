import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

const API_URL = 'http://localhost:5000/api/settings';

interface Settings {
  name: string;
  tagline: string;
  phone: string;
  alternatePhone: string;
  emergencyContact: string;
  whatsapp: string;
  email: string;
  workingHours: string;
  address: string;
  mapsLink: string;
  facebook: string;
  instagram: string;
  youtube: string;
  logo: string;
}

interface SettingField {
  label: string;
  key: keyof Settings;
  placeholder: string;
  textarea?: boolean;
}

const emptySettings: Settings = {
  name: '',
  tagline: '',
  phone: '',
  alternatePhone: '',
  emergencyContact: '',
  whatsapp: '',
  email: '',
  workingHours: '',
  address: '',
  mapsLink: '',
  facebook: '',
  instagram: '',
  youtube: '',
  logo: '',
};

export default function AdminSettings() {
  const [form, setForm] = useState<Settings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // =========================
  // LOAD SETTINGS
  // =========================
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await response.json();

        setForm({
          name: data.name || '',
          tagline: data.tagline || '',
          phone: data.phone || '',
          alternatePhone: data.alternatePhone || '',
          emergencyContact: data.emergencyContact || '',
          whatsapp: data.whatsapp || '',
          email: data.email || '',
          workingHours: data.workingHours || '',
          address: data.address || '',
          mapsLink: data.mapsLink || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          youtube: data.youtube || '',
          logo: data.logo || '',
        });
      } catch (error) {
        console.error('Failed to load settings:', error);

        alert(
          'Unable to load hospital settings. Please make sure the backend is running.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // =========================
  // LOGO UPLOAD
  // =========================
  const handleLogoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please select a logo smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      if (typeof imageData === 'string') {
        setForm((previous) => ({
          ...previous,
          logo: imageData,
        }));
      }
    };

    reader.onerror = () => {
      alert('Unable to read the selected logo.');
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // REMOVE LOGO
  // =========================
  const removeLogo = () => {
    setForm((previous) => ({
      ...previous,
      logo: '',
    }));
  };

  // =========================
  // SAVE SETTINGS
  // =========================
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setSaved(false);

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const data = await response.json();

      setForm({
        name: data.name || '',
        tagline: data.tagline || '',
        phone: data.phone || '',
        alternatePhone: data.alternatePhone || '',
        emergencyContact: data.emergencyContact || '',
        whatsapp: data.whatsapp || '',
        email: data.email || '',
        workingHours: data.workingHours || '',
        address: data.address || '',
        mapsLink: data.mapsLink || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        youtube: data.youtube || '',
        logo: data.logo || '',
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);

      alert(
        'Unable to save settings. Please make sure the backend is running.'
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // FIELD HELPER
  // =========================
  const field = (key: keyof Settings) => ({
    value: form[key],

    onChange: (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm((previous) => ({
        ...previous,
        [key]: event.target.value,
      }));
    },
  });

  // =========================
  // SETTINGS SECTIONS
  // =========================
  const sections: {
    title: string;
    fields: SettingField[];
  }[] = [
    {
      title: 'Hospital Identity',
      fields: [
        {
          label: 'Hospital Name',
          key: 'name',
          placeholder: 'Vedant Multispeciality Hospital',
        },
        {
          label: 'Tagline',
          key: 'tagline',
          placeholder: 'Comprehensive Healthcare...',
        },
      ],
    },

    {
      title: 'Contact Information',
      fields: [
        {
          label: 'Primary Phone',
          key: 'phone',
          placeholder: '+91 93250 39914',
        },
        {
          label: 'Alternate Phone',
          key: 'alternatePhone',
          placeholder: '+91 XXXXX XXXXX',
        },
        {
          label: 'Emergency Contact',
          key: 'emergencyContact',
          placeholder: '+91 93250 39914',
        },
        {
          label: 'WhatsApp Number',
          key: 'whatsapp',
          placeholder: '+919325039914',
        },
        {
          label: 'Email',
          key: 'email',
          placeholder: 'info@vedanthospital.com',
        },
        {
          label: 'Working Hours',
          key: 'workingHours',
          placeholder: 'Open 24 Hours',
        },
      ],
    },

    {
      title: 'Location',
      fields: [
        {
          label: 'Address',
          key: 'address',
          placeholder: 'MQ6W+299, Sambhajinagar...',
          textarea: true,
        },
        {
          label: 'Google Maps Link',
          key: 'mapsLink',
          placeholder: 'https://maps.google.com/...',
        },
      ],
    },

    {
      title: 'Social Media',
      fields: [
        {
          label: 'Facebook URL',
          key: 'facebook',
          placeholder: 'https://facebook.com/...',
        },
        {
          label: 'Instagram URL',
          key: 'instagram',
          placeholder: 'https://instagram.com/...',
        },
        {
          label: 'YouTube URL',
          key: 'youtube',
          placeholder: 'https://youtube.com/...',
        },
      ],
    },
  ];

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-xl font-semibold text-text">
            Hospital Settings
          </h1>

          <p className="text-sm text-text-muted mt-1">
            Loading hospital settings...
          </p>
        </div>

        <div className="bg-white border border-border rounded-xl p-6">
          <div className="text-sm text-text-muted">
            Please wait...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-text">
          Hospital Settings
        </h1>

        <p className="text-sm text-text-muted mt-1">
          Manage your hospital information, contact details,
          location and social media links.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* LOGO */}
        <div className="bg-white border border-border rounded-xl p-6">

          <h2 className="font-semibold text-text mb-1">
            Hospital Logo
          </h2>

          <p className="text-xs text-text-muted mb-4">
            Upload a PNG, JPG or WEBP image. Maximum size: 2 MB.
          </p>

          {form.logo ? (
            <div className="space-y-4">

              <div className="w-full h-32 bg-muted border border-border rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={form.logo}
                  alt="Hospital logo"
                  className="max-h-24 max-w-[220px] object-contain"
                />
              </div>

              <div className="flex gap-2">

                <label className="flex-1 cursor-pointer">
                  <div className="w-full px-4 py-2.5 text-center text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">
                    Change Logo
                  </div>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={removeLogo}
                  className="px-4 py-2.5 text-sm text-danger border border-danger rounded-lg hover:bg-danger/10 transition-colors"
                >
                  Remove
                </button>

              </div>
            </div>
          ) : (
            <label className="block cursor-pointer">

              <div className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-primary transition-colors">

                <MedicalIcon
                  name="image"
                  size={30}
                  color={iconColor.muted}
                  strokeWidth={2}
                />

                <span className="text-sm font-medium text-text mt-2">
                  Upload Hospital Logo
                </span>

                <span className="text-xs text-text-muted mt-1">
                  PNG, JPG or WEBP · Max 2 MB
                </span>

              </div>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoChange}
                className="hidden"
              />

            </label>
          )}

        </div>

        {/* OTHER SETTINGS */}
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white border border-border rounded-xl p-6"
          >

            <h2 className="font-semibold text-text mb-5 pb-3 border-b border-border">
              {section.title}
            </h2>

            <div className="space-y-4">

              {section.fields.map((f) => (
                <div key={f.key}>

                  <label className="block text-sm font-medium text-text mb-1.5">
                    {f.label}
                  </label>

                  {f.textarea ? (
                    <textarea
                      {...field(f.key)}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-20"
                    />
                  ) : (
                    <input
                      type="text"
                      {...field(f.key)}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  )}

                </div>
              ))}

            </div>
          </div>
        ))}

        {/* SAVE */}
        <div className="flex items-center gap-4">

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>

          {saved && (
            <span className="text-success text-sm font-medium flex items-center gap-1.5">

              <MedicalIcon
                name="check"
                size={14}
                color={iconColor.teal}
                strokeWidth={2.5}
              />

              Settings saved successfully

            </span>
          )}

        </div>

      </form>
    </div>
  );
}