import { useEffect, useState, type ChangeEvent } from 'react';
import { type Service } from '../../data/initialData';
import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

const API_URL = 'http://localhost:5000/api/services';

const empty = (): Omit<Service, 'id'> => ({
  name: '',
  description: '',
  icon: 'hospital',
  category: 'Speciality',
  image: '',
  active: true,
  order: 1,
});

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<false | 'add' | Service>(false);
  const [form, setForm] = useState<Omit<Service, 'id'>>(empty());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // -----------------------------
  // LOAD SERVICES FROM MONGODB
  // -----------------------------
  const fetchServices = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();

      const formattedServices: Service[] = data.map(
        (service: any) => ({
          id: service._id,
          name: service.name,
          description: service.description || '',
          icon: service.icon || 'hospital',
          category: service.category || 'Speciality',
          image: service.image || '',
          active: service.active ?? true,
          order: service.order ?? 1,
        })
      );

      setServices(formattedServices);
    } catch (error) {
      console.error('Failed to load services:', error);
      alert('Unable to load services from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // -----------------------------
  // IMAGE UPLOAD
  // -----------------------------
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
      if (typeof reader.result === 'string') {
        setForm((previous) => ({
          ...previous,
          image: reader.result as string,
        }));
      }
    };

    reader.onerror = () => {
      alert('Unable to read the selected image.');
    };

    reader.readAsDataURL(file);
  };

  // -----------------------------
  // REMOVE IMAGE
  // -----------------------------
  const removeImage = () => {
    setForm((previous) => ({
      ...previous,
      image: '',
    }));
  };

  // -----------------------------
  // SAVE SERVICE
  // -----------------------------
  const save = async () => {
    if (!form.name.trim()) {
      alert('Please enter a service name.');
      return;
    }

    try {
      // ADD SERVICE
      if (modal === 'add') {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error('Failed to add service');
        }

        const newService = await response.json();

        setServices((previous) => [
          ...previous,
          {
            id: newService._id,
            name: newService.name,
            description: newService.description || '',
            icon: newService.icon || 'hospital',
            category: newService.category || 'Speciality',
            image: newService.image || '',
            active: newService.active ?? true,
            order: newService.order ?? 1,
          },
        ]);
      }

      // EDIT SERVICE
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
          throw new Error('Failed to update service');
        }

        const updatedService = await response.json();

        setServices((previous) =>
          previous.map((service) =>
            service.id === modal.id
              ? {
                  id: updatedService._id,
                  name: updatedService.name,
                  description:
                    updatedService.description || '',
                  icon: updatedService.icon || 'hospital',
                  category:
                    updatedService.category || 'Speciality',
                  image: updatedService.image || '',
                  active: updatedService.active ?? true,
                  order: updatedService.order ?? 1,
                }
              : service
          )
        );
      }

      setModal(false);
      setForm(empty());
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Unable to save service. Please check the backend.');
    }
  };

  // -----------------------------
  // ENABLE / DISABLE
  // -----------------------------
  const toggle = async (id: string) => {
    const service = services.find(
      (item) => item.id === id
    );

    if (!service) return;

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            active: !service.active,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update service status');
      }

      const updatedService = await response.json();

      setServices((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                active: updatedService.active,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        'Failed to change service status:',
        error
      );

      alert('Unable to update service status.');
    }
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  const remove = async (id: string) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      setServices((previous) =>
        previous.filter((service) => service.id !== id)
      );

      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Unable to delete service.');
    }
  };

  // -----------------------------
  // SORT
  // -----------------------------
  const sorted = [...services].sort(
    (a, b) => a.order - b.order
  );

  const categories = [
    'Speciality',
    'Super-Speciality',
    'Diagnostics',
    'Emergency',
    'Facility',
    'Other',
  ];

  // -----------------------------
  // OPEN ADD MODAL
  // -----------------------------
  const openAddModal = () => {
    setForm(empty());
    setModal('add');
  };

  // -----------------------------
  // OPEN EDIT MODAL
  // -----------------------------
  const openEditModal = (service: Service) => {
    const { id, ...rest } = service;

    setForm(rest);
    setModal(service);
  };

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">
          Services
        </h1>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark"
        >
          + Add Service
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="bg-white border border-border rounded-xl p-10 text-center text-text-muted">
          Loading services...
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl overflow-hidden">

          {/* SERVICE LIST */}
          {sorted.map((service, index) => (
            <div
              key={service.id}
              className={`flex items-center gap-4 p-4 ${
                index !== 0
                  ? 'border-t border-border'
                  : ''
              }`}
            >

              {/* IMAGE / ICON */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0">

                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MedicalIcon
                    name={String(service.icon) as any}
                    size={24}
                    color={iconColor.teal}
                    strokeWidth={2.2}
                  />
                )}

              </div>

              {/* SERVICE INFO */}
              <div className="flex-1 min-w-0">

                <div className="flex items-center gap-2">

                  <span className="font-medium text-text truncate">
                    {service.name}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                      service.active
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-text-muted'
                    }`}
                  >
                    {service.active
                      ? 'Active'
                      : 'Off'}
                  </span>

                </div>

                <p className="text-xs text-text-muted">
                  {service.category} · Order:{' '}
                  {service.order}
                </p>

                {service.description && (
                  <p className="text-xs text-text-muted mt-1 truncate">
                    {service.description}
                  </p>
                )}

              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 shrink-0">

                <button
                  onClick={() =>
                    toggle(service.id)
                  }
                  className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                    service.active
                      ? 'border-warning text-warning'
                      : 'border-success text-success'
                  }`}
                >
                  {service.active
                    ? 'Disable'
                    : 'Enable'}
                </button>

                <button
                  onClick={() =>
                    openEditModal(service)
                  }
                  className="px-2.5 py-1.5 text-xs text-primary border border-primary rounded-lg hover:bg-primary/10"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    setDeleteConfirm(service.id)
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
              No services yet.
            </div>
          )}

        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modal !== false && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* MODAL HEADER */}
            <div className="p-6 border-b border-border flex items-center justify-between">

              <h2 className="font-semibold text-text">
                {modal === 'add'
                  ? 'Add Service'
                  : 'Edit Service'}
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

              {/* SERVICE NAME */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Service Name *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
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
                    setForm((previous) => ({
                      ...previous,
                      icon: event.target.value,
                    }))
                  }
                  placeholder="stethoscope"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* ORDER */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Display Order
                </label>

                <input
                  type="number"
                  value={form.order}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      order: Number(
                        event.target.value
                      ),
                    }))
                  }
                  placeholder="1"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      category:
                        event.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description:
                        event.target.value,
                    }))
                  }
                  placeholder="Brief description"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-24"
                />
              </div>

              {/* SERVICE IMAGE */}
              <div>

                <label className="block text-sm font-medium text-text mb-1.5">
                  Service Image
                </label>

                {form.image ? (
                  <div className="space-y-3">

                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border bg-muted">

                      <img
                        src={form.image}
                        alt="Service preview"
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
                        Upload Service Image
                      </span>

                      <span className="text-xs text-text-muted mt-1">
                        PNG, JPG or WEBP · Max 2 MB
                      </span>

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
                )}

              </div>

              {/* ACTIVE */}
              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      active:
                        event.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-primary"
                />

                <span className="text-sm font-medium text-text">
                  Active
                </span>

              </label>

            </div>

            {/* MODAL FOOTER */}
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
              Delete Service?
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