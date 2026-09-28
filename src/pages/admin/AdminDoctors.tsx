import { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { type Doctor } from '../../data/initialData';

const emptyDoctor = (): Omit<Doctor, 'id'> => ({
  name: '', qualification: '', specialization: '', experience: '',
  designation: '', department: '', timing: '', fees: '', description: '',
  photo: '', active: true, order: 1,
});

const FIELDS: Array<{ label: string; key: keyof Omit<Doctor, 'id'>; type?: string; placeholder: string }> = [
  { label: 'Full Name *', key: 'name', placeholder: 'Dr. Name' },
  { label: 'Qualification', key: 'qualification', placeholder: 'MD, MS, DM...' },
  { label: 'Specialization', key: 'specialization', placeholder: 'Cardiology, Neurology...' },
  { label: 'Department', key: 'department', placeholder: 'Cardiology' },
  { label: 'Designation', key: 'designation', placeholder: 'Consultant Cardiologist' },
  { label: 'Experience', key: 'experience', placeholder: '10+ years' },
  { label: 'Consultation Timing', key: 'timing', placeholder: 'Mon–Sat, 9am–1pm' },
  { label: 'Consultation Fee', key: 'fees', placeholder: '₹500' },
  { label: 'Photo URL', key: 'photo', placeholder: 'https://...' },
  { label: 'Display Order', key: 'order', type: 'number', placeholder: '1' },
  { label: 'Description', key: 'description', type: 'textarea', placeholder: 'Brief description of the doctor' },
];

import { MedicalIcon, iconColor } from '../../components/MedicalIcons';

export default function AdminDoctors() {
  const { doctors, setDoctors } = useHospital();
  const [modal, setModal] = useState<false | 'add' | Doctor>(false);
  const [form, setForm] = useState<Omit<Doctor, 'id'>>(emptyDoctor());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const openAdd = () => { setForm(emptyDoctor()); setModal('add'); };
  const openEdit = (d: Doctor) => { const { id, ...rest } = d; setForm(rest); setModal(d); };

  const save = () => {
    if (!form.name.trim()) return;
    if (modal === 'add') {
      setDoctors([...doctors, { ...form, id: Date.now().toString() }]);
    } else {
      setDoctors(doctors.map((d) => d.id === (modal as Doctor).id ? { ...form, id: (modal as Doctor).id } : d));
    }
    setModal(false);
  };

  const toggle = (id: string) => setDoctors(doctors.map((d) => d.id === id ? { ...d, active: !d.active } : d));
  const remove = (id: string) => { setDoctors(doctors.filter((d) => d.id !== id)); setDeleteConfirm(null); };

  const filtered = doctors
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.department.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text">Doctors</h1>
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors..."
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary w-48"
          />
          <button onClick={openAdd} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap">+ Add Doctor</button>
        </div>
      </div>

      {filtered.length === 0 && <div className="bg-white border border-border rounded-xl p-12 text-center text-text-muted">No doctors found.</div>}

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {filtered.map((d, i) => (
          <div key={d.id} className={`flex items-center gap-4 p-4 ${i !== 0 ? 'border-t border-border' : ''}`}>
            <img src={d.photo || 'https://via.placeholder.com/48'} alt={d.name} className="w-12 h-12 rounded-full object-cover object-top bg-muted shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text truncate">{d.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${d.active ? 'bg-success/10 text-success' : 'bg-muted text-text-muted'}`}>
                  {d.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-text-muted">{d.specialization} · {d.department}</p>
              {d.timing && <p className="text-xs text-text-light">{d.timing}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggle(d.id)} className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors hidden sm:block ${d.active ? 'border-warning text-warning hover:bg-warning/10' : 'border-success text-success hover:bg-success/10'}`}>
                {d.active ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => openEdit(d)} className="px-2.5 py-1.5 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">Edit</button>
              <button onClick={() => setDeleteConfirm(d.id)} className="px-2.5 py-1.5 text-xs font-medium text-danger border border-danger rounded-lg hover:bg-danger/10 transition-colors">Del</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal !== false && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-text">{modal === 'add' ? 'Add Doctor' : 'Edit Doctor'}</h2>
              <button onClick={() => setModal(false)} className="p-1 rounded-md hover:bg-muted"><MedicalIcon name="x" size={16} color={iconColor.muted} strokeWidth={2.2} /></button>
            </div>
            <div className="p-6 space-y-4">
              {FIELDS.map((f) => (
                <div key={f.key as string}>
                  <label className="block text-sm font-medium text-text mb-1.5">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={form[f.key] as string}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-24"
                    />
                  ) : (
                    <input
                      type={f.type ?? 'text'}
                      value={form[f.key] as string | number}
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
              <button onClick={save} className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">Save Doctor</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-semibold text-text mb-2">Delete Doctor?</h3>
            <p className="text-sm text-text-muted mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-muted">Cancel</button>
              <button onClick={() => remove(deleteConfirm)} className="flex-1 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
