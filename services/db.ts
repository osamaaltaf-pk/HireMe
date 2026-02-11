import { UserProfile, ProviderDetails, Booking, Review, Message, BookingStatus } from '../types';
import { MOCK_PROVIDERS, MOCK_REVIEWS } from '../constants';

const KEYS = {
  USERS: 'hireme_users',
  PROVIDERS: 'hireme_providers', // Stores details for users who are providers
  BOOKINGS: 'hireme_bookings',
  REVIEWS: 'hireme_reviews',
  MESSAGES: 'hireme_messages',
};

// Helper to get data
const get = <T>(key: string, defaultVal: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

// Helper to set data
const set = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const db = {
  // --- USERS ---
  getUser: (email: string): UserProfile | undefined => {
    const users = get<UserProfile[]>(KEYS.USERS, []);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  saveUser: (user: UserProfile) => {
    const users = get<UserProfile[]>(KEYS.USERS, []);
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    set(KEYS.USERS, users);
  },

  // --- PROVIDERS ---
  getAllProviders: (): (ProviderDetails & { fullName: string })[] => {
    // Merge MOCK providers with Real User providers stored in LS
    const localProviders = get<(ProviderDetails & { fullName: string })[]>(KEYS.PROVIDERS, []);
    
    // De-duplicate by ID (Local overrides Mock if ID collision, though IDs should differ)
    const combined = [...localProviders, ...MOCK_PROVIDERS];
    
    // If a user updated their provider profile, we prioritize the local version
    const map = new Map();
    combined.forEach(p => map.set(p.id, p));
    return Array.from(map.values());
  },

  getProviderById: (id: string) => {
    return db.getAllProviders().find(p => p.id === id);
  },

  saveProviderDetails: (details: ProviderDetails & { fullName: string }) => {
    const providers = get<(ProviderDetails & { fullName: string })[]>(KEYS.PROVIDERS, []);
    const index = providers.findIndex(p => p.id === details.id);
    
    if (index >= 0) {
      providers[index] = { ...providers[index], ...details };
    } else {
      providers.push(details);
    }
    set(KEYS.PROVIDERS, providers);
  },

  // --- BOOKINGS ---
  getBookings: (): Booking[] => {
    return get<Booking[]>(KEYS.BOOKINGS, []);
  },

  createBooking: (booking: Booking) => {
    const bookings = get<Booking[]>(KEYS.BOOKINGS, []);
    bookings.unshift(booking); // Add to top
    set(KEYS.BOOKINGS, bookings);
    
    // Auto-send initial system message
    db.sendMessage({
      id: `msg_${Date.now()}`,
      bookingId: booking.id,
      senderId: 'system',
      content: `Booking created for ${booking.serviceCategory} on ${booking.scheduledAt}.`,
      timestamp: new Date().toISOString(),
      isRead: false
    });
  },

  updateBookingStatus: (bookingId: string, status: BookingStatus) => {
    const bookings = get<Booking[]>(KEYS.BOOKINGS, []);
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      set(KEYS.BOOKINGS, bookings);
      
      // Auto-message for status change
      db.sendMessage({
        id: `msg_${Date.now()}`,
        bookingId: booking.id,
        senderId: 'system',
        content: `Booking status updated to: ${status}`,
        timestamp: new Date().toISOString(),
        isRead: false
      });
    }
  },

  // --- MESSAGES ---
  getMessages: (bookingId: string): Message[] => {
    const messages = get<Message[]>(KEYS.MESSAGES, []);
    return messages.filter(m => m.bookingId === bookingId).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  },

  sendMessage: (message: Message) => {
    const messages = get<Message[]>(KEYS.MESSAGES, []);
    messages.push(message);
    set(KEYS.MESSAGES, messages);
  },

  // --- REVIEWS ---
  getReviews: (): Review[] => {
    const local = get<Review[]>(KEYS.REVIEWS, []);
    return [...local, ...MOCK_REVIEWS];
  },

  addReview: (review: Review) => {
    const reviews = get<Review[]>(KEYS.REVIEWS, []);
    reviews.push(review);
    set(KEYS.REVIEWS, reviews);
  }
};
