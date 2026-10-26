import { useEffect, useState } from 'react';
import { type Doctor } from '../../data/initialData';
import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

const API_URL = 'http://localhost:5000/api/doctors';

const emptyDoctor = (): Omit<Doctor, 'id'> => ({
  name: '',
  mobile: '',
  qualification: '',
  specialization: '',
  experience: '',
  designation: '',
  department: '',
  timing: '',
  fees: '',
  description: '',
  photo: '',
  active: true,
  order: 1,
});

const FIELDS: Array<{
  label: string;
  key: keyof Omit<Doctor, 'id'>;
  type?: string;
  placeholder: string;
}> = [
  {
    label: 'Full Name *',
    key: 'name',
    placeholder: 'Dr. Name',
  },
  { label: 'Mobile Number', 
    key: 'mobile', 
    type: 'tel', 
    placeholder: '+91 9876543210' 
  },
  {
    label: 'Qualification',
    key: 'qualification',
    placeholder: 'MD, MS, DM...',
  },
  {
    label: 'Specialization',
    key: 'specialization',
    placeholder: 'Cardiology, Neurology...',
  },
  {
    label: 'Department',
    key: 'department',
    placeholder: 'Cardiology',
  },
  {
    label: 'Designation',
    key: 'designation',
    placeholder: 'Consultant Cardiologist',
  },
  {
    label: 'Experience',
    key: 'experience',
    placeholder: '10+ years',
  },
  {
    label: 'Consultation Timing',
    key: 'timing',
    placeholder: 'Mon–Sat, 9am–1pm',
  },
  {
    label: 'Consultation Fee',
    key: 'fees',
    placeholder: '₹500',
  },
  {
    label: 'Display Order',
    key: 'order',
    type: 'number',
    placeholder: '1',
  },
  {
    label: 'Description',
    key: 'description',
    type: 'textarea',
    placeholder: 'Brief description of the doctor',
  },
];

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [modal, setModal] =
    useState<false | 'add' | Doctor>(false);

  const [form, setForm] =
    useState<Omit<Doctor, 'id'>>(emptyDoctor());

  const [deleteConfirm, setDeleteConfirm] =
    useState<string | null>(null);

  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // ===============================
  // LOAD DOCTORS FROM MONGODB
  // ===============================

  const loadDoctors = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to load doctors');
      }

      const data = await response.json();

      const formattedDoctors: Doctor[] = data.map(
        (doctor: any) => ({
          id: doctor._id,
          name: doctor.name || '',
          mobile: doctor.mobile || '',
          qualification: doctor.qualification || '',
          specialization: doctor.specialization || '',
          experience: doctor.experience || '',
          designation: doctor.designation || '',
          department: doctor.department || '',
          timing: doctor.timing || '',
          fees: doctor.fees || '',
          description: doctor.description || '',
          photo: doctor.photo || '',
          active:
            typeof doctor.active === 'boolean'
              ? doctor.active
              : true,
          order:
            typeof doctor.order === 'number'
              ? doctor.order
              : 1,
        })
      );

      setDoctors(formattedDoctors);
    } catch (error) {
      console.error('Failed to load doctors:', error);
      alert(
        'Unable to load doctors from the backend.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // ===============================
  // ADD DOCTOR
  // ===============================

  const addDoctor = async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error('Failed to add doctor');
    }

    return response.json();
  };

  // ===============================
  // UPDATE DOCTOR
  // ===============================

  const updateDoctor = async (
    id: string,
    doctor: Omit<Doctor, 'id'>
  ) => {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctor),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update doctor');
    }

    return response.json();
  };

  // ===============================
  // PHOTO UPLOAD
  // ===============================

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(
        'Please choose an image smaller than 2 MB.'
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      if (typeof imageData === 'string') {
        setForm({
          ...form,
          photo: imageData,
        });
      }
    };

    reader.onerror = () => {
      alert('Unable to read the selected image.');
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setForm({
      ...form,
      photo: '',
    });
  };

  // ===============================
  // OPEN ADD
  // ===============================

  const openAdd = () => {
    setForm(emptyDoctor());
    setModal('add');
  };

  // ===============================
  // OPEN EDIT
  // ===============================

  const openEdit = (doctor: Doctor) => {
    const { id, ...rest } = doctor;

    setForm(rest);
    setModal(doctor);
  };

  // ===============================
  // SAVE DOCTOR
  // ===============================

  const save = async () => {
    if (!form.name.trim()) {
      alert('Please enter the doctor name.');
      return;
    }

    try {
      setSaving(true);

      if (modal === 'add') {
        await addDoctor();

        alert('Doctor added successfully.');
      } else {
        await updateDoctor(
          (modal as Doctor).id,
          form
        );

        alert('Doctor updated successfully.');
      }

      await loadDoctors();

      setModal(false);
    } catch (error) {
      console.error(error);

      alert(
        'Unable to save doctor. Please make sure the backend is running.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // TOGGLE ACTIVE
  // ===============================

  const toggle = async (id: string) => {
    const doctor = doctors.find(
      (item) => item.id === id
    );

    if (!doctor) return;

    try {
      const { id: doctorId, ...doctorData } =
        doctor;

      await updateDoctor(doctorId, {
        ...doctorData,
        active: !doctor.active,
      });

      await loadDoctors();
    } catch (error) {
      console.error(error);

      alert(
        'Unable to change doctor status.'
      );
    }
  };

  // ===============================
  // DELETE DOCTOR
  // ===============================

  const remove = async (id: string) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to delete doctor'
        );
      }

      await loadDoctors();

      setDeleteConfirm(null);
    } catch (error) {
      console.error(error);

      alert(
        'Unable to delete doctor.'
      );
    }
  };

  // ===============================
  // SEARCH
  // ===============================

  const filtered = doctors
    .filter(
      (doctor) =>
        doctor.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        doctor.department
          .toLowerCase()
          .includes(search.toLowerCase())
    )
    .sort(
      (a, b) => a.order - b.order
    );

  // ===============================
  // UI
  // ===============================

  return (
    <div className="space-y-5">

      {/* PAGE HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <h1 className="text-xl font-semibold text-text">
          Doctors
        </h1>

        <div className="flex gap-3">

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search doctors..."
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary w-48"
          />

          <button
            onClick={openAdd}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
          >
            + Add Doctor
          </button>

        </div>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="bg-white border border-border rounded-xl p-12 text-center text-text-muted">
          Loading doctors...
        </div>
      )}

      {/* EMPTY STATE */}

      {!loading &&
        filtered.length === 0 && (
          <div className="bg-white border border-border rounded-xl p-12 text-center text-text-muted">
            No doctors found.
          </div>
        )}

      {/* DOCTORS LIST */}

      {!loading && filtered.length > 0 && (
        <div className="bg-white border border-border rounded-xl overflow-hidden">

          {filtered.map(
            (doctor, index) => (
              <div
                key={doctor.id}
                className={`flex items-center gap-4 p-4 ${
                  index !== 0
                    ? 'border-t border-border'
                    : ''
                }`}
              >

                <img
                  src={
                    doctor.photo ||
                    'https://via.placeholder.com/48'
                  }
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full object-cover object-top bg-muted shrink-0"
                />

                <div className="flex-1 min-w-0">

                  <div className="flex items-center gap-2">

                    <span className="font-medium text-text truncate">
                      {doctor.name}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                        doctor.active
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-text-muted'
                      }`}
                    >
                      {doctor.active
                        ? 'Active'
                        : 'Inactive'}
                    </span>

                  </div>

                  <p className="text-sm text-text-muted">
                    {doctor.specialization} ·{' '}
                    {doctor.department}
                  </p>

                  {doctor.timing && (
                    <p className="text-xs text-text-light">
                      {doctor.timing}
                    </p>
                  )}

                </div>

                <div className="flex gap-2 shrink-0">

                  <button
                    onClick={() =>
                      toggle(doctor.id)
                    }
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors hidden sm:block ${
                      doctor.active
                        ? 'border-warning text-warning hover:bg-warning/10'
                        : 'border-success text-success hover:bg-success/10'
                    }`}
                  >
                    {doctor.active
                      ? 'Disable'
                      : 'Enable'}
                  </button>

                  <button
                    onClick={() =>
                      openEdit(doctor)
                    }
                    className="px-2.5 py-1.5 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteConfirm(
                        doctor.id
                      )
                    }
                    className="px-2.5 py-1.5 text-xs font-medium text-danger border border-danger rounded-lg hover:bg-danger/10 transition-colors"
                  >
                    Del
                  </button>

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* ADD / EDIT MODAL */}

      {modal !== false && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* HEADER */}

            <div className="p-6 border-b border-border flex items-center justify-between">

              <h2 className="font-semibold text-text">
                {modal === 'add'
                  ? 'Add Doctor'
                  : 'Edit Doctor'}
              </h2>

              <button
                onClick={() =>
                  setModal(false)
                }
                className="p-1 rounded-md hover:bg-muted"
              >
                <MedicalIcon
                  name="x"
                  size={16}
                  color={iconColor.muted}
                  strokeWidth={2.2}
                />
              </button>

            </div>

            {/* FORM */}

            <div className="p-6 space-y-4">

              {/* DOCTOR PHOTO */}

              <div>

                <label className="block text-sm font-medium text-text mb-2">
                  Doctor Photo
                </label>

                <div className="flex items-center gap-4">

                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border border-border shrink-0">

                    {form.photo ? (
                      <img
                        src={form.photo}
                        alt="Doctor preview"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-text-muted text-center px-2">
                        No Photo
                      </div>
                    )}

                  </div>

                  <div className="flex-1">

                    <label className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-primary-dark transition-colors">

                      Choose Image

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={
                          handlePhotoChange
                        }
                        className="hidden"
                      />

                    </label>

                    <p className="text-xs text-text-light mt-2">
                      JPG, PNG or WebP · Maximum 2 MB
                    </p>

                    {form.photo && (
                      <button
                        type="button"
                        onClick={
                          removePhoto
                        }
                        className="text-xs text-danger mt-2 hover:underline"
                      >
                        Remove photo
                      </button>
                    )}

                  </div>

                </div>

              </div>

              {/* OTHER FIELDS */}

              {FIELDS.map((field) => (
                <div
                  key={
                    field.key as string
                  }
                >

                  <label className="block text-sm font-medium text-text mb-1.5">
                    {field.label}
                  </label>

                  {field.type ===
                  'textarea' ? (
                    <textarea
                      value={
                        form[
                          field.key
                        ] as string
                      }
                      onChange={(event) =>
                        setForm({
                          ...form,
                          [field.key]:
                            event.target
                              .value,
                        })
                      }
                      placeholder={
                        field.placeholder
                      }
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-24"
                    />
                  ) : (
                    <input
                      type={
                        field.type ??
                        'text'
                      }
                      value={
                        form[
                          field.key
                        ] as
                          | string
                          | number
                      }
                      onChange={(event) =>
                        setForm({
                          ...form,
                          [field.key]:
                            field.type ===
                            'number'
                              ? Number(
                                  event
                                    .target
                                    .value
                                )
                              : event
                                  .target
                                  .value,
                        })
                      }
                      placeholder={
                        field.placeholder
                      }
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  )}

                </div>
              ))}

              {/* ACTIVE */}

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={
                    form.active
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      active:
                        event.target
                          .checked,
                    })
                  }
                  className="w-4 h-4 accent-primary"
                />

                <span className="text-sm font-medium text-text">
                  Active (visible on website)
                </span>

              </label>

            </div>

            {/* FOOTER */}

            <div className="p-6 border-t border-border flex gap-3 justify-end">

              <button
                onClick={() =>
                  setModal(false)
                }
                className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={save}
                disabled={saving}
                className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving
                  ? 'Saving...'
                  : 'Save Doctor'}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* DELETE CONFIRMATION */}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">

            <h3 className="font-semibold text-text mb-2">
              Delete Doctor?
            </h3>

            <p className="text-sm text-text-muted mb-5">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setDeleteConfirm(
                    null
                  )
                }
                className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-muted"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  remove(
                    deleteConfirm
                  )
                }
                className="flex-1 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-red-600"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}