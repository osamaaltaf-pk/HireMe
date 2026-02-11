import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LogOut, User, Menu, X, ShieldCheck, MapPin, AlertCircle, Home, Search, Calendar, MessageSquare, Repeat, Bell } from 'lucide-react';
import { ComplaintModal } from './ComplaintModal';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onToggleRole: () => void;
  activePage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, onToggleRole, activePage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock Notifications
  const notifications = [
      { id: 1, text: "Welcome to HireMe! Complete your profile.", time: "2h ago", isRead: false },
      { id: 2, text: "New service categories added near you.", time: "1d ago", isRead: true }
  ];

  const NavItem = ({ page, label, icon: Icon }: { page: string; label: string; icon: any }) => (
    <button
      onClick={() => {
        onNavigate(page);
        setIsMenuOpen(false);
      }}
      className={`flex flex-col md:flex-row items-center md:space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        activePage === page 
          ? 'text-blue-600 md:bg-blue-50' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      <Icon size={20} className={activePage === page ? 'fill-current' : ''} />
      <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <ComplaintModal isOpen={isComplaintOpen} onClose={() => setIsComplaintOpen(false)} />
      
      {/* Navbar (Top - Desktop, Bottom - Mobile) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="bg-blue-600 p-2 rounded-lg mr-2 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">HireMe</span>
            </div>

            {/* Desktop Center Links */}
            <div className="hidden md:flex items-center space-x-1">
              <NavItem page="home" label="Home" icon={Home} />
              <NavItem page="explore" label="Explore" icon={Search} />
              {user && <NavItem page="bookings" label="Bookings" icon={Calendar} />}
              {user && <NavItem page="messages" label="Messages" icon={MessageSquare} />}
            </div>

            {/* Desktop Right (Profile/Auth) */}
            <div className="hidden md:flex items-center ml-4">
               {user ? (
                  <div className="flex items-center gap-4">
                    {/* Role Toggle */}
                    {user.isProvider && (
                      <button 
                        onClick={onToggleRole}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                      >
                        <Repeat size={14} />
                        Switch to {user.currentRole === 'customer' ? 'Provider' : 'Customer'}
                      </button>
                    )}

                    {/* Notification Bell */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="p-3 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">Notifications</div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map(n => (
                                        <div key={n.id} className={`p-3 border-b border-slate-50 hover:bg-blue-50 cursor-pointer ${!n.isRead ? 'bg-blue-50/50' : ''}`}>
                                            <p className="text-sm text-slate-800">{n.text}</p>
                                            <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-2 text-center border-t border-slate-100">
                                    <button className="text-xs text-blue-600 font-medium hover:underline">Mark all as read</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                      <button 
                         onClick={() => onNavigate('profile')}
                         className={`flex items-center gap-2 p-1 rounded-full border ${activePage === 'profile' ? 'border-blue-300 ring-2 ring-blue-100' : 'border-transparent'}`}
                      >
                        <img 
                          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}`} 
                          alt="Profile" 
                          className="h-8 w-8 rounded-full"
                        />
                      </button>
                      <button onClick={onLogout} className="text-slate-400 hover:text-red-600">
                        <LogOut size={18} />
                      </button>
                    </div>
                  </div>
               ) : (
                  <button
                    onClick={() => onNavigate('auth')}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-sm shadow-sm hover:shadow"
                  >
                    Login / Sign Up
                  </button>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 h-14 flex items-center justify-between">
         <div className="flex items-center font-bold text-slate-800">
            <ShieldCheck className="h-6 w-6 text-blue-600 mr-2" />
            HireMe
         </div>
         <div className="flex items-center gap-3">
             {user?.isProvider && (
                <button onClick={onToggleRole} className="p-2 bg-slate-100 rounded-full text-slate-600">
                  <Repeat size={16} />
                </button>
             )}
             {user ? (
               <button onClick={onLogout} className="text-slate-500">
                 <LogOut size={20} />
               </button>
             ) : (
               <button onClick={() => onNavigate('auth')} className="text-blue-600 font-bold text-sm">Login</button>
             )}
         </div>
      </div>

      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 z-50 px-2 pb-safe pt-1">
        <div className="grid grid-cols-5 gap-1">
           <NavItem page="home" label="Home" icon={Home} />
           <NavItem page="explore" label="Explore" icon={Search} />
           <NavItem page="bookings" label="Bookings" icon={Calendar} />
           <NavItem page="messages" label="Messages" icon={MessageSquare} />
           <NavItem page="profile" label="Profile" icon={User} />
        </div>
      </div>

      {/* Footer (Desktop Only) */}
      <footer className="hidden md:block bg-slate-900 text-slate-400 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
               <ShieldCheck className="h-6 w-6 text-blue-500 mr-2" />
               <span className="text-lg font-bold text-white">HireMe</span>
            </div>
            <p className="mb-4 text-slate-500">Connecting Pakistan's best professionals with customers who need trusted help.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Cities</h3>
            <ul className="space-y-2">
              <li>Karachi</li>
              <li>Lahore</li>
              <li>Islamabad</li>
            </ul>
          </div>
          <div>
             <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Contact</h3>
             <p className="flex items-center mb-2"><MapPin size={16} className="mr-2"/> Main Blvd, Gulberg III, Lahore</p>
             <p>support@hireme.pk</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Support</h3>
            <button 
              onClick={() => setIsComplaintOpen(true)}
              className="flex items-center space-x-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors font-medium text-sm"
            >
              <AlertCircle size={16} />
              <span>Report an Issue</span>
            </button>
            <p className="mt-2 text-xs text-slate-500">Having trouble? Let us know.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} HireMe Pakistan. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;