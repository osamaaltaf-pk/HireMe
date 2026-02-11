
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Mail, ArrowRight } from 'lucide-react';
import { db } from '../services/db';
import { Logo } from '../components/Logo';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Deterministic ID generation based on email
      const safeId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const userId = `user_${safeId}`;
      const namePart = email.split('@')[0];
      const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      // Check if user exists in DB
      let user = db.getUser(email);

      if (!user) {
        // Create new user
        const isTestProvider = namePart.toLowerCase().startsWith('pro') || namePart.toLowerCase().includes('provider');
        
        user = {
          id: userId,
          email: email,
          fullName: fullName,
          avatarUrl: `https://ui-avatars.com/api/?name=${namePart}&background=0D8ABC&color=fff`,
          isProvider: isTestProvider, 
          currentRole: 'customer' // Always start as customer view
        };
        db.saveUser(user);

        // If auto-provider, ensure they have a provider profile in DB
        if (isTestProvider) {
           db.saveProviderDetails({
             id: userId,
             fullName: fullName,
             bio: "I am a new provider on HireMe.",
             hourlyRate: 1000,
             verified: false,
             categories: ['cleaning'], // Default
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
      }
      
      onLogin(user);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Logo className="h-20 w-20 text-blue-600 drop-shadow-xl" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign in to HireMe
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          One account for all your needs.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 outline-none transition-shadow"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                <b>Testing Tip:</b> Login with <b>cust@test.com</b> to be a customer. Login with <b>pro@test.com</b> to act as a provider.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                'Signing in...' 
              ) : (
                <>
                  <img className="h-5 w-5 mr-2 bg-white rounded-full p-0.5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                  Continue with Google
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">New here?</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-slate-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
