import {
  useEffect,
  useState,
  type ChangeEvent,
} from 'react';

import { type Banner } from '../../data/initialData';
import {
  MedicalIcon,
  iconColor,
} from '../../components/MedicalIcons';

const API_URL = 'http://localhost:5000/api/banners';

type BannerForm = Omit<Banner, 'id'>;

const emptyBanner = (): BannerForm => ({
  title: '',
  subtitle: '',
  buttonText: 'Book Appointment',
  buttonLink: '/contact',
  image: '',
  active: true,
  order: 1,
});

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState<
    false | 'add' | Banner
  >(false);

  const [form, setForm] =
    useState<BannerForm>(emptyBanner());

  const [deleteConfirm, setDeleteConfirm] =
    useState<string | null>(null);

  // ============================================================
  // LOAD BANNERS
  // ============================================================

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch banners (${response.status})`
        );
      }

      const data = await response.json();

      const formattedBanners: Banner[] = data.map(
        (banner: any) => ({
          id: banner._id || banner.id,
          title: banner.title || '',
          subtitle: banner.subtitle || '',
          buttonText: banner.buttonText || '',
          buttonLink: banner.buttonLink || '',
          image: banner.image || '',
          active: banner.active ?? true,
          order: Number(banner.order ?? 1),
        })
      );

      setBanners(formattedBanners);
    } catch (error) {
      console.error(
        'Failed to load banners:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Unable to load banners from the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // IMAGE UPLOAD
  // ============================================================

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
      alert(
        'Please select an image smaller than 2 MB.'
      );
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

  const removeImage = () => {
    setForm((previous) => ({
      ...previous,
      image: '',
    }));
  };

  // ============================================================
  // ADD
  // ============================================================

  const openAdd = () => {
    setForm(emptyBanner());
    setModal('add');
  };

  // ============================================================
  // EDIT
  // ============================================================

  const openEdit = (banner: Banner) => {
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      image: banner.image,
      active: banner.active,
      order: banner.order,
    });

    setModal(banner);
  };

  // ============================================================
  // SAVE
  // ============================================================

  const save = async () => {
    if (!form.title.trim()) {
      alert('Please enter a banner title.');
      return;
    }

    if (saving) return;

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        buttonText: form.buttonText.trim(),
        buttonLink: form.buttonLink.trim(),
        image: form.image,
        active: form.active,
        order: Number(form.order) || 1,
      };

      console.log('Saving banner:', payload);

      let response: Response;

      // ========================================================
      // ADD
      // ========================================================

      if (modal === 'add') {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      // ========================================================
      // EDIT
      // ========================================================

      else if (modal !== false) {
        const bannerId = modal.id;

        if (!bannerId) {
          throw new Error(
            'Banner ID is missing. Cannot update this banner.'
          );
        }

        response = await fetch(
          `${API_URL}/${bannerId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );
      }

      // ========================================================
      // SAFETY
      // ========================================================

      else {
        return;
      }

      // ========================================================
      // READ SERVER RESPONSE
      // ========================================================

      const responseText = await response.text();

      let responseData: any = null;

      try {
        responseData = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        responseData = null;
      }

      console.log(
        'Banner save response:',
        response.status,
        responseData
      );

      if (!response.ok) {
        const serverMessage =
          responseData?.message ||
          responseData?.error ||
          responseText ||
          `Server returned ${response.status}`;

        throw new Error(serverMessage);
      }

      // ========================================================
      // SUCCESS
      // ========================================================

      await fetchBanners();

      setModal(false);

      alert('Banner saved successfully.');
    } catch (error) {
      console.error(
        'Failed to save banner:',
        error
      );

      alert(
        error instanceof Error
          ? `Unable to save banner.\n\n${error.message}`
          : 'Unable to save banner.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // ENABLE / DISABLE
  // ============================================================

  const toggle = async (id: string) => {
    const banner = banners.find(
      (item) => item.id === id
    );

    if (!banner) return;

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            active: !banner.active,
          }),
        }
      );

      const responseText = await response.text();

      let responseData: any = null;

      try {
        responseData = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            responseText ||
            `Server returned ${response.status}`
        );
      }

      setBanners((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                active:
                  responseData.active,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        'Failed to toggle banner:',
        error
      );

      alert(
        error instanceof Error
          ? `Unable to change banner status.\n\n${error.message}`
          : 'Unable to change banner status.'
      );
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const remove = async (id: string) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',
        }
      );

      const responseText = await response.text();

      let responseData: any = null;

      try {
        responseData = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            responseText ||
            `Server returned ${response.status}`
        );
      }

      setBanners((previous) =>
        previous.filter(
          (banner) => banner.id !== id
        )
      );

      setDeleteConfirm(null);
    } catch (error) {
      console.error(
        'Failed to delete banner:',
        error
      );

      alert(
        error instanceof Error
          ? `Unable to delete banner.\n\n${error.message}`
          : 'Unable to delete banner.'
      );
    }
  };

  // ============================================================
  // SORT
  // ============================================================

  const sorted = [...banners].sort(
    (a, b) => a.order - b.order
  );

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-muted">
          Loading banners...
        </p>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-5">

      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">
          Banners
        </h1>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          + Add Banner
        </button>
      </div>

      {/* EMPTY */}

      {sorted.length === 0 && (
        <div className="bg-white border border-border rounded-xl p-12 text-center text-text-muted">
          No banners yet. Add one to get started.
        </div>
      )}

      {/* BANNER LIST */}

      <div className="space-y-3">

        {sorted.map((banner) => (
          <div
            key={banner.id}
            className="bg-white border border-border rounded-xl p-5 flex gap-4 items-start"
          >

            {/* IMAGE */}

            <div className="w-28 h-16 rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center">

              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MedicalIcon
                  name="image"
                  size={24}
                  color={iconColor.muted}
                  strokeWidth={2}
                />
              )}

            </div>

            {/* INFO */}

            <div className="flex-1 min-w-0">

              <div className="flex items-center gap-2 mb-1">

                <h3 className="font-semibold text-text truncate">
                  {banner.title}
                </h3>

                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    banner.active
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-text-muted'
                  }`}
                >
                  {banner.active
                    ? 'Active'
                    : 'Inactive'}
                </span>

              </div>

              <p className="text-sm text-text-muted line-clamp-1 mb-1">
                {banner.subtitle}
              </p>

              <p className="text-xs text-text-light">
                CTA: {banner.buttonText} →{' '}
                {banner.buttonLink}
              </p>

              <p className="text-xs text-text-muted mt-1">
                Order: {banner.order}
              </p>

            </div>

            {/* ACTIONS */}

            <div className="flex gap-2 shrink-0">

              <button
                onClick={() =>
                  toggle(banner.id)
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  banner.active
                    ? 'border-warning text-warning hover:bg-warning/10'
                    : 'border-success text-success hover:bg-success/10'
                }`}
              >
                {banner.active
                  ? 'Disable'
                  : 'Enable'}
              </button>

              <button
                onClick={() =>
                  openEdit(banner)
                }
                className="px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  setDeleteConfirm(banner.id)
                }
                className="px-3 py-1.5 text-xs font-medium text-danger border border-danger rounded-lg hover:bg-danger/10 transition-colors"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ========================================================
          ADD / EDIT MODAL
      ======================================================== */}

      {modal !== false && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* MODAL HEADER */}

            <div className="p-6 border-b border-border flex items-center justify-between">

              <h2 className="font-semibold text-text">
                {modal === 'add'
                  ? 'Add Banner'
                  : 'Edit Banner'}
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

              {/* TITLE */}

              <div>

                <label className="block text-sm font-medium text-text mb-1.5">
                  Title *
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      title:
                        event.target.value,
                    }))
                  }
                  placeholder="Banner headline"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />

              </div>

              {/* SUBTITLE */}

              <div>

                <label className="block text-sm font-medium text-text mb-1.5">
                  Subtitle
                </label>

                <textarea
                  value={form.subtitle}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      subtitle:
                        event.target.value,
                    }))
                  }
                  placeholder="Banner description"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-24"
                />

              </div>

              {/* IMAGE */}

              <div>

                <label className="block text-sm font-medium text-text mb-1.5">
                  Banner Image
                </label>

                {form.image ? (
                  <div className="space-y-3">

                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border bg-muted">

                      <img
                        src={form.image}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />

                    </div>

                    <div className="flex gap-2">

                      <label className="flex-1 cursor-pointer">

                        <div className="w-full px-4 py-2.5 text-center text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">
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
                        className="px-4 py-2.5 text-sm text-danger border border-danger rounded-lg hover:bg-danger/10 transition-colors"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                ) : (
                  <label className="block cursor-pointer">

                    <div className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-primary transition-colors">

                      <MedicalIcon
                        name="image"
                        size={32}
                        color={iconColor.muted}
                        strokeWidth={2}
                      />

                      <span className="text-sm font-medium text-text mt-2">
                        Upload Banner Image
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

              {/* BUTTON TEXT */}

              <div>

                <label className="block text-sm font-medium text-text mb-1.5">
                  CTA Text
                </label>

                <input
                  type="text"
                  value={form.buttonText}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      buttonText:
                        event.target.value,
                    }))
                  }
                  placeholder="Book Appointment"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />

              </div>

              {/* BUTTON LINK */}

              <div>

                <label className="block text-sm font-medium text-text mb-1.5">
                  CTA Link
                </label>

                <input
                  type="text"
                  value={form.buttonLink}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      buttonLink:
                        event.target.value,
                    }))
                  }
                  placeholder="/contact"
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
                disabled={saving}
                className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={save}
                disabled={saving}
                className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving
                  ? 'Saving...'
                  : 'Save Banner'}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION
      ======================================================== */}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">

            <h3 className="font-semibold text-text mb-2">
              Delete Banner?
            </h3>

            <p className="text-sm text-text-muted mb-5">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setDeleteConfirm(null)
                }
                className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  remove(deleteConfirm)
                }
                className="flex-1 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
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