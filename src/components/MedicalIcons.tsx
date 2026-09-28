import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Ambulance,
  ArrowRight,
  Baby,
  BarChart3,
  BedDouble,
  Brain,
  BriefcaseMedical,
  Building2,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Cross,
  Dumbbell,
  FlaskConical,
  Globe,
  Heart,
  HeartPulse,
  Hospital,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Microscope,
  MonitorHeart,
  Newspaper,
  Phone,
  Pill,
  ScanHeart,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Stethoscope,
  Syringe,
  UserRound,
  Users,
  X,
} from 'lucide-react';

export type MedicalIconName =
  | 'home'
  | 'about'
  | 'services'
  | 'doctors'
  | 'specialities'
  | 'contact'
  | 'appointment'
  | 'menu'
  | 'phone'
  | 'location'
  | 'mail'
  | 'clock'
  | 'emergency'
  | 'care'
  | 'experience'
  | 'hospital'
  | 'facility'
  | 'ambulance'
  | 'doctor'
  | 'department'
  | 'stethoscope'
  | 'heart'
  | 'brain'
  | 'bone'
  | 'baby'
  | 'syringe'
  | 'flask'
  | 'scan'
  | 'pulse'
  | 'bed'
  | 'dumbbell'
  | 'pill'
  | 'shield'
  | 'check'
  | 'x'
  | 'calendar'
  | 'arrow-right'
  | 'search'
  | 'globe'
  | 'settings'
  | 'logout'
  | 'dashboard'
  | 'newspaper'
  | 'image'
  | 'users'
  | 'briefcase-medical';

const iconMap: Record<MedicalIconName, LucideIcon> = {
  home: Building2,
  about: Hospital,
  services: BriefcaseMedical,
  doctors: Users,
  specialities: ShieldCheck,
  contact: MapPin,
  appointment: CalendarDays,
  menu: Menu,
  phone: Phone,
  location: MapPin,
  mail: Mail,
  clock: Clock3,
  emergency: Siren,
  care: HeartPulse,
  experience: Activity,
  hospital: Hospital,
  facility: Building2,
  ambulance: Ambulance,
  doctor: UserRound,
  department: Building2,
  stethoscope: Stethoscope,
  heart: Heart,
  brain: Brain,
  bone: Activity,
  baby: Baby,
  syringe: Syringe,
  flask: FlaskConical,
  scan: ScanLine,
  pulse: HeartPulse,
  bed: BedDouble,
  dumbbell: Dumbbell,
  pill: Pill,
  shield: ShieldCheck,
  check: Check,
  x: X,
  calendar: CalendarDays,
  'arrow-right': ArrowRight,
  search: Search,
  globe: Globe,
  settings: Settings,
  logout: LogOut,
  dashboard: LayoutDashboard,
  newspaper: Newspaper,
  image: ImageIcon,
  users: Users,
  'briefcase-medical': BriefcaseMedical,
};

export function MedicalIcon({
  name,
  size = 18,
  className = '',
  strokeWidth = 2,
  color,
}: {
  name: MedicalIconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  color?: string;
}) {
  const Icon = iconMap[name] ?? BriefcaseMedical;
  return <Icon size={size} className={className} strokeWidth={strokeWidth} color={color} />;
}

const serviceLookup: Record<string, MedicalIconName> = {
  general: 'stethoscope',
  medicine: 'stethoscope',
  surgery: 'syringe',
  orthopaedics: 'bone',
  cardiology: 'heart',
  neurology: 'brain',
  oncology: 'shield',
  nephrology: 'flask',
  gynaecology: 'baby',
  emergency: 'emergency',
  diagnostics: 'scan',
  pathology: 'flask',
  radiology: 'scan',
  pharmacy: 'pill',
  physiotherapy: 'dumbbell',
  dialysis: 'flask',
  default: 'briefcase-medical',
};

const facilityLookup: Record<string, MedicalIconName> = {
  icu: 'bed',
  hdu: 'bed',
  modular: 'hospital',
  dialysis: 'flask',
  pathology: 'flask',
  xray: 'scan',
  ct: 'scan',
  ultrasonography: 'scan',
  ecg: 'pulse',
  echo: 'heart',
  stress: 'heart',
  endoscopy: 'scan',
  casualty: 'emergency',
  pharmacy: 'pill',
  ambulance: 'ambulance',
  physiotherapy: 'dumbbell',
  default: 'hospital',
};

export const getServiceIcon = (name: string): MedicalIconName => {
  const normalized = name.toLowerCase();
  const direct = Object.keys(serviceLookup).find((key) => normalized.includes(key));
  return direct ? serviceLookup[direct] : serviceLookup.default;
};

export const getFacilityIcon = (name: string): MedicalIconName => {
  const normalized = name.toLowerCase();
  const direct = Object.keys(facilityLookup).find((key) => normalized.includes(key));
  return direct ? facilityLookup[direct] : facilityLookup.default;
};

export const getSpecialityIcon = (name: string): MedicalIconName => {
  const lower = name.toLowerCase();
  if (lower.includes('cardi')) return 'heart';
  if (lower.includes('neuro')) return 'brain';
  if (lower.includes('ortho')) return 'bone';
  if (lower.includes('gyn')) return 'baby';
  if (lower.includes('pedi')) return 'baby';
  if (lower.includes('surg')) return 'syringe';
  if (lower.includes('path')) return 'flask';
  if (lower.includes('radio')) return 'scan';
  if (lower.includes('pharm')) return 'pill';
  if (lower.includes('physio')) return 'dumbbell';
  if (lower.includes('medic')) return 'stethoscope';
  if (lower.includes('general')) return 'stethoscope';
  return 'shield';
};

export const getInlineIcon = (name: MedicalIconName, className = '', size = 18) => (
  <MedicalIcon name={name} size={size} className={className} />
);

export const iconColor = {
  navy: '#0B2D4D',
  teal: '#0F6B78',
  darkTeal: '#075563',
  gold: '#D4A72C',
  muted: '#64748B',
  white: '#FFFFFF',
};

export const iconButtonStyle = {
  iconWrapper: 'inline-flex items-center justify-center rounded-full border border-current/10 bg-white/5',
};
