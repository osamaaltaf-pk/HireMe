import React, { useState, useEffect } from 'react';
import { UserProfile, ProviderDetails } from '../types';
import { enhanceProviderBio } from '../services/geminiService';
import { Save, Wand2, DollarSign, MapPin, Award } from 'lucide-react';
import { CITIES, SERVICE_CATEGORIES } from '../constants';
import { db } from '../services/db';

interface DashboardProps {
  user: UserProfile;
}

const ProviderDashboard: React.FC<DashboardProps> = ({ user }) => {
  // Load initial state from DB
  const initialProfile = db.getProviderById(user.id) || {
    id: user.id,
    bio: "I am a hardworking professional looking for work.",
    hourlyRate: 1000,
    verified: false,
    categories: ['plumbing'],
    rating: 0,
    reviewCount: 0,
    location: 'Karachi',
    coordinates: { lat: 24.8607, lng: 67.0011 },
    experienceYears: 2,
    serviceRadius: 5,
    images: [],
    joinedAt: new Date().toISOString().split('T')[0]
  };

  const [profile, setProfile] = useState<ProviderDetails>(initialProfile);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  const [providerBookings, setProviderBookings] = useState(db.getBookings().filter(b => b.providerId === user.id));

  const handleEnhanceBio = async () => {
    setIsEnhancing(true);
    const enhanced = await enhanceProviderBio(profile.bio, user.fullName, profile.categories.join(', '));
    setProfile({ ...profile, bio: enhanced });
    setIsEnhancing(false);
  };

  const handleSave = () => {
    // Save to persistent DB
    db.saveProviderDetails({ ...profile, fullName: user.fullName });
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Provider Dashboard</h1>
      
      <div className="flex space-x-4 mb-6 border-b border-slate-200">
        <button 
          className={`pb-3 px-1 font-medium text-sm ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Settings
        </button>
        <button 
           className={`pb-3 px-1 font-medium text-sm ${activeTab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
           onClick={() => setActiveTab('bookings')}
        >
          Bookings ({providerBookings.length})
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Settings */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
                    {!profile.verified && (
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-medium">Pending Verification</span>
                    )}
                 </div>

                 <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location (City)</label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                            <select 
                              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              value={profile.location}
                              onChange={(e) => setProfile({...profile, location: e.target.value})}
                            >
                              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                         </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (PKR)</label>
                         <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                            <input 
                              type="number"
                              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              value={profile.hourlyRate}
                              onChange={(e) => setProfile({...profile, hourlyRate: parseInt(e.target.value)})}
                            />
                         </div>
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Service Category</label>
                      <select 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={profile.categories[0]}
                        onChange={(e) => setProfile({...profile, categories: [e.target.value]})}
                      >
                         {SERVICE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                   </div>

                   <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-slate-700">Bio / Description</label>
                        <button 
                          onClick={handleEnhanceBio}
                          disabled={isEnhancing}
                          className="flex items-center text-xs text-purple-600 hover:text-purple-700 font-semibold"
                        >
                           <Wand2 size={12} className="mr-1" />
                           {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                        </button>
                      </div>
                      <textarea 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-32"
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      />
                      <p className="text-xs text-slate-500 mt-1">Use AI to make your bio sound more professional to customers.</p>
                   </div>
                 </div>

                 <div className="mt-6 flex justify-end">
                    <button 
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
                    >
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </button>
                 </div>
              </div>
           </div>

           {/* Stats / Verification */}
           <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-900 mb-4">Verification Status</h2>
                 <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                       <Award className={`h-8 w-8 ${profile.verified ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <p className="font-medium text-slate-900">{profile.verified ? 'Verified Professional' : 'Unverified'}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {profile.verified 
                        ? 'Your badge is active. You appear higher in search.' 
                        : 'Upload your CNIC and certificates to get verified.'}
                    </p>
                    {!profile.verified && (
                       <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">Upload Documents</button>
                    )}
                 </div>
              </div>

               <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-2">Pro Tip</h3>
                  <p className="text-sm text-blue-800">
                    Providers with detailed bios and photos get 3x more bookings. Use the AI Enhance button to improve your profile instantly.
                  </p>
               </div>
           </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
           {providerBookings.length > 0 ? (
               <div className="text-left">
                  <p className="text-slate-500 mb-4">You have {providerBookings.length} booking(s).</p>
                  {/* Reuse Booking component style here implicitly or link to main bookings page */}
                  <a href="#" className="text-blue-600 hover:underline">Go to Bookings Tab to manage</a>
               </div>
           ) : (
             <>
                <div className="mx-auto h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No bookings yet</h3>
                <p className="text-slate-500 mt-2">Complete your profile to start receiving job requests.</p>
             </>
           )}
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;