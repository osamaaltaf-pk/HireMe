
import React from 'react';
import { Booking } from '../types';
import { X, Printer } from 'lucide-react';
import { Logo } from './Logo';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen) return null;

  const platformFee = Math.round(booking.totalPrice * 0.10);
  const total = Math.round(booking.totalPrice + platformFee);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <Logo className="text-blue-600 h-8 w-8" />
                 <span className="text-xl font-bold text-slate-900 tracking-tight">HireMe Invoice</span>
              </div>
              <p className="text-xs text-slate-500">Receipt #{booking.id.toUpperCase()}</p>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
           </button>
        </div>

        <div className="p-8">
           <div className="flex justify-between mb-8">
              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Bill To</h4>
                 <p className="font-bold text-slate-900">{booking.customerName || 'Customer'}</p>
                 <p className="text-sm text-slate-500">{booking.address}</p>
              </div>
              <div className="text-right">
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Provider</h4>
                 <p className="font-bold text-slate-900">{booking.providerName}</p>
                 <p className="text-sm text-slate-500">{booking.serviceCategory} Service</p>
              </div>
           </div>

           <div className="border rounded-lg overflow-hidden mb-6">
              <table className="w-full text-sm">
                 <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                       <th className="py-2 px-4 text-left font-medium">Description</th>
                       <th className="py-2 px-4 text-right font-medium">Amount</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    <tr>
                       <td className="py-3 px-4">{booking.serviceCategory} Service ({booking.scheduledAt})</td>
                       <td className="py-3 px-4 text-right">Rs. {booking.totalPrice.toLocaleString()}</td>
                    </tr>
                    <tr>
                       <td className="py-3 px-4 text-slate-500">Platform Fee (10%)</td>
                       <td className="py-3 px-4 text-right text-slate-500">Rs. {platformFee.toLocaleString()}</td>
                    </tr>
                 </tbody>
                 <tfoot className="bg-slate-50 font-bold text-slate-900">
                    <tr>
                       <td className="py-3 px-4 text-right">Total</td>
                       <td className="py-3 px-4 text-right text-lg">Rs. {total.toLocaleString()}</td>
                    </tr>
                 </tfoot>
              </table>
           </div>

           <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                 Paid via Cash/Card • {new Date().toLocaleDateString()}
              </div>
              <button onClick={() => window.print()} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                 <Printer size={16} /> Print Invoice
              </button>
           </div>
           
           <div className="mt-8 flex justify-center">
              <div className="border-4 border-green-500 text-green-500 font-bold text-2xl px-4 py-1 rounded rotate-[-12deg] opacity-20">
                 PAID
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
