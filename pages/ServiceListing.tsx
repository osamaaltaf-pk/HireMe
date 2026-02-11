import React, { useState, useMemo } from 'react';
import { SERVICE_CATEGORIES, CITIES } from '../constants';
import { ProviderDetails } from '../types';
import { db } from '../services/db';
import { MapPin, Filter, Calendar, Check, X, ArrowRight, Sparkles, Map as MapIcon, List } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { ServiceMap } from '../components/ServiceMap';

interface ServiceListingProps {
  initialCategory?: string;
  initialTerm?: string;
  initialLocation?: string; // New prop from analysis
  onBook: (providerId: string, date: string) => void;
  userRole?: string;
  onNavigate?: (page: string, params: any) => void;
}

const ServiceListing: React.FC<ServiceListingProps> = ({ initialCategory, initialTerm, initialLocation, onBook, userRole }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>(initialTerm || '');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Booking Modal State
  const [bookingProvider, setBookingProvider] = useState<ProviderDetails & { fullName: string } | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  // Load providers from DB (combines Mocks + Real Users)
  const allProviders = db.getAllProviders();

  // Recommendation Logic (Weighted Ranking)
  const sortedProviders = useMemo(() => {
    // 1. Filter
    const filtered = allProviders.filter(provider => {
      const matchesCategory = selectedCategory === 'all' || provider.categories.includes(selectedCategory);
      const matchesCity = selectedCity === 'all' || provider.location.toLowerCase().includes(selectedCity.toLowerCase());
      
      const termLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
                            provider.fullName.toLowerCase().includes(termLower) || 
                            provider.bio.toLowerCase().includes(termLower) ||
                            provider.categories.some(c => c.includes(termLower)) ||
                            provider.location.toLowerCase().includes(termLower); // Search matches location text too
                            
      return matchesCategory && matchesCity && matchesSearch;
    });

    // 2. Rank/Sort based on Recommendation Score & Location Proximity
    return filtered.sort((a, b) => {
      let scoreA = (a.rating * 0.7) + (Math.log10(a.reviewCount + 1) * 0.3);
      let scoreB = (b.rating * 0.7) + (Math.log10(b.reviewCount + 1) * 0.3);

      // If a specific location term was detected (e.g. "Gulberg"), boost providers in that area
      if (initialLocation || searchTerm) {
         const locTerm = (initialLocation || searchTerm).toLowerCase();
         if (a.location.toLowerCase().includes(locTerm)) scoreA += 3.0; // Huge boost for location match
         if (b.location.toLowerCase().includes(locTerm)) scoreB += 3.0;
      }

      return scoreB - scoreA; // Descending
    });

  }, [selectedCategory, selectedCity, searchTerm, initialLocation, allProviders]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingProvider && bookingDate && bookingTime) {
      onBook(bookingProvider.id, `${bookingDate} ${bookingTime}`);
      setIsBookingSuccess(true);
      setTimeout(() => {
        setIsBookingSuccess(false);
        setBookingProvider(null);
      }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
            <div>
            <h1 className="text-2xl font-bold text-slate-900">Find Professionals</h1>
            {(initialTerm || initialLocation) && (
                <p className="text-sm text-slate-500 mt-1 flex items-center">
                <Sparkles size={14} className="text-blue-500 mr-1" /> 
                {initialLocation 
                    ? `Showing experts near "${initialLocation}" for "${initialTerm || 'service'}"` 
                    : `Recommended results for "${initialTerm}"`
                }
                </p>
            )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                <select 
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none hover:border-blue-300 transition-colors"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                >
                <option value="all">All Categories</option>
                {SERVICE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                <select 
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none hover:border-blue-300 transition-colors"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                >
                <option value="all">All Cities</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <List size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <MapIcon size={18} />
                </button>
            </div>
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
          {/* Main List / Grid */}
          <div className={`${viewMode === 'map' ? 'lg:w-1/2' : 'w-full'}`}>
             <div className={`grid grid-cols-1 ${viewMode === 'list' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-1'} gap-6`}>
                {sortedProviders.length > 0 ? (
                sortedProviders.map((provider, index) => (
                    <div key={provider.id} className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group relative ${viewMode === 'map' && bookingProvider?.id === provider.id ? 'ring-2 ring-blue-500' : ''}`}>
                    
                    {/* Recommendation Badge logic updated to include location */}
                    {index < 2 && (initialCategory || initialTerm || initialLocation) && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-100 to-transparent pl-4 pr-2 py-1 rounded-bl-xl z-10">
                        <span className="text-[10px] font-bold text-amber-700 flex items-center uppercase tracking-wide">
                            <Sparkles size={10} className="mr-1" /> Recommended
                        </span>
                        </div>
                    )}

                    <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <img src={provider.images && provider.images[0] ? provider.images[0] : `https://picsum.photos/seed/${provider.id}/100`} alt={provider.fullName} className="h-14 w-14 rounded-full object-cover border border-slate-100 mr-4 shadow-sm" />
                            <div>
                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{provider.fullName}</h3>
                            <div className="flex items-center text-xs text-slate-500 mt-1">
                                <MapPin size={12} className="mr-1" /> {provider.location}
                            </div>
                            </div>
                        </div>
                        {provider.verified && (
                            <span className="bg-blue-50 text-blue-600 p-1.5 rounded-full" title="Verified Provider">
                                <Check size={16} />
                            </span>
                        )}
                        </div>

                        <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {provider.categories.map(cat => (
                            <span key={cat} className="text-[10px] uppercase font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                {SERVICE_CATEGORIES.find(c => c.id === cat)?.name || cat}
                            </span>
                            ))}
                        </div>
                        <p className="text-slate-600 text-sm line-clamp-3">{provider.bio}</p>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-slate-500 mb-2">
                        <StarRating rating={provider.rating} count={provider.reviewCount} />
                        <div>•</div>
                        <div>{provider.experienceYears} yrs exp</div>
                        </div>
                    </div>

                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                        <span className="text-xs text-slate-500 block">Starting at</span>
                        <span className="text-lg font-bold text-slate-900">Rs. {provider.hourlyRate}<span className="text-sm font-normal text-slate-500">/hr</span></span>
                        </div>
                        <button 
                        onClick={() => setBookingProvider(provider)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm hover:shadow"
                        >
                        Book Now
                        </button>
                    </div>
                    </div>
                ))
                ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                    <div className="mx-auto h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Filter className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No providers found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search term.</p>
                    <button onClick={() => {setSearchTerm(''); setSelectedCategory('all'); setSelectedCity('all');}} className="mt-4 text-blue-600 font-medium hover:underline">Clear all filters</button>
                </div>
                )}
            </div>
          </div>

          {/* Map View Panel */}
          {viewMode === 'map' && (
              <div className="lg:w-1/2 h-[500px] sticky top-24">
                  <ServiceMap 
                    providers={sortedProviders} 
                    selectedProviderId={bookingProvider?.id} 
                    onMarkerClick={(id) => {
                        const p = sortedProviders.find(p => p.id === id);
                        if(p) setBookingProvider(p);
                    }}
                  />
              </div>
          )}
      </div>

      {/* Booking Modal Overlay */}
      {bookingProvider && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
             {isBookingSuccess ? (
               <div className="p-10 text-center">
                  <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Requested!</h3>
                  <p className="text-slate-600">The provider has been notified. Check your dashboard for updates.</p>
               </div>
             ) : (
               <>
                 <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">Book Service</h3>
                      <p className="text-blue-100 text-sm">with {bookingProvider.fullName}</p>
                    </div>
                    <button onClick={() => setBookingProvider(null)} className="text-blue-200 hover:text-white">
                      <X size={20} />
                    </button>
                 </div>
                 
                 <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                    {!userRole && (
                      <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm mb-4">
                        You are booking as a guest. Please login to manage bookings.
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Select Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                          type="date" 
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Select Time</label>
                      <select 
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                      >
                        <option value="">-- Select Time Slot --</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex justify-between mb-2 text-sm">
                         <span className="text-slate-600">Hourly Rate</span>
                         <span className="font-medium">Rs. {bookingProvider.hourlyRate}</span>
                      </div>
                      <div className="flex justify-between mb-4 text-sm">
                         <span className="text-slate-600">Platform Fee (10%)</span>
                         <span className="font-medium">Rs. {Math.round(bookingProvider.hourlyRate * 0.1)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-slate-900">
                         <span>Estimated Total</span>
                         <span>Rs. {Math.round(bookingProvider.hourlyRate * 1.1)}</span>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                      Confirm Booking
                    </button>
                 </form>
               </>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceListing;