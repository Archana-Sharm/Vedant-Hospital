import vedantLogo from '../../assets/Vedant Multi Specialty Hospital Logo.png';

// ============================================================
// TYPES
// ============================================================

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
  order: number;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  designation: string;
  department: string;
  timing: string;
  fees: string;
  description: string;
  photo: string;
  active: boolean;
  order: number;
  mobile?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  image: string;
  active: boolean;
  order: number;
}

export interface Speciality {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  active: boolean;
  order: number;
}

export interface SocialPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'youtube';
  postUrl: string;
  embedUrl: string;
  thumbnail: string;
  caption: string;
  date: string;
  active: boolean;
  order: number;
}

export interface HospitalSettings {
  name: string;
  tagline: string;
  phone: string;
  alternatePhone: string;
  email: string;
  address: string;
  mapsLink: string;
  emergencyContact: string;
  workingHours: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  youtube: string;
  logo: string;
}

// ============================================================
// DEFAULT HOSPITAL SETTINGS
// ============================================================

export const defaultSettings: HospitalSettings = {
  name: 'Vedant Multispeciality Hospital',
  tagline: 'Comprehensive Healthcare. Compassionate Care.',
  phone: '+91 93250 39914',
  alternatePhone: '',
  email: 'info@vedanthospital.com',
  address:
    'MQ6W+299, Sambhajinagar, Chinchwad, Pimpri-Chinchwad, Maharashtra 411019',
  mapsLink:
    'https://maps.google.com/?q=Vedant+Multispeciality+Hospital',
  emergencyContact: '+91 93250 39914',
  workingHours: 'Open 24 Hours',
  whatsapp: '+919325039914',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
  logo: vedantLogo,
};

// ============================================================
// INITIAL BANNERS
// ============================================================

export const initialBanners: Banner[] = [
  {
    id: '1',
    title: 'Comprehensive Healthcare. Compassionate Care.',
    subtitle:
      'Vedant Multispeciality Hospital provides comprehensive medical, surgical, diagnostic, emergency and critical-care services under one roof in Chinchwad, Pimpri-Chinchwad.',
    buttonText: 'Book Appointment',
    buttonLink: '/contact',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&h=900&fit=crop&auto=format',
    active: true,
    order: 1,
  },

  {
    id: '2',
    title: '24/7 Emergency & Trauma Care',
    subtitle:
      'Our casualty department, ICU, HDU and specialist teams are available around the clock for medical emergencies and trauma cases.',
    buttonText: 'Emergency: +91 93250 39914',
    buttonLink: '/contact',
    image:
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1600&h=900&fit=crop&auto=format',
    active: true,
    order: 2,
  },

  {
    id: '3',
    title: 'Super-Speciality Medical Services',
    subtitle:
      'From Cardiology to Neurosurgery, Oncology to Nephrology — our specialists bring advanced care to Pimpri-Chinchwad.',
    buttonText: 'Explore Services',
    buttonLink: '/services',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=900&fit=crop&auto=format',
    active: true,
    order: 3,
  },
];

// ============================================================
// INITIAL DOCTORS
// ============================================================

