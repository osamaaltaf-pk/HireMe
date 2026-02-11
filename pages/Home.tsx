
import React, { useState } from 'react';
import { Search, MapPin, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { SERVICE_CATEGORIES, CITIES, MOCK_PROVIDERS } from '../constants';
import { analyzeServiceRequest } from '../services/geminiService';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Use local keyword analysis (instant)
    const result = await analyzeServiceRequest(searchQuery);
    
    if (result.categoryId) {
      onNavigate('services', { 
          categoryId: result.categoryId, 
          term: '', // Clear term so we see all providers in that category
          initialLocation: result.detectedLocation 
      });
    } else {
       // If no category found, pass the raw term
       onNavigate('services', { 
         term: result.suggestedSearchTerm || searchQuery,
         initialLocation: result.detectedLocation 
       });
    }
  };

  const featuredProviders = MOCK_PROVIDERS.filter(p => p.rating > 4.7).slice(0, 3);

  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      {/* On Mobile/Tablet (<lg): flex-grow to fill screen, justify-center to center content */}
      <section className="relative bg-blue-700 py-20 px-4 sm:px-6 overflow-hidden flex-grow lg:flex-grow-0 flex flex-col justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Find Trusted Experts for <br className="hidden sm:block" /> Every Home Service
          </h1>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            From leaking taps in Karachi to electrical wiring in Lahore. Hire verified professionals instantly.
          </p>

          <div className="bg-white p-2 rounded-xl shadow-2xl max-w-2xl mx-auto transform transition-all hover:scale-[1.01]">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex-grow w-full relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="What do you need help with? (e.g., 'Fix my AC in Gulberg')"
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Search
              </button>
            </form>
          </div>
          <p className="text-blue-200 mt-4 text-sm font-medium">
            Try: "AC service in Gulberg" or "Need a plumber for sink"
          </p>
        </div>
      </section>

      {/* Categories Section - Hidden on Mobile/Tablet */}
      <section className="hidden lg:block py-16 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center sm:text-left">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('services', { categoryId: cat.id })}
              className="flex flex-col items-center p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <div className="font-bold text-lg">{cat.name[0]}</div>
              </div>
              <span className="font-medium text-slate-700 text-sm text-center group-hover:text-blue-700">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Trust Factors - Hidden on Mobile/Tablet */}
      <section className="hidden lg:block bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { title: "Verified Professionals", desc: "Background checks and ID verification for every provider." },
               { title: "Secure Payments", desc: "Pay only after the job is completed to your satisfaction." },
               { title: "Rating Driven", desc: "Hire based on real reviews from community members." }
             ].map((item, idx) => (
               <div key={idx} className="flex items-start">
                 <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                 <div>
                   <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                   <p className="text-slate-600 text-sm">{item.desc}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Featured Providers - Hidden on Mobile/Tablet */}
      <section className="hidden lg:block py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Top Rated Pros</h2>
            <p className="text-slate-500 mt-1">Highly recommended by your community</p>
          </div>
          <button onClick={() => onNavigate('services')} className="text-blue-600 font-medium hover:underline flex items-center text-sm">
            View All <ArrowRight size={16} className="ml-1"/>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProviders.map((provider) => (
             <div key={provider.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-start justify-between mb-4">
                 <div className="flex items-center">
                   <div className="h-12 w-12 bg-slate-200 rounded-full mr-3 overflow-hidden">
                      <img src={`https://picsum.photos/seed/${provider.id}/200`} alt={provider.fullName} className="h-full w-full object-cover" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-slate-900 line-clamp-1">{provider.fullName}</h3>
                     <p className="text-xs text-slate-500 flex items-center">
                       <MapPin size={12} className="mr-1" /> {provider.location}
                     </p>
                   </div>
                 </div>
                 {provider.verified && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Verified</span>}
               </div>
               
               <p className="text-slate-600 text-sm mb-4 line-clamp-2 h-10">{provider.bio}</p>
               
               <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                 <div className="flex items-center text-amber-500 font-bold text-sm">
                   <Star size={16} className="fill-current mr-1" />
                   {provider.rating} <span className="text-slate-400 font-normal ml-1">({provider.reviewCount})</span>
                 </div>
                 <span className="text-slate-900 font-semibold text-sm">Rs. {provider.hourlyRate}/hr</span>
               </div>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
