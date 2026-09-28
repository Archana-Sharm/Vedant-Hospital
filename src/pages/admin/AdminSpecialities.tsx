import { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { type Speciality } from '../../data/initialData';

import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

const empty = (): Omit<Speciality, 'id'> => ({ name: '', description: '', icon: 'shield', active: true, order: 1 });

export default function AdminSpecialities() {
  const { specialities, setSpecialities } = useHospital();
  const [modal, setModal] = useState<false | 'add' | Speciality>(false);
  const [form, setForm] = useState<Omit<Speciality, 'id'>>(empty());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const save = () => {
    if (!form.name.trim()) return;
    if (modal === 'add') setSpecialities([...specialities, { ...form, id: Date.now().toString() }]);
    else setSpecialities(specialities.map((s) => s.id === (modal as Speciality).id ? { ...form, id: (modal as Speciality).id } : s));
    setModal(false);
  };

  const toggle = (id: string) => setSpecialities(specialities.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  const remove = (id: string) => { setSpecialities(specialities.filter((s) => s.id !== id)); setDeleteConfirm(null); };

  const sorted = [...specialities].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">Specialities</h1>
        <button onClick={() => { setForm(empty()); setModal('add'); }} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark">+ Add Speciality</button>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {sorted.map((s, i) => (
          <div key={s.id} className={`flex items-center gap-4 p-4 ${i !== 0 ? 'border-t border-border' : ''}`}>
            <div className="w-10 flex items-center justify-center shrink-0">
              <MedicalIcon name={String(s.icon) as any} size={22} color={iconColor.teal} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text truncate">{s.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${s.active ? 'bg-success/10 text-success' : 'bg-muted text-text-muted'}`}>{s.active ? 'Active' : 'Off'}</span>
              </div>
              <p className="text-xs text-text-muted truncate">{s.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggle(s.id)} className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${s.active ? 'border-warning text-warning' : 'border-success text-success'}`}>{s.active ? 'Disable' : 'Enable'}</button>
              <button onClick={() => { const { id, ...rest } = s; setForm(rest); setModal(s); }} className="px-2.5 py-1.5 text-xs text-primary border border-primary rounded-lg">Edit</button>
              <button onClick={() => setDeleteConfirm(s.id)} className="px-2.5 py-1.5 text-xs text-danger border border-danger rounded-lg">Del</button>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <div className="p-10 text-center text-text-muted">No specialities yet.</div>}
      </div>

      {modal !== false && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-text">{modal === 'add' ? 'Add Speciality' : 'Edit Speciality'}</h2>
              <button onClick={() => setModal(false)} className="p-1 rounded-md hover:bg-muted"><MedicalIcon name="x" size={16} color={iconColor.muted} strokeWidth={2.2} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Name *', key: 'name', placeholder: 'Cardiology' },
                { label: 'Icon key', key: 'icon', placeholder: 'heart' },
                { label: 'Display Order', key: 'order', type: 'number', placeholder: '1' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-text mb-1.5">{f.label}</label>
                  <input type={f.type ?? 'text'} value={form[f.key as keyof typeof form] as string | number} onChange={(e) => setForm((p) => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))} placeholder={f.placeholder} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Brief description" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-24" />
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
            <h3 className="font-semibold mb-2">Delete Speciality?</h3>
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
