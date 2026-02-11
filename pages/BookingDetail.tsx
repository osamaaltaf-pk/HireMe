
import React, { useState } from 'react';
import { Booking, BookingStatus, UserProfile } from '../types';
import { Calendar, Clock, MapPin, MessageSquare, CheckCircle, AlertTriangle, FileText, XCircle, ArrowLeft, ShieldCheck, FileCheck, Phone } from 'lucide-react';
import { ReviewModal } from '../components/ReviewModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { UpgradeModal } from '../components/UpgradeModal';

interface BookingDetailProps {
  booking: Booking;
  user: UserProfile;
  onNavigate: (page: string, params?: any) => void;
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onAddReview: (bookingId: string, rating: number, comment: string) => void;
}

const BookingDetail: React.FC<BookingDetailProps> = ({ booking, user, onNavigate, onUpdateStatus, onAddReview }) => {
  const isProvider = user.currentRole === 'provider';
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.PENDING: return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">Pending</span>;
        case BookingStatus.ACCEPTED: return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">Accepted</span>;
        case BookingStatus.IN_PROGRESS: return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">In Progress</span>;
        case BookingStatus.COMPLETED: return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">Completed</span>;
        case BookingStatus.CANCELLED: return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">Cancelled</span>;
        default: return null;
    }
  };

  const steps = [
      { status: BookingStatus.PENDING, label: 'Requested' },
      { status: BookingStatus.ACCEPTED, label: 'Accepted' },
      { status: BookingStatus.IN_PROGRESS, label: 'In Progress' },
      { status: BookingStatus.COMPLETED, label: 'Completed' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === booking.status);
  
  // Handling review submission
  const handleReviewSubmit = (rating: number, comment: string) => {
      onAddReview(booking.id, rating, comment);
      // In a real app, we would update the booking to reflect it has been reviewed
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => onNavigate('bookings')} className="flex items-center text-slate-500 hover:text-slate-900 mb-6">
          <ArrowLeft size={20} className="mr-2" /> Back to Bookings
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
                <h1 className="text-xl font-bold text-slate-900 mb-1">
                    {booking.serviceCategory} Service
                </h1>
                <p className="text-sm text-slate-500">Booking ID: #{booking.id.toUpperCase()}</p>
            </div>
            {getStatusBadge(booking.status)}
        </div>

        {/* Progress Bar (Only for active flows) */}
        {booking.status !== BookingStatus.CANCELLED && (
            <div className="px-6 py-8 border-b border-slate-100">
                <div className="relative flex justify-between">
                    {/* Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
                    
                    {steps.map((step, idx) => {
                        const isCompleted = idx <= (currentStepIndex === -1 && booking.status === BookingStatus.COMPLETED ? 3 : currentStepIndex); // Handle finished state
                        const isCurrent = idx === currentStepIndex;

                        return (
                            <div key={step.label} className="relative z-10 flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                                    isCompleted || isCurrent ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-300'
                                }`}>
                                    {isCompleted ? <CheckCircle size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                </div>
                                <span className={`text-xs mt-2 font-medium ${isCompleted || isCurrent ? 'text-blue-900' : 'text-slate-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Details Column */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Service Details</h3>
                    <div className="space-y-3">
                        <div className="flex items-center text-slate-600">
                            <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                            <span>{booking.scheduledAt.split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center text-slate-600">
                            <Clock className="w-5 h-5 mr-3 text-slate-400" />
                            <span>{booking.scheduledAt.split(' ')[1] || 'TBD'} {booking.scheduledAt.split(' ')[2]}</span>
                        </div>
                        <div className="flex items-center text-slate-600">
                            <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                            <span>{booking.address || 'Location Shared'}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                        {isProvider ? 'Customer' : 'Provider'}
                    </h3>
                    <div className="flex items-center">
                        <div className="h-12 w-12 bg-slate-200 rounded-full mr-3 flex items-center justify-center text-slate-500 font-bold text-lg">
                            {isProvider ? 'C' : booking.providerName[0]}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">
                                {isProvider ? `Customer #${booking.customerId.substr(0,4)}` : booking.providerName}
                            </p>
                            {isProvider ? (
                                <p className="text-xs text-slate-500">Verified Client</p>
                            ) : (
                                <p className="text-xs text-blue-600 flex items-center"><ShieldCheck size={12} className="mr-1"/> Verified Pro</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions / Pricing Column */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Payment Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Service Fee</span>
                            <span>Rs. {booking.totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Platform Fee</span>
                            <span>Rs. {Math.round(booking.totalPrice * 0.1)}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-lg text-slate-900">
                            <span>Total</span>
                            <span>Rs. {Math.round(booking.totalPrice * 1.1)}</span>
                        </div>
                    </div>
                    {booking.status === BookingStatus.COMPLETED ? (
                         <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">PAID</span>
                            <button onClick={() => setIsInvoiceOpen(true)} className="text-xs text-blue-600 hover:underline flex items-center">
                               <FileCheck size={14} className="mr-1" /> View Invoice
                            </button>
                         </div>
                    ) : (
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-white p-2 rounded border border-slate-100">
                            <AlertTriangle size={14} className="text-amber-500" />
                            Payment is released after completion.
                        </div>
                    )}
                </div>

                <div className="mt-6 space-y-3">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => onNavigate('messages', { bookingId: booking.id })}
                            className="flex-grow flex items-center justify-center py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
                        >
                            <MessageSquare size={18} className="mr-2" /> Message
                        </button>
                        <button 
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="w-12 flex items-center justify-center border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                            title="Call Now"
                        >
                            <Phone size={18} />
                        </button>
                    </div>

                    {/* Provider Actions */}
                    {isProvider && booking.status === BookingStatus.PENDING && (
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => onUpdateStatus(booking.id, BookingStatus.CANCELLED)}
                                className="py-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg"
                            >
                                Reject
                            </button>
                            <button 
                                onClick={() => onUpdateStatus(booking.id, BookingStatus.ACCEPTED)}
                                className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                            >
                                Accept Job
                            </button>
                        </div>
                    )}

                    {isProvider && booking.status === BookingStatus.ACCEPTED && (
                        <button 
                            onClick={() => onUpdateStatus(booking.id, BookingStatus.IN_PROGRESS)}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                        >
                            Start Job
                        </button>
                    )}

                    {isProvider && booking.status === BookingStatus.IN_PROGRESS && (
                        <button 
                            onClick={() => onUpdateStatus(booking.id, BookingStatus.COMPLETED)}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                        >
                            Mark Completed
                        </button>
                    )}

                    {/* Customer Actions */}
                    {!isProvider && booking.status === BookingStatus.PENDING && (
                        <button 
                            onClick={() => onUpdateStatus(booking.id, BookingStatus.CANCELLED)}
                            className="w-full py-2.5 border border-red-200 bg-white hover:bg-red-50 text-red-600 font-medium rounded-lg"
                        >
                            Cancel Request
                        </button>
                    )}

                    {!isProvider && booking.status === BookingStatus.COMPLETED && (
                        <button 
                            onClick={() => setIsReviewOpen(true)}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center justify-center"
                        >
                            <FileText size={18} className="mr-2" /> Write a Review
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>

      <ReviewModal 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
        onSubmit={handleReviewSubmit}
        providerName={booking.providerName}
      />
      
      <InvoiceModal 
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        booking={booking}
      />

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
        userRole={user.currentRole}
      />
    </div>
  );
};

export default BookingDetail;
