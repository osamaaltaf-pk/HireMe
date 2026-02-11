import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ServiceListing from './pages/ServiceListing';
import ProviderProfile from './pages/ProviderProfile';
import Bookings from './pages/Bookings';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import BookingDetail from './pages/BookingDetail';
import { UserProfile, Booking, BookingStatus, Review } from './types';
import { db } from './services/db';

const App: React.FC = () => {
  // Simple Router State
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<any>({});
  
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);

  // Global Data State (Sync with DB)
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load initial data
  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('hireme_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Refresh user from DB to get latest role/status
      const dbUser = db.getUser(parsedUser.email);
      setUser(dbUser || parsedUser);
    }
    
    // Load bookings from DB
    refreshBookings();
  }, []);

  const refreshBookings = () => {
    setBookings(db.getBookings());
  };

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('hireme_user', JSON.stringify(newUser));
    refreshBookings();
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hireme_user');
    setCurrentPage('home');
  };

  const handleToggleRole = () => {
    if (!user) return;
    const newRole: 'customer' | 'provider' = user.currentRole === 'customer' ? 'provider' : 'customer';
    const updatedUser: UserProfile = { ...user, currentRole: newRole };
    
    // Update locally and in DB
    setUser(updatedUser);
    db.saveUser(updatedUser);
    localStorage.setItem('hireme_user', JSON.stringify(updatedUser));
    
    // Redirect logic when switching roles
    if (newRole === 'provider') {
       setCurrentPage('bookings'); // Providers usually check jobs first
    } else {
       setCurrentPage('home'); // Customers go to home
    }
  };

  const handleBecomeProvider = () => {
     if (!user) return;
     const updatedUser: UserProfile = { ...user, isProvider: true, currentRole: 'provider' };
     
     setUser(updatedUser);
     db.saveUser(updatedUser);
     localStorage.setItem('hireme_user', JSON.stringify(updatedUser));
     
     // Initialize default provider profile in DB if not exists
     const existingProfile = db.getProviderById(user.id);
     if (!existingProfile) {
        db.saveProviderDetails({
             id: user.id,
             fullName: user.fullName,
             bio: "I am a new provider on HireMe.",
             hourlyRate: 1000,
             verified: false,
             categories: ['cleaning'],
             rating: 0,
             reviewCount: 0,
             location: 'Lahore',
             coordinates: { lat: 31.5204, lng: 74.3587 },
             experienceYears: 1,
             serviceRadius: 10,
             images: [],
             joinedAt: new Date().toISOString().split('T')[0]
        });
     }

     setCurrentPage('profile'); // Go to profile to edit details
  };

  const handleNavigate = (page: string, params: any = {}) => {
    // Auth Guard
    if (['bookings', 'messages', 'profile', 'booking-detail'].includes(page) && !user) {
        setCurrentPage('auth');
        return;
    }
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const handleBook = (providerId: string, scheduledAt: string) => {
    if (!user) {
        handleNavigate('auth');
        return;
    }

    const provider = db.getProviderById(providerId);

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      customerId: user.id,
      customerName: user.fullName,
      providerId,
      providerName: provider ? provider.fullName : 'Unknown Provider',
      serviceCategory: provider?.categories[0] || 'General',
      status: BookingStatus.PENDING,
      scheduledAt,
      totalPrice: provider ? provider.hourlyRate : 0,
      address: user.location || 'Gulberg III, Lahore' // Mock address
    };

    db.createBooking(newBooking);
    refreshBookings();
    handleNavigate('booking-detail', { bookingId: newBooking.id });
  };

  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    db.updateBookingStatus(bookingId, status);
    refreshBookings();
  };

  const handleAddReview = (bookingId: string, rating: number, comment: string) => {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking || !user) return;

      const newReview: Review = {
          id: `rev_${Date.now()}`,
          providerId: booking.providerId,
          reviewerName: user.fullName,
          rating,
          comment,
          date: new Date().toISOString().split('T')[0]
      };
      
      db.addReview(newReview);
      alert('Review submitted successfully!');
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onNavigate={handleNavigate}
      onToggleRole={handleToggleRole}
      activePage={currentPage}
    >
      {currentPage === 'home' && (
        <Home onNavigate={handleNavigate} />
      )}
      
      {currentPage === 'auth' && (
        <Auth onLogin={handleLogin} />
      )}
      
      {/* Route 'explore' to ServiceListing as well */}
      {(currentPage === 'services' || currentPage === 'explore') && (
        <ServiceListing 
          initialCategory={pageParams.categoryId} 
          initialTerm={pageParams.term}
          initialLocation={pageParams.initialLocation}
          onBook={handleBook}
          userRole={user?.currentRole}
          onNavigate={handleNavigate}
        />
      )}
      
      {currentPage === 'provider-profile' && (
        <ProviderProfile 
          providerId={pageParams.providerId}
          onNavigate={handleNavigate}
          onBook={handleBook}
          isGuest={!user}
        />
      )}
      
      {currentPage === 'bookings' && user && (
        <Bookings 
            user={user} 
            bookings={bookings} 
            onNavigate={handleNavigate} 
            onUpdateStatus={handleUpdateBookingStatus}
        />
      )}

      {currentPage === 'booking-detail' && user && (
          <BookingDetail 
             booking={bookings.find(b => b.id === pageParams.bookingId)!} 
             user={user}
             onNavigate={handleNavigate}
             onUpdateStatus={handleUpdateBookingStatus}
             onAddReview={handleAddReview}
          />
      )}
      
      {currentPage === 'messages' && user && (
        <Messages user={user} bookings={bookings} />
      )}
      
      {currentPage === 'profile' && user && (
        <Profile 
          user={user} 
          onLogout={handleLogout} 
          onBecomeProvider={handleBecomeProvider}
        />
      )}
    </Layout>
  );
};

export default App;