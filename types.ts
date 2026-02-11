export type UserRole = 'customer' | 'provider' | 'admin';

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  avatarUrl?: string;
  location?: string;
  
  // Unified Account Fields
  isProvider: boolean;      // Does this user have a provider profile?
  currentRole: 'customer' | 'provider'; // Which view is currently active?
}

export interface ProviderDetails {
  id: string; // Matches UserProfile id
  bio: string;
  hourlyRate: number;
  verified: boolean;
  categories: string[];
  rating: number;
  reviewCount: number;
  location: string;
  coordinates: { lat: number; lng: number }; 
  experienceYears: number;
  serviceRadius: number;
  images: string[];
  joinedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string; // Icon name
  description: string;
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  providerName: string; // Cached for display
  customerName?: string; // Cached for display
  serviceCategory: string;
  status: BookingStatus;
  scheduledAt: string;
  totalPrice: number;
  description?: string;
  address?: string;
}

export interface Review {
  id: string;
  providerId: string;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}