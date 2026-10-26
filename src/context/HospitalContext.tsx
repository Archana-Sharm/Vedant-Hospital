import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import {
  type Banner,
  type Doctor,
  type Service,
  type Speciality,
  type SocialPost,
  type HospitalSettings,
  initialBanners,
  initialDoctors,
  initialServices,
  initialSpecialities,
  initialSocialPosts,
  defaultSettings,
} from '../data/initialData';

interface HospitalContextType {
  settings: HospitalSettings;
  banners: Banner[];
  doctors: Doctor[];
  services: Service[];
  specialities: Speciality[];
  socialPosts: SocialPost[];

  updateSettings: (s: HospitalSettings) => Promise<void>;

  setBanners: (b: Banner[]) => void;
  setDoctors: (d: Doctor[]) => void;
  setServices: (s: Service[]) => void;
  setSpecialities: (s: Speciality[]) => void;
  setSocialPosts: (p: SocialPost[]) => void;
}

const HospitalContext = createContext<HospitalContextType | null>(null);

const SETTINGS_API = 'http://localhost:5000/api/settings';
const SERVICES_API = 'http://localhost:5000/api/services';
const SPECIALITIES_API = 'http://localhost:5000/api/specialities';
const SOCIAL_POSTS_API = 'http://localhost:5000/api/social-posts';
const BANNERS_API = 'http://localhost:5000/api/banners';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function HospitalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] =
    useState<HospitalSettings>(defaultSettings);

  const [banners, setBannersState] =
    useState<Banner[]>([]);

  const [doctors, setDoctorsState] =
    useState<Doctor[]>(() =>
      load('vh_doctors', initialDoctors)
    );

  const [services, setServicesState] =
    useState<Service[]>([]);

  const [specialities, setSpecialitiesState] =
    useState<Speciality[]>([]);

  const [socialPosts, setSocialPostsState] =
    useState<SocialPost[]>([]);

  /* =========================
     SETTINGS
  ========================= */

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(SETTINGS_API);

        if (!response.ok) {
          throw new Error(
            'Failed to fetch hospital settings'
          );
        }

        const data = await response.json();

        setSettings({
          ...defaultSettings,
          ...data,
        });

        localStorage.setItem(
          'vh_settings',
          JSON.stringify(data)
        );
      } catch (error) {
        console.error(
          'Failed to load hospital settings from MongoDB:',
          error
        );

        try {
          const localSettings =
            localStorage.getItem('vh_settings');

          if (localSettings) {
            setSettings(JSON.parse(localSettings));
          }
        } catch {
          setSettings(defaultSettings);
        }
      }
    }

    fetchSettings();
  }, []);

  /* =========================
     BANNERS
  ========================= */

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await fetch(BANNERS_API);

        if (!response.ok) {
          throw new Error(
            'Failed to fetch banners'
          );
        }

        const data = await response.json();

        const mongoBanners: Banner[] = data
         .map((banner: any) => ({
         ...banner,
         id: banner._id || banner.id,
        }))
        .sort(
        (a: Banner, b: Banner) =>
        a.order - b.order
        ); 

        setBannersState(mongoBanners);

        localStorage.setItem(
          'vh_banners',
          JSON.stringify(mongoBanners)
        );
      } catch (error) {
        console.error(
          'Failed to load banners from MongoDB:',
          error
        );

        setBannersState(
          load('vh_banners', initialBanners)
        );
      }
    }

    fetchBanners();
  }, []);

  /* =========================
     SERVICES
  ========================= */

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(SERVICES_API);

        if (!response.ok) {
          throw new Error(
            'Failed to fetch services'
          );
        }

        const data = await response.json();

        const mongoServices: Service[] = data.map(
          (service: any) => ({
            ...service,
            id: service._id || service.id,
          })
        );

        setServicesState(mongoServices);

        localStorage.setItem(
          'vh_services',
          JSON.stringify(mongoServices)
        );
      } catch (error) {
        console.error(
          'Failed to load services from MongoDB:',
          error
        );

        setServicesState(
          load('vh_services', initialServices)
        );
      }
    }

    fetchServices();
  }, []);

  /* =========================
     SPECIALITIES
  ========================= */

  useEffect(() => {
    async function fetchSpecialities() {
      try {
        const response = await fetch(
          SPECIALITIES_API
        );

        if (!response.ok) {
          throw new Error(
            'Failed to fetch specialities'
          );
        }

        const data = await response.json();

        const mongoSpecialities: Speciality[] =
          data.map((speciality: any) => ({
            ...speciality,
            id: speciality._id || speciality.id,
          }));

        setSpecialitiesState(
          mongoSpecialities
        );

        localStorage.setItem(
          'vh_specialities',
          JSON.stringify(mongoSpecialities)
        );
      } catch (error) {
        console.error(
          'Failed to load specialities from MongoDB:',
          error
        );

        setSpecialitiesState(
          load(
            'vh_specialities',
            initialSpecialities
          )
        );
      }
    }

    fetchSpecialities();
  }, []);

  /* =========================
     SOCIAL POSTS
  ========================= */

  useEffect(() => {
    async function fetchSocialPosts() {
      try {
        const response = await fetch(
          SOCIAL_POSTS_API
        );

        if (!response.ok) {
          throw new Error(
            'Failed to fetch social posts'
          );
        }

        const data = await response.json();

        const mongoSocialPosts: SocialPost[] =
          data.map((post: any) => ({
            ...post,
            id: post._id || post.id,
          }));

        setSocialPostsState(
          mongoSocialPosts
        );

        localStorage.setItem(
          'vh_social',
          JSON.stringify(mongoSocialPosts)
        );
      } catch (error) {
        console.error(
          'Failed to load social posts from MongoDB:',
          error
        );

        setSocialPostsState(
          load(
            'vh_social',
            initialSocialPosts
          )
        );
      }
    }

    fetchSocialPosts();
  }, []);


  /* =========================
     LOCAL STORAGE HELPER
  ========================= */

  const persist = (
    key: string,
    val: unknown
  ) => {
    localStorage.setItem(
      key,
      JSON.stringify(val)
    );
  };

  /* =========================
     UPDATE SETTINGS
  ========================= */

  const updateSettings = async (
    s: HospitalSettings
  ) => {
    try {
      const response = await fetch(
        SETTINGS_API,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(s),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to update hospital settings'
        );
      }

      const updatedSettings =
        await response.json();

      setSettings({
        ...defaultSettings,
        ...updatedSettings,
      });

      persist(
        'vh_settings',
        updatedSettings
      );
    } catch (error) {
      console.error(
        'Failed to save hospital settings to MongoDB:',
        error
      );

      throw error;
    }
  };

  /* =========================
     LOCAL STATE SETTERS
  ========================= */

  const setBanners = (b: Banner[]) => {
    setBannersState(b);
    persist('vh_banners', b);
  };

  const setDoctors = (d: Doctor[]) => {
    setDoctorsState(d);
    persist('vh_doctors', d);
  };

  const setServices = (s: Service[]) => {
    setServicesState(s);
    persist('vh_services', s);
  };

  const setSpecialities = (
    s: Speciality[]
  ) => {
    setSpecialitiesState(s);
    persist(
      'vh_specialities',
      s
    );
  };

  const setSocialPosts = (
    p: SocialPost[]
  ) => {
    setSocialPostsState(p);
    persist('vh_social', p);
  };

  return (
    <HospitalContext.Provider
      value={{
        settings,
        banners,
        doctors,
        services,
        specialities,
        socialPosts,

        updateSettings,

        setBanners,
        setDoctors,
        setServices,
        setSpecialities,
        setSocialPosts,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}

export const useHospital = () => {
  const ctx = useContext(HospitalContext);

  if (!ctx) {
    throw new Error(
      'useHospital must be used within HospitalProvider'
    );
  }

  return ctx;
};