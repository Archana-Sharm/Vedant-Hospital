import { useEffect, useState, type ChangeEvent } from 'react';
import { type Speciality } from '../../data/initialData';
import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

const API_URL = 'http://localhost:5000/api/specialities';

const empty = (): Omit<Speciality, 'id'> => ({
  name: '',
  description: '',
  icon: 'shield',
  image: '',
  active: true,
  order: 1,
});

export default function AdminSpecialities() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<false | 'add' | Speciality>(false);

  const [form, setForm] =
    useState<Omit<Speciality, 'id'>>(empty());

  const [deleteConfirm, setDeleteConfirm] =
    useState<string | null>(null);

  // --------------------------------
  // LOAD SPECIALITIES FROM MONGODB
  // --------------------------------
  useEffect(() => {
    const loadSpecialities = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch specialities');
        }

        const data = await response.json();

        const mappedSpecialities: Speciality[] = data.map(
          (speciality: any) => ({
            id: speciality._id,
            name: speciality.name,
            description: speciality.description || '',
            icon: speciality.icon || 'shield',
            image: speciality.image || '',
            active: speciality.active ?? true,
            order: speciality.order ?? 1,
          })
        );

        setSpecialities(mappedSpecialities);
      } catch (error) {
        console.error('Failed to load specialities:', error);
        alert('Unable to load specialities from the server.');
      } finally {
        setLoading(false);
      }
    };

    loadSpecialities();
  }, []);

  // --------------------------------
  // IMAGE UPLOAD
  // --------------------------------
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please select an image smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      if (typeof imageData === 'string') {
        setForm((previous) => ({
          ...previous,
          image: imageData,
        }));
      }
    };

    reader.onerror = () => {
      alert('Unable to read the selected image.');
    };

    reader.readAsDataURL(file);
  };

  // --------------------------------
  // REMOVE IMAGE
  // --------------------------------
  const removeImage = () => {
    setForm((previous) => ({
      ...previous,
      image: '',
    }));
  };

  // --------------------------------
  // SAVE
  // --------------------------------
  const save = async () => {
    if (!form.name.trim()) {
      alert('Please enter a speciality name.');
      return;
    }

    try {
      // ADD
      if (modal === 'add') {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error('Failed to add speciality');
        }

        const savedSpeciality = await response.json();

        const newSpeciality: Speciality = {
          id: savedSpeciality._id,
          name: savedSpeciality.name,
          description: savedSpeciality.description || '',
          icon: savedSpeciality.icon || 'shield',
          image: savedSpeciality.image || '',
          active: savedSpeciality.active ?? true,
          order: savedSpeciality.order ?? 1,
        };

        setSpecialities((previous) => [
          ...previous,
          newSpeciality,
        ]);
      }

      // EDIT
      else if (modal !== false) {
        const response = await fetch(
          `${API_URL}/${modal.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update speciality');
        }

        const updatedSpeciality = await response.json();

        const updated: Speciality = {
          id: updatedSpeciality._id,
          name: updatedSpeciality.name,
          description:
            updatedSpeciality.description || '',
          icon: updatedSpeciality.icon || 'shield',
          image: updatedSpeciality.image || '',
          active:
            updatedSpeciality.active ?? true,
          order:
            updatedSpeciality.order ?? 1,
        };

        setSpecialities((previous) =>
          previous.map((speciality) =>
            speciality.id === modal.id
              ? updated
              : speciality
          )
        );
      }

      setModal(false);
    } catch (error) {
      console.error('Failed to save speciality:', error);
      alert('Unable to save speciality.');
    }
  };

  // --------------------------------
  // ENABLE / DISABLE
  // --------------------------------
  const toggle = async (id: string) => {
    const speciality = specialities.find(
      (item) => item.id === id
    );

    if (!speciality) return;

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            active: !speciality.active,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedSpeciality = await response.json();

      setSpecialities((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                active: updatedSpeciality.active,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        'Failed to update speciality status:',
        error
      );

      alert('Unable to update speciality status.');
    }
  };

  // --------------------------------
  // DELETE
  // --------------------------------
  const remove = async (id: string) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete speciality');
      }

      setSpecialities((previous) =>
        previous.filter(
          (speciality) => speciality.id !== id
        )
      );

      setDeleteConfirm(null);
    } catch (error) {
      console.error(
        'Failed to delete speciality:',
        error
      );

      alert('Unable to delete speciality.');
    }
  };

  // --------------------------------
  // SORT
  // --------------------------------
  const sorted = [...specialities].sort(
    (a, b) => a.order - b.order
  );

  // --------------------------------
  // ADD MODAL
  // --------------------------------
  const openAddModal = () => {
    setForm(empty());
    setModal('add');
  };

  // --------------------------------
  // EDIT MODAL
  // --------------------------------
  const openEditModal = (speciality: Speciality) => {
    const { id, ...rest } = speciality;

    setForm(rest);
    setModal(speciality);
  };

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">
          Specialities
        </h1>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark"
        >
          + Add Speciality
        </button>
      </div>

      {/* SPECIALITIES LIST */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-text-muted">
            Loading specialities...
          </div>
        ) : (
          <>
            {sorted.map((speciality, index) => (
              <div
                key={speciality.id}
                className={`flex items-center gap-4 p-4 ${
                  index !== 0
                    ? 'border-t border-border'
                    : ''
                }`}
              >

                {/* IMAGE / ICON */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0">

                  {speciality.image ? (
                    <img
                      src={speciality.image}
                      alt={speciality.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MedicalIcon
                      name={
                        String(speciality.icon) as any
                      }
                      size={24}
                      color={iconColor.teal}
                      strokeWidth={2.2}
                    />
                  )}

                </div>

                {/* INFORMATION */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-center gap-2">

                    <span className="font-medium text-text truncate">
                      {speciality.name}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                        speciality.active
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-text-muted'
                      }`}
                    >
                      {speciality.active
                        ? 'Active'
                        : 'Off'}
                    </span>

                  </div>

                  <p className="text-xs text-text-muted truncate">
                    {speciality.description}
                  </p>

                  <p className="text-xs text-text-muted mt-1">
                    Order: {speciality.order}
                  </p>

                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 shrink-0">

                  <button
                    onClick={() =>
                      toggle(speciality.id)
                    }
                    className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                      speciality.active
                        ? 'border-warning text-warning'
                        : 'border-success text-success'
                    }`}
                  >
                    {speciality.active
                      ? 'Disable'
                      : 'Enable'}
                  </button>

                  <button
                    onClick={() =>
                      openEditModal(speciality)
                    }
                    className="px-2.5 py-1.5 text-xs text-primary border border-primary rounded-lg hover:bg-primary/10"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteConfirm(speciality.id)
                    }
                    className="px-2.5 py-1.5 text-xs text-danger border border-danger rounded-lg hover:bg-danger/10"
                  >
                    Del
                  </button>

                </div>

              </div>
            ))}

            {sorted.length === 0 && (
              <div className="p-10 text-center text-text-muted">
                No specialities yet.
              </div>
            )}
          </>
        )}

      </div>

      {/* ADD / EDIT MODAL */}
      {modal !== false && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* MODAL HEADER */}
            <div className="p-6 border-b border-border flex items-center justify-between">

              <h2 className="font-semibold text-text">
                {modal === 'add'
                  ? 'Add Speciality'
                  : 'Edit Speciality'}
              </h2>

              <button
                onClick={() => setModal(false)}
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

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Name *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="Cardiology"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* ICON */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Icon key
                </label>

                <input
                  type="text"
                  value={form.icon}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      icon: event.target.value,
                    })
                  }
                  placeholder="heart"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* DISPLAY ORDER */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Display Order
                </label>

                <input
                  type="number"
                  value={form.order}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      order: Number(
                        event.target.value
                      ),
                    })
                  }
                  placeholder="1"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="Brief description"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-24"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Speciality Image
                </label>

                {form.image ? (
                  <div className="space-y-3">

                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border bg-muted">

                      <img
                        src={form.image}
                        alt="Speciality preview"
                        className="w-full h-full object-cover"
                      />

                    </div>

                    <div className="flex gap-2">

                      <label className="flex-1 cursor-pointer">

                        <div className="w-full px-4 py-2.5 text-center text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10">
                          Change Image
                        </div>

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={
                            handleImageChange
                          }
                          className="hidden"
                        />

                      </label>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-4 py-2.5 text-sm text-danger border border-danger rounded-lg hover:bg-danger/10"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                ) : (
                  <label className="block cursor-pointer">

                    <div className="w-full h-36 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-primary transition-colors">

                      <MedicalIcon
                        name="image"
                        size={28}
                        color={iconColor.muted}
                        strokeWidth={2}
                      />

                      <span className="text-sm font-medium text-text mt-2">
                        Upload Speciality Image
                      </span>

                      <span className="text-xs text-text-muted mt-1">
                        PNG, JPG or WEBP · Max 2 MB
                      </span>

                    </div>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>
                )}

              </div>

              {/* ACTIVE */}
              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      active: event.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-primary"
                />

                <span className="text-sm font-medium text-text">
                  Active
                </span>

              </label>

            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-border flex gap-3 justify-end">

              <button
                onClick={() => setModal(false)}
                className="px-4 py-2 text-sm text-text-muted"
              >
                Cancel
              </button>

              <button
                onClick={save}
                className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">

            <h3 className="font-semibold mb-2">
              Delete Speciality?
            </h3>

            <p className="text-sm text-text-muted mb-5">
              This cannot be undone.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setDeleteConfirm(null)
                }
                className="flex-1 py-2.5 border border-border rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  remove(deleteConfirm)
                }
                className="flex-1 py-2.5 bg-danger text-white rounded-lg text-sm font-medium"
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