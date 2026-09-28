import { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { type Banner } from '../../data/initialData';

const emptyBanner = (): Omit<Banner, 'id'> => ({
  title: '', subtitle: '', ctaText: 'Book Appointment', ctaLink: '/contact',
  image: '', active: true, order: 1,
});

import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

export default function AdminBanners() {
  const { banners, setBanners } = useHospital();
  const [modal, setModal] = useState<false | 'add' | Banner>(false);
  const [form, setForm] = useState<Omit<Banner, 'id'>>(emptyBanner());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openAdd = () => { setForm(emptyBanner()); setModal('add'); };
  const openEdit = (b: Banner) => { setForm({ title: b.title, subtitle: b.subtitle, ctaText: b.ctaText, ctaLink: b.ctaLink, image: b.image, active: b.active, order: b.order }); setModal(b); };

  const save = () => {
    if (!form.title.trim()) return;
    if (modal === 'add') {
      setBanners([...banners, { ...form, id: Date.now().toString() }]);
    } else {
      setBanners(banners.map((b) => b.id === (modal as Banner).id ? { ...form, id: (modal as Banner).id } : b));
    }
    setModal(false);
  };

  const toggle = (id: string) => setBanners(banners.map((b) => b.id === id ? { ...b, active: !b.active } : b));
  const remove = (id: string) => { setBanners(banners.filter((b) => b.id !== id)); setDeleteConfirm(null); };

  const sorted = [...banners].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">Banners</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">+ Add Banner</button>
      </div>

      {sorted.length === 0 && (
        <div className="bg-white border border-border rounded-xl p-12 text-center text-text-muted">No banners yet. Add one to get started.</div>
      )}

      <div className="space-y-3">
        {sorted.map((b) => (
          <div key={b.id} className="bg-white border border-border rounded-xl p-5 flex gap-4 items-start">
            {b.image && <img src={b.image} alt={b.title} className="w-28 h-16 object-cover rounded-lg shrink-0 bg-muted" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-text truncate">{b.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.active ? 'bg-success/10 text-success' : 'bg-muted text-text-muted'}`}>
                  {b.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-text-muted line-clamp-1 mb-1">{b.subtitle}</p>
              <p className="text-xs text-text-light">CTA: {b.ctaText} → {b.ctaLink}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggle(b.id)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${b.active ? 'border-warning text-warning hover:bg-warning/10' : 'border-success text-success hover:bg-success/10'}`}>
                {b.active ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => openEdit(b)} className="px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">Edit</button>
              <button onClick={() => setDeleteConfirm(b.id)} className="px-3 py-1.5 text-xs font-medium text-danger border border-danger rounded-lg hover:bg-danger/10 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal !== false && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-text">{modal === 'add' ? 'Add Banner' : 'Edit Banner'}</h2>
              <button onClick={() => setModal(false)} className="p-1 rounded-md hover:bg-muted"><MedicalIcon name="x" size={16} color={iconColor.muted} strokeWidth={2.2} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Title *', key: 'title', type: 'text', placeholder: 'Banner headline' },
                { label: 'Subtitle', key: 'subtitle', type: 'textarea', placeholder: 'Banner description' },
                { label: 'Image URL', key: 'image', type: 'text', placeholder: 'https://...' },
                { label: 'CTA Text', key: 'ctaText', type: 'text', placeholder: 'Book Appointment' },
                { label: 'CTA Link', key: 'ctaLink', type: 'text', placeholder: '/contact' },
                { label: 'Display Order', key: 'order', type: 'number', placeholder: '1' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-text mb-1.5">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={form[f.key as keyof typeof form] as string}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-24"
                    />
                  ) : (
                    <input
                      type={f.type}
                      value={form[f.key as keyof typeof form] as string | number}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  )}
                </div>
              ))}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium text-text">Active (visible on website)</span>
              </label>
            </div>
            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors">Cancel</button>
              <button onClick={save} className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">Save Banner</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-semibold text-text mb-2">Delete Banner?</h3>
            <p className="text-sm text-text-muted mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => remove(deleteConfirm)} className="flex-1 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
