import { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { type SocialPost } from '../../data/initialData';

const empty = (): Omit<SocialPost, 'id'> => ({
  platform: 'facebook', postUrl: '', embedUrl: '', thumbnail: '',
  caption: '', date: new Date().toISOString().split('T')[0], active: true, order: 1,
});

const PLATFORM_LABELS: Record<string, string> = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube' };

import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

export default function AdminSocialPosts() {
  const { socialPosts, setSocialPosts } = useHospital();
  const [modal, setModal] = useState<false | 'add' | SocialPost>(false);
  const [form, setForm] = useState<Omit<SocialPost, 'id'>>(empty());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const save = () => {
    if (!form.caption.trim() || !form.platform) return;
    if (modal === 'add') setSocialPosts([...socialPosts, { ...form, id: Date.now().toString() }]);
    else setSocialPosts(socialPosts.map((p) => p.id === (modal as SocialPost).id ? { ...form, id: (modal as SocialPost).id } : p));
    setModal(false);
  };

  const toggle = (id: string) => setSocialPosts(socialPosts.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  const remove = (id: string) => { setSocialPosts(socialPosts.filter((p) => p.id !== id)); setDeleteConfirm(null); };

  const sorted = [...socialPosts].sort((a, b) => a.order - b.order);
  const platformColors: Record<string, string> = { facebook: 'bg-blue-100 text-blue-700', instagram: 'bg-pink-100 text-pink-700', youtube: 'bg-red-100 text-red-700' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">Social Media Posts</h1>
        <button onClick={() => { setForm(empty()); setModal('add'); }} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark">+ Add Post</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((p) => (
          <div key={p.id} className={`bg-white border rounded-xl overflow-hidden ${p.active ? 'border-border' : 'border-border opacity-60'}`}>
            {p.thumbnail && <img src={p.thumbnail} alt={p.caption} className="w-full h-40 object-cover bg-muted" />}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${platformColors[p.platform]}`}>{PLATFORM_LABELS[p.platform]}</span>
                <span className={`text-xs ${p.active ? 'text-success' : 'text-text-muted'}`}>{p.active ? 'Active' : 'Inactive'}</span>
              </div>
              <p className="text-sm text-text line-clamp-2 mb-2">{p.caption}</p>
              <p className="text-xs text-text-light mb-3">{p.date}</p>
              <div className="flex gap-2">
                <button onClick={() => toggle(p.id)} className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${p.active ? 'border-warning text-warning' : 'border-success text-success'}`}>{p.active ? 'Disable' : 'Enable'}</button>
                <button onClick={() => { const { id, ...rest } = p; setForm(rest); setModal(p); }} className="flex-1 py-1.5 text-xs text-primary border border-primary rounded-lg">Edit</button>
                <button onClick={() => setDeleteConfirm(p.id)} className="flex-1 py-1.5 text-xs text-danger border border-danger rounded-lg">Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && <div className="bg-white border border-border rounded-xl p-12 text-center text-text-muted">No social posts yet.</div>}

      {modal !== false && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-text">{modal === 'add' ? 'Add Social Post' : 'Edit Post'}</h2>
              <button onClick={() => setModal(false)} className="p-1 rounded-md hover:bg-muted"><MedicalIcon name="x" size={16} color={iconColor.muted} strokeWidth={2.2} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Platform *</label>
                <select value={form.platform} onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value as SocialPost['platform'] }))} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              {[
                { label: 'Post URL', key: 'postUrl', placeholder: 'https://facebook.com/...' },
                { label: 'YouTube Embed URL', key: 'embedUrl', placeholder: 'https://youtube.com/embed/...' },
                { label: 'Thumbnail URL', key: 'thumbnail', placeholder: 'https://images.unsplash.com/...' },
                { label: 'Date', key: 'date', type: 'date', placeholder: '' },
                { label: 'Display Order', key: 'order', type: 'number', placeholder: '1' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-text mb-1.5">{f.label}</label>
                  <input type={f.type ?? 'text'} value={form[f.key as keyof typeof form] as string | number} onChange={(e) => setForm((p) => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))} placeholder={f.placeholder} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Caption *</label>
                <textarea value={form.caption} onChange={(e) => setForm((p) => ({ ...p, caption: e.target.value }))} placeholder="Post caption" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-24" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium text-text">Active</span>
              </label>
            </div>
            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm text-text-muted">Cancel</button>
              <button onClick={save} className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark">Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-semibold mb-2">Delete Post?</h3>
            <p className="text-sm text-text-muted mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm">Cancel</button>
              <button onClick={() => remove(deleteConfirm)} className="flex-1 py-2.5 bg-danger text-white rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
