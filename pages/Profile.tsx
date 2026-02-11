import React, { useState } from 'react';
import { UserProfile } from '../types';
import ProviderDashboard from './ProviderDashboard';
import { User, MapPin, Mail, Phone, Settings, LogOut, Edit2, Save } from 'lucide-react';
import { db } from '../services/db';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  onBecomeProvider: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onBecomeProvider }) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState(user.location || '');
  
  // If the user is viewing as a Provider, show the Provider Dashboard (Bio, Rates, etc.)
  if (user.currentRole === 'provider') {
    return <ProviderDashboard user={user} />;
  }

  const handleSaveAddress = () => {
    // Save to DB (mock update to user object)
    const updatedUser = { ...user, location: address };
    db.saveUser(updatedUser);
    localStorage.setItem('hireme_user', JSON.stringify(updatedUser)); // Persist locally for App state
    setIsEditingAddress(false);
  };

  // Otherwise, show Customer Profile
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="px-6 pb-6">
             <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                   <img 
                     src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}`} 
                     alt={user.fullName} 
                     className="h-full w-full rounded-full object-cover bg-slate-100"
                   />
                </div>
                <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50">
                   Edit Profile
                </button>
             </div>

             <div>
                <h1 className="text-2xl font-bold text-slate-900">{user.fullName}</h1>
                <p className="text-slate-500">{user.email}</p>
             </div>

             <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                       <h3 className="font-semibold text-slate-900 mb-3 flex items-center justify-between">
                          <span className="flex items-center"><MapPin size={18} className="mr-2 text-slate-400" /> Primary Address</span>
                          {!isEditingAddress ? (
                              <button onClick={() => setIsEditingAddress(true)} className="text-xs text-blue-600 flex items-center"><Edit2 size={12} className="mr-1"/> Edit</button>
                          ) : (
                              <button onClick={handleSaveAddress} className="text-xs text-green-600 flex items-center"><Save size={12} className="mr-1"/> Save</button>
                          )}
                       </h3>
                       
                       {isEditingAddress ? (
                           <input 
                              type="text" 
                              className="w-full border rounded p-2 text-sm"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Enter your home address..."
                           />
                       ) : (
                           <p className="text-sm text-slate-500 italic">{user.location || 'No address saved.'}</p>
                       )}
                    </div>
                    
                    <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                       <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                          <Settings size={18} className="mr-2 text-slate-400" /> Account Settings
                       </h3>
                       <div className="space-y-2">
                          <button className="block text-sm text-slate-600 hover:text-blue-600">Change Password</button>
                          <button className="block text-sm text-slate-600 hover:text-blue-600">Notification Preferences</button>
                       </div>
                    </div>
                </div>

                {!user.isProvider && (
                   <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                      <h3 className="text-lg font-bold text-blue-900">Want to earn money on HireMe?</h3>
                      <p className="text-blue-700 mb-4 text-sm">Create your professional profile and start getting jobs today.</p>
                      <button 
                        onClick={onBecomeProvider}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                      >
                        Become a Provider
                      </button>
                   </div>
                )}
                
                <div className="pt-6 border-t border-slate-100">
                   <button onClick={onLogout} className="flex items-center text-red-600 hover:text-red-700 font-medium">
                      <LogOut size={20} className="mr-2" /> Log Out
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Profile;