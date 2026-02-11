
import React, { useState } from 'react';
import { MOCK_PROVIDERS, MOCK_REVIEWS } from '../constants';
import { Booking, BookingStatus } from '../types';
import { StarRating } from '../components/StarRating';
import { MapPin, ShieldCheck, Clock, Calendar, ChevronLeft, Share2, Heart, Award, Phone } from 'lucide-react';
import { UpgradeModal } from '../components/UpgradeModal';

interface ProviderProfileProps {
  providerId: string;
  onNavigate: (page: string, params?: any) => void;
  onBook: (providerId: string, scheduledAt: string) => void;
  isGuest: boolean;
}

const ProviderProfile: React.FC<ProviderProfileProps> = ({ providerId, onNavigate, onBook, isGuest }) => {
  const provider = MOCK_PROVIDERS.find(p => p.id === providerId);
  const reviews = MOCK_REVIEWS.filter(r => r.providerId === providerId);

  // Mock booking state for the modal
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');

  if (!provider) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-lg text-slate-500">Provider not found.</p>
            <button onClick={() => onNavigate('home')} className="mt-4 text-blue-600 hover:underline">Go Home</button>
        </div>
    );
  }

  const handleBook = () => {
      onBook(provider.id, `${date} ${time}`);
      setIsBookingModalOpen(false);
      alert('Booking request sent!'); // Replace with toast later
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Header / Cover */}
      <div className="relative h-48 bg-blue-600">
         <button onClick={() => onNavigate('services')} className="absolute top-6 left-6 text-white bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition-colors">
            <ChevronLeft size={24} />
         </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 md:p-8">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                     <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                        <img 
                          src={`https://picsum.photos/seed/${provider.id}/200`} 
                          alt={provider.fullName} 
                          className="h-full w-full rounded-full object-cover" 
                        />
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-900">{provider.fullName}</h1>
                            {provider.verified && (
                                <span title="Verified Professional">
                                  <ShieldCheck className="text-blue-600 h-5 w-5" />
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm flex items-center mt-1">
                            <MapPin size={14} className="mr-1" /> {provider.location} • {provider.experienceYears} Years Exp.
                        </p>
                        <div className="mt-2">
                             <StarRating rating={provider.rating} count={provider.reviewCount} />
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                     <button 
                       onClick={() => setIsUpgradeModalOpen(true)}
                       className="flex-1 md:flex-none py-2.5 px-4 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg font-bold hover:bg-blue-100 flex items-center justify-center gap-2 transition-colors"
                     >
                        <Phone size={18} /> Call
                     </button>
                     <button className="flex-1 md:flex-none py-2.5 px-4 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                        <Share2 size={18} /> Share
                     </button>
                     <button className="flex-1 md:flex-none py-2.5 px-4 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                        <Heart size={18} /> Save
                     </button>
                  </div>
               </div>

               <hr className="my-6 border-slate-100" />

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Details */}
                  <div className="lg:col-span-2 space-y-8">
                     <section>
                        <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
                        <p className="text-slate-600 leading-relaxed">{provider.bio}</p>
                     </section>

                     <section>
                         <h2 className="text-lg font-bold text-slate-900 mb-4">Photos</h2>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {provider.images && provider.images.length > 0 ? (
                                provider.images.map((img, i) => (
                                    <img key={i} src={img} alt="Work sample" className="rounded-lg h-32 w-full object-cover border border-slate-100" />
                                ))
                            ) : (
                                [1,2,3].map(n => (
                                    <div key={n} className="bg-slate-100 rounded-lg h-32 w-full flex items-center justify-center text-slate-400 text-xs">No Image</div>
                                ))
                            )}
                         </div>
                     </section>

                     <section>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Reviews</h2>
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-slate-900">{review.reviewerName}</span>
                                        <span className="text-xs text-slate-400">{review.date}</span>
                                    </div>
                                    <StarRating rating={review.rating} showCount={false} size={14} />
                                    <p className="text-slate-600 text-sm mt-2">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                     </section>
                  </div>

                  {/* Right Column: Booking Card */}
                  <div>
                      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 sticky top-24">
                          <div className="flex justify-between items-baseline mb-6">
                              <span className="text-slate-500 font-medium">Hourly Rate</span>
                              <span className="text-2xl font-bold text-slate-900">Rs. {provider.hourlyRate}</span>
                          </div>
                          
                          <div className="space-y-3 mb-6">
                             <div className="flex items-start gap-3 text-sm text-slate-600">
                                <Award className="h-5 w-5 text-blue-600 shrink-0" />
                                <span>Verified License & Registration</span>
                             </div>
                             <div className="flex items-start gap-3 text-sm text-slate-600">
                                <Clock className="h-5 w-5 text-blue-600 shrink-0" />
                                <span>Responds in ~30 mins</span>
                             </div>
                          </div>

                          <button 
                            onClick={() => setIsBookingModalOpen(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-200 transition-all hover:shadow-lg active:scale-[0.98]"
                          >
                             Request Booking
                          </button>
                          
                          <p className="text-center text-xs text-slate-400 mt-4">You won't be charged yet</p>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
        userRole="customer"
      />

      {/* Booking Modal */}
      {isBookingModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                 <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Schedule Service</h3>
                    <button onClick={() => setIsBookingModalOpen(false)}><ChevronLeft className="rotate-180" /></button>
                 </div>
                 <div className="p-6 space-y-4">
                    {!isGuest && (
                        <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded-lg">
                           Please login to complete booking.
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                        <input type="date" className="w-full border rounded-lg p-2" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                        <select className="w-full border rounded-lg p-2" value={time} onChange={e => setTime(e.target.value)}>
                            <option value="">Select Time</option>
                            <option>10:00 AM</option>
                            <option>02:00 PM</option>
                            <option>04:00 PM</option>
                        </select>
                    </div>
                    <button onClick={handleBook} disabled={!date || !time} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-4 disabled:opacity-50">Confirm</button>
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default ProviderProfile;
