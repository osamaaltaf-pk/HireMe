import { ServiceCategory, ProviderDetails, Review } from './types';

export const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'plumbing', name: 'Plumbing', icon: 'Wrench', description: 'Leak repairs, pipe fitting, and installation.' },
  { id: 'electrical', name: 'Electrical', icon: 'Zap', description: 'Wiring, appliance repair, and maintenance.' },
  { id: 'ac_repair', name: 'AC Repair', icon: 'Thermometer', description: 'AC servicing, gas refill, and installation.' },
  { id: 'cleaning', name: 'Home Cleaning', icon: 'Sparkles', description: 'Deep cleaning, sofa cleaning, and janitorial services.' },
  { id: 'auto_mechanic', name: 'Auto Mechanic', icon: 'Car', description: 'Car repair, oil change, and diagnostics.' },
  { id: 'home_tutor', name: 'Home Tutor', icon: 'BookOpen', description: 'K-12 tuition, O/A Levels, and test prep.' },
];

export const MOCK_PROVIDERS: (ProviderDetails & { fullName: string })[] = [
  {
    id: 'prov_1',
    fullName: 'Ahmed Ali',
    bio: 'Certified plumber with 10 years of experience in residential and commercial plumbing. Expert in leak detection.',
    hourlyRate: 1500,
    verified: true,
    categories: ['plumbing'],
    rating: 4.8,
    reviewCount: 42,
    location: 'Gulberg, Lahore',
    coordinates: { lat: 31.5204, lng: 74.3587 },
    experienceYears: 10,
    serviceRadius: 10,
    images: ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400'],
    joinedAt: '2022-01-15'
  },
  {
    id: 'prov_2',
    fullName: 'Fast Fix Electrics (Bilal)',
    bio: 'Professional electrician available for emergency repairs. Specializing in UPS installation and wiring.',
    hourlyRate: 2000,
    verified: true,
    categories: ['electrical'],
    rating: 4.5,
    reviewCount: 156,
    location: 'Clifton, Karachi',
    coordinates: { lat: 24.8270, lng: 67.0251 },
    experienceYears: 5,
    serviceRadius: 15,
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400'],
    joinedAt: '2022-03-10'
  },
  {
    id: 'prov_3',
    fullName: 'Sana Housekeeping',
    bio: 'Reliable and trustworthy cleaning services for your home. We bring our own supplies.',
    hourlyRate: 1000,
    verified: false,
    categories: ['cleaning'],
    rating: 4.9,
    reviewCount: 20,
    location: 'F-10, Islamabad',
    coordinates: { lat: 33.6938, lng: 73.0169 },
    experienceYears: 3,
    serviceRadius: 5,
    images: ['https://images.unsplash.com/photo-1581578731117-10d52143b0d8?auto=format&fit=crop&q=80&w=400'],
    joinedAt: '2023-05-20'
  },
  {
    id: 'prov_4',
    fullName: 'Cool Breeze AC',
    bio: 'Expert AC technicians for Split and Window ACs. Summer special rates available.',
    hourlyRate: 2500,
    verified: true,
    categories: ['ac_repair'],
    rating: 4.6,
    reviewCount: 89,
    location: 'DHA Phase 6, Lahore',
    coordinates: { lat: 31.4725, lng: 74.4564 },
    experienceYears: 8,
    serviceRadius: 20,
    images: ['https://images.unsplash.com/photo-1621905252507-b35a830ce592?auto=format&fit=crop&q=80&w=400'],
    joinedAt: '2021-11-01'
  },
  {
    id: 'prov_5',
    fullName: 'Master Mechanic Junaid',
    bio: 'On-spot car repair and diagnostics. I come to you.',
    hourlyRate: 3000,
    verified: true,
    categories: ['auto_mechanic'],
    rating: 4.7,
    reviewCount: 33,
    location: 'Bahria Town, Rawalpindi',
    coordinates: { lat: 33.5253, lng: 73.1343 },
    experienceYears: 12,
    serviceRadius: 25,
    images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400'],
    joinedAt: '2020-08-15'
  },
  {
    id: 'prov_6',
    fullName: 'Gulberg AC Expert',
    bio: 'Specialist in Inverter ACs. Located right in Main Market Gulberg.',
    hourlyRate: 1800,
    verified: true,
    categories: ['ac_repair'],
    rating: 4.9,
    reviewCount: 12,
    location: 'Gulberg, Lahore',
    coordinates: { lat: 31.5204, lng: 74.3587 }, // Same as Gulberg
    experienceYears: 4,
    serviceRadius: 8,
    images: ['https://images.unsplash.com/photo-1581094794329-cd109c0f01d9?auto=format&fit=crop&q=80&w=400'],
    joinedAt: '2023-01-01'
  }
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', providerId: 'prov_1', reviewerName: 'Hassan R.', rating: 5, comment: 'Excellent work, fixed the leak in minutes.', date: '2023-10-15' },
  { id: 'r2', providerId: 'prov_1', reviewerName: 'Fatima Z.', rating: 4, comment: 'Good work but arrived slightly late.', date: '2023-09-22' },
  { id: 'r3', providerId: 'prov_2', reviewerName: 'Usman K.', rating: 5, comment: 'Very professional, knew exactly what was wrong with the UPS.', date: '2023-11-05' },
];