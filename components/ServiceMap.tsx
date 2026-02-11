import React, { useEffect, useRef, useState } from 'react';
import { ProviderDetails } from '../types';
import { MapPin } from 'lucide-react';

interface ServiceMapProps {
  providers: (ProviderDetails & { fullName: string })[];
  selectedProviderId?: string | null;
  onMarkerClick: (providerId: string) => void;
  center?: { lat: number; lng: number };
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const ServiceMap: React.FC<ServiceMapProps> = ({ providers, selectedProviderId, onMarkerClick, center }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);

  // Default center (Pakistan general center or first provider)
  const defaultCenter = center || (providers.length > 0 ? providers[0].coordinates : { lat: 30.3753, lng: 69.3451 });

  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      setApiKeyError(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setApiKeyError(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (mapLoaded && mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
            }
        ]
      });

      const bounds = new window.google.maps.LatLngBounds();

      providers.forEach(provider => {
        const marker = new window.google.maps.Marker({
          position: provider.coordinates,
          map: map,
          title: provider.fullName,
          animation: selectedProviderId === provider.id ? window.google.maps.Animation.BOUNCE : null,
          icon: selectedProviderId === provider.id 
            ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' 
            : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        marker.addListener('click', () => {
          onMarkerClick(provider.id);
        });

        bounds.extend(provider.coordinates);
      });

      if (providers.length > 0) {
        map.fitBounds(bounds);
      }
    }
  }, [mapLoaded, providers, selectedProviderId]);

  if (apiKeyError) {
    return (
      <div className="h-full w-full bg-slate-100 rounded-xl flex flex-col items-center justify-center p-6 text-center border border-slate-200">
        <MapPin size={48} className="text-slate-300 mb-4" />
        <h3 className="font-bold text-slate-700">Map View Available</h3>
        <p className="text-xs text-slate-500 max-w-xs mb-4">
          Google Maps API Key is missing. Add `NEXT_PUBLIC_GOOGLE_MAPS_KEY` to your environment to see live maps.
        </p>
        <div className="w-full h-48 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center relative overflow-hidden">
             {/* Fake Map Visualization */}
             <div className="absolute inset-0 opacity-10">
                 <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                     {[...Array(36)].map((_, i) => <div key={i} className="border border-slate-400"></div>)}
                 </div>
             </div>
             {providers.map((p, i) => (
                 <div key={p.id} className="absolute p-1 bg-white rounded-full shadow-md z-10" style={{ 
                     top: `${30 + (i * 15) % 50}%`, 
                     left: `${20 + (i * 20) % 60}%` 
                 }}>
                     <MapPin size={24} className={selectedProviderId === p.id ? "text-blue-600" : "text-red-500"} fill="currentColor" />
                 </div>
             ))}
             <span className="bg-white/80 px-3 py-1 rounded text-xs font-bold shadow-sm z-20">Mock Map View</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="h-full w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 min-h-[400px]" />
  );
};