export const initialDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Abhishek Karmalkar',
    qualification: 'MD',
    specialization: 'Internal Medicine',
    experience: '12+ years',
    designation: 'Consultant Physician',
    department: 'Medicine',
    timing: 'Mon–Sat, 9am–1pm',
    fees: '₹500',
    description:
      'Specialist in internal medicine and general medical conditions.',
    photo:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&auto=format',
    active: true,
    order: 1,
  },

  {
    id: '2',
    name: 'Dr. Priya Bagade-Gowardhan',
    qualification: 'MS (OBG)',
    specialization: 'Gynaecology & Obstetrics',
    experience: '14+ years',
    designation: 'Consultant Gynaecologist',
    department: 'Gynaecology',
    timing: 'Mon–Sat, 10am–2pm',
    fees: '₹600',
    description:
      "Women's healthcare, gynaecological and obstetric services.",
    photo:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format',
    active: true,
    order: 2,
  },

  {
    id: '3',
    name: 'Dr. Ravikumar Wategaonkar',
    qualification: 'DM (Oncology)',
    specialization: 'Oncology',
    experience: '16+ years',
    designation: 'Senior Oncologist',
    department: 'Oncology',
    timing: 'Mon–Fri, 11am–3pm',
    fees: '₹800',
    description:
      'Specialist consultation and care for oncology patients.',
    photo:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&auto=format',
    active: true,
    order: 3,
  },

  {
    id: '4',
    name: 'Dr. Satishkumar Kolekar',
    qualification: 'DM (Cardiology)',
    specialization: 'Cardiology',
    experience: '18+ years',
    designation: 'Senior Cardiologist',
    department: 'Cardiology',
    timing: 'Mon–Sat, 9am–12pm',
    fees: '₹900',
    description:
      'Specialist cardiac consultation and diagnostic services.',
    photo:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&auto=format',
    active: true,
    order: 4,
  },

  {
    id: '5',
    name: 'Dr. Amitkumar Pande',
    qualification: 'DM (Neurology)',
    specialization: 'Neurology',
    experience: '15+ years',
    designation: 'Consultant Neurologist',
    department: 'Neurology',
    timing: 'Tue, Thu, Sat — 2pm–5pm',
    fees: '₹800',
    description:
      'Specialist consultation and management of neurological conditions.',
    photo:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&auto=format',
    active: true,
    order: 5,
  },

  {
    id: '6',
    name: 'Dr. Ajay Dombale',
    qualification: 'MS (Ortho)',
    specialization: 'Orthopaedics & Joint Replacement',
    experience: '13+ years',
    designation: 'Orthopaedic Surgeon',
    department: 'Orthopaedics',
    timing: 'Mon–Sat, 10am–1pm',
    fees: '₹600',
    description:
      'Specialises in joint replacement and orthopaedic surgeries.',
    photo:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&auto=format',
    active: true,
    order: 6,
  },

  {
    id: '7',
    name: 'Dr. Siddhesh Dhaygude',
    qualification: 'DM (Nephrology)',
    specialization: 'Nephrology',
    experience: '11+ years',
    designation: 'Nephrologist',
    department: 'Nephrology',
    timing: 'Mon–Fri, 3pm–6pm',
    fees: '₹700',
    description:
      'Specialist kidney care and nephrology services including dialysis.',
    photo:
      'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&auto=format',
    active: true,
    order: 7,
  },

  {
    id: '8',
    name: 'Dr. Atul Gowardhan',
    qualification: 'MS (Plastic Surgery)',
    specialization: 'Plastic & Cosmetic Surgery',
    experience: '14+ years',
    designation: 'Plastic Surgeon',
    department: 'Plastic Surgery',
    timing: 'Wed, Fri — 10am–2pm',
    fees: '₹700',
    description:
      'Plastic and cosmetic surgical services.',
    photo:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&auto=format',
    active: true,
    order: 8,
  },
];

// ============================================================
// INITIAL SERVICES
// ============================================================

export const initialServices: Service[] = [
  {
    id: '1',
    name: 'General Medicine',
    description:
      'Medical consultation, evaluation and management of general medical conditions.',
    icon: 'stethoscope',
    category: 'Speciality',
    image: '',
    active: true,
    order: 1,
  },

  {
    id: '2',
    name: 'General Surgery',
    description:
      'Surgical consultation and treatment for a range of general surgical conditions.',
    icon: 'syringe',
    category: 'Speciality',
    image: '',
    active: true,
    order: 2,
  },

  {
    id: '3',
    name: 'Orthopaedics',
    description:
      'Diagnosis and treatment of bone, joint and musculoskeletal conditions.',
    icon: 'bone',
    category: 'Speciality',
    image: '',
    active: true,
    order: 3,
  },

  {
    id: '4',
    name: 'Gynaecology & Obstetrics',
    description:
      "Women's healthcare, gynaecological and obstetric services.",
    icon: 'baby',
    category: 'Speciality',
    image: '',
    active: true,
    order: 4,
  },

  {
    id: '5',
    name: 'Cardiology',
    description:
      'Specialist cardiac consultation and diagnostic services.',
    icon: 'heart',
    category: 'Super-Speciality',
    image: '',
    active: true,
    order: 5,
  },

  {
    id: '6',
    name: 'Oncology',
    description:
      'Specialist consultation and care for oncology patients.',
    icon: 'shield',
    category: 'Super-Speciality',
    image: '',
    active: true,
    order: 6,
  },

  {
    id: '7',
    name: 'Neurology',
    description:
      'Specialist consultation and management of neurological conditions.',
    icon: 'brain',
    category: 'Super-Speciality',
    image: '',
    active: true,
    order: 7,
  },

  {
    id: '8',
    name: 'Nephrology',
    description:
      'Specialist kidney care and nephrology services.',
    icon: 'flask',
    category: 'Super-Speciality',
    image: '',
    active: true,
    order: 8,
  },

  {
    id: '9',
    name: 'Urology & Urosurgery',
    description:
      'Medical and surgical care for urological conditions.',
    icon: 'stethoscope',
    category: 'Super-Speciality',
    image: '',
    active: true,
    order: 9,
  },

  {
    id: '10',
    name: 'Gastroenterology',
    description:
      'Specialist care for gastrointestinal conditions.',
    icon: 'stethoscope',
    category: 'Super-Speciality',
    image: '',
    active: true,
    order: 10,
  },

  {
    id: '11',
    name: 'Neurosurgery',
    description:
      'Surgical services for neurological and neurosurgical conditions.',
    icon: 'brain',
    category: 'Super-Speciality',
    image: '',
    active: true,
    order: 11,
  },

  {
    id: '12',
    name: 'Plastic & Cosmetic Surgery',
    description:
      'Plastic and cosmetic surgical services.',
    icon: 'shield',
    category: 'Super-Speciality',
    image: '',
    active: true,
    order: 12,
  },

  {
    id: '13',
    name: 'Spine & Joint Replacement Surgery',
    description:
      'Specialist orthopaedic services for spine and joint conditions.',
    icon: 'bone',
    category: 'Super-Speciality',
    image: '',
    active: true,
    order: 13,
  },

  {
    id: '14',
    name: 'Physiotherapy',
    description:
      'Physiotherapy and rehabilitation services.',
    icon: 'dumbbell',
    category: 'Speciality',
    image: '',
    active: true,
    order: 14,
  },

  {
    id: '15',
    name: 'Dialysis',
    description:
      'Dialysis services for patients requiring renal care.',
    icon: 'flask',
    category: 'Facility',
    image: '',
    active: true,
    order: 15,
  },

  {
    id: '16',
    name: 'ICU & HDU',
    description:
      'Intensive Care Unit and High Dependency Unit for critical and enhanced monitoring.',
    icon: 'bed',
    category: 'Facility',
    image: '',
    active: true,
    order: 16,
  },

  {
    id: '17',
    name: 'Emergency & Trauma Care',
    description:
      'Accident, trauma and emergency services available 24 hours.',
    icon: 'emergency',
    category: 'Emergency',
    image: '',
    active: true,
    order: 17,
  },

  {
    id: '18',
    name: 'Diagnostic Services',
    description:
      'Pathology, X-Ray, CT Scan, Ultrasonography, ECG, Echo Doppler, Stress Test and Endoscopy.',
    icon: 'scan',
    category: 'Diagnostics',
    image: '',
    active: true,
    order: 18,
  },
];

