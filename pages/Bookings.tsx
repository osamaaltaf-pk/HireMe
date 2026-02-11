import React from 'react';
import { UserProfile, Booking, BookingStatus } from '../types';
import { Calendar, Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';

interface BookingsProps {
  user: UserProfile;
  bookings: Booking[];
  onNavigate: (page: string, params?: any) => void;
  onUpdateStatus?: (bookingId: string, status: BookingStatus) => void;
}

const Bookings: React.FC<BookingsProps> = ({ user, bookings, onNavigate, onUpdateStatus }) => {
  const isProviderView = user.currentRole === 'provider';

  // Filter bookings based on role
  const myBookings = bookings.filter(b => 
    isProviderView ? b.providerId === user.id : b.customerId === user.id
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleQuickAction = (e: React.MouseEvent, id: string, status: BookingStatus) => {
      e.stopPropagation();
      if (onUpdateStatus) onUpdateStatus(id, status);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold text-slate-900">
           {isProviderView ? 'Job Requests' : 'My Bookings'}
         </h1>
         <div className="text-sm text-slate-500">
           Showing {myBookings.length} {isProviderView ? 'jobs' : 'bookings'}
         </div>
      </div>

      {myBookings.length > 0 ? (
        <div className="space-y-4">
          {myBookings.map((booking) => (
            <div 
                key={booking.id} 
                onClick={() => onNavigate('booking-detail', { bookingId: booking.id })}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer group"
            >
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-start gap-4">
                     <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                        <Calendar size={20} />
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                             <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {isProviderView ? `Customer #${booking.customerId.substr(0,4)}` : booking.providerName}
                             </h3>
                             <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                        </div>
                        <p className="text-sm text-slate-500">
                           {booking.serviceCategory}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                           <span className="flex items-center gap-1"><Clock size={12}/> {booking.scheduledAt}</span>
                           {isProviderView && <span className="flex items-center gap-1"><MapPin size={12}/> {booking.address || 'Location provided'}</span>}
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                        {booking.status}
                     </span>
                     <span className="font-bold text-slate-900">Rs. {booking.totalPrice || 'Pending'}</span>
                  </div>
               </div>

               {/* Quick Action Buttons for Provider */}
               {isProviderView && booking.status === 'PENDING' && (
                 <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3 justify-end">
                    <button 
                        onClick={(e) => handleQuickAction(e, booking.id, BookingStatus.CANCELLED)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Reject
                    </button>
                    <button 
                        onClick={(e) => handleQuickAction(e, booking.id, BookingStatus.ACCEPTED)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Accept Job
                    </button>
                 </div>
               )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 border-dashed p-12 text-center">
            <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-slate-300 h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No bookings found</h3>
            <p className="text-slate-500 mt-2">
               {isProviderView ? "You haven't received any job requests yet." : "You haven't booked any services yet."}
            </p>
            {!isProviderView && (
                <button onClick={() => onNavigate('home')} className="mt-4 text-blue-600 font-medium hover:underline">
                    Find a Service
                </button>
            )}
        </div>
      )}
    </div>
  );
};

export default Bookings;