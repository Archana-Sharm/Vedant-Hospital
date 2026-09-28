import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  type Banner, type Doctor, type Service, type Speciality,
  type SocialPost, type HospitalSettings,
  initialBanners, initialDoctors, initialServices, initialSpecialities,
  initialSocialPosts, defaultSettings,
} from '../data/initialData';

interface HospitalContextType {
  settings: HospitalSettings;
  banners: Banner[];
  doctors: Doctor[];
  services: Service[];
  specialities: Speciality[];
  socialPosts: SocialPost[];
  updateSettings: (s: HospitalSettings) => void;
  setBanners: (b: Banner[]) => void;
  setDoctors: (d: Doctor[]) => void;
  setServices: (s: Service[]) => void;
  setSpecialities: (s: Speciality[]) => void;
  setSocialPosts: (p: SocialPost[]) => void;
}

const HospitalContext = createContext<HospitalContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function HospitalProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<HospitalSettings>(() => load('vh_settings', defaultSettings));
  const [banners, setBannersState] = useState<Banner[]>(() => load('vh_banners', initialBanners));
  const [doctors, setDoctorsState] = useState<Doctor[]>(() => load('vh_doctors', initialDoctors));
  const [services, setServicesState] = useState<Service[]>(() => load('vh_services', initialServices));
  const [specialities, setSpecialitiesState] = useState<Speciality[]>(() => load('vh_specialities', initialSpecialities));
  const [socialPosts, setSocialPostsState] = useState<SocialPost[]>(() => load('vh_social', initialSocialPosts));

  const persist = (key: string, val: unknown) => localStorage.setItem(key, JSON.stringify(val));

  const updateSettings = (s: HospitalSettings) => { setSettings(s); persist('vh_settings', s); };
  const setBanners = (b: Banner[]) => { setBannersState(b); persist('vh_banners', b); };
  const setDoctors = (d: Doctor[]) => { setDoctorsState(d); persist('vh_doctors', d); };
  const setServices = (s: Service[]) => { setServicesState(s); persist('vh_services', s); };
  const setSpecialities = (s: Speciality[]) => { setSpecialitiesState(s); persist('vh_specialities', s); };
  const setSocialPosts = (p: SocialPost[]) => { setSocialPostsState(p); persist('vh_social', p); };

  return (
    <HospitalContext.Provider value={{
      settings, banners, doctors, services, specialities, socialPosts,
      updateSettings, setBanners, setDoctors, setServices, setSpecialities, setSocialPosts,
    }}>
      {children}
    </HospitalContext.Provider>
  );
}

export const useHospital = () => {
  const ctx = useContext(HospitalContext);
  if (!ctx) throw new Error('useHospital must be used within HospitalProvider');
  return ctx;
};