// ============================================================
// INITIAL SPECIALITIES
// ============================================================

export const initialSpecialities: Speciality[] = [
  {
    id: '1',
    name: 'Cardiology',
    description:
      'Comprehensive cardiac care including consultation, diagnostics and intervention.',
    icon: 'heart',
    active: true,
    order: 1,
  },

  {
    id: '2',
    name: 'Neurology & Neurosurgery',
    description:
      'Medical and surgical management of neurological disorders.',
    icon: 'brain',
    active: true,
    order: 2,
  },

  {
    id: '3',
    name: 'Oncology',
    description:
      'Specialist cancer care and oncology consultation.',
    icon: 'shield',
    active: true,
    order: 3,
  },

  {
    id: '4',
    name: 'Orthopaedics & Joint Replacement',
    description:
      'Bone, joint and musculoskeletal care including joint replacement surgery.',
    icon: 'bone',
    active: true,
    order: 4,
  },

  {
    id: '5',
    name: 'Nephrology & Dialysis',
    description:
      'Kidney care, nephrology and dialysis services.',
    icon: 'flask',
    active: true,
    order: 5,
  },

  {
    id: '6',
    name: 'Gynaecology & Obstetrics',
    description:
      "Women's health, maternity and obstetric care.",
    icon: 'baby',
    active: true,
    order: 6,
  },

  {
    id: '7',
    name: 'Gastroenterology',
    description:
      'Specialist gastrointestinal and endoscopy services.',
    icon: 'stethoscope',
    active: true,
    order: 7,
  },

  {
    id: '8',
    name: 'Emergency & Critical Care',
    description:
      'ICU, HDU, casualty and 24-hour emergency services.',
    icon: 'emergency',
    active: true,
    order: 8,
  },
];

// ============================================================
// INITIAL SOCIAL POSTS
// ============================================================

export const initialSocialPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'youtube',
    postUrl: 'https://youtube.com',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail:
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop&auto=format',
    caption:
      'Expert talk on cardiac health and preventive cardiology by Dr. Satishkumar Kolekar.',
    date: '2026-08-20',
    active: true,
    order: 1,
  },

  {
    id: '2',
    platform: 'facebook',
    postUrl: 'https://facebook.com',
    embedUrl: '',
    thumbnail:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop&auto=format',
    caption:
      'Our orthopaedic team successfully performed 50+ joint replacement surgeries this quarter. Congratulations to the entire team!',
    date: '2026-08-15',
    active: true,
    order: 2,
  },

  {
    id: '3',
    platform: 'instagram',
    postUrl: 'https://instagram.com',
    embedUrl: '',
    thumbnail:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&auto=format',
    caption:
      'World Health Day at Vedant — free health checkup camp for the community. Thank you to all who participated!',
    date: '2026-08-10',
    active: true,
    order: 3,
  },

  {
    id: '4',
    platform: 'youtube',
    postUrl: 'https://youtube.com',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop&auto=format',
    caption:
      'Behind the scenes: our state-of-the-art modular operation theatres and ICU facilities.',
    date: '2026-07-28',
    active: true,
    order: 4,
  },
]