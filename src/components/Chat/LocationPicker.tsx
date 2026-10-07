import React, { useState } from 'react';
import { LocationInfo } from '../../types';
import { MapPin, Navigation, Check, Loader2 } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelected: (location: LocationInfo) => void;
  initialLocation?: LocationInfo;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelected,
  initialLocation
}) => {
  const [area, setArea] = useState(initialLocation?.area || '');
  const [street, setStreet] = useState(initialLocation?.street || '');
  const [building, setBuilding] = useState(initialLocation?.building || '');
  const [block, setBlock] = useState(initialLocation?.block || '');
  const [landmark, setLandmark] = useState(initialLocation?.landmark || '');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsCaptured, setGpsCaptured] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setGpsCaptured(true);
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);

        if (!area) setArea('Current Detected Campus / Municipal GPS');
        if (!landmark) setLandmark(`GPS Coordinates: (${lat}, ${lng})`);

        const loc: LocationInfo = {
          area: area || 'Current Detected Campus / Municipal GPS',
          street: street || undefined,
          building: building || undefined,
          block: block || undefined,
          landmark: `GPS Coordinates: (${lat}, ${lng})`,
          fullAddress: [
            building,
            block,
            street,
            landmark || `GPS: ${lat}, ${lng}`,
            area || 'Detected GPS Location'
          ]
            .filter(Boolean)
            .join(', '),
          coordinates: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
        };

        onLocationSelected(loc);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
        // Graceful fallback without crashing
        setArea('Hostel & Academic Zone');
        setLandmark('Campus Perimeter');
        alert('Could not access GPS automatically. You can type the location details below.');
      },
      { timeout: 7000 }
    );
  };

  const handleManualApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!area.trim() && !building.trim() && !street.trim()) {
      alert('Please provide at least an Area, Building, or Street name.');
      return;
    }

    const parts = [building, block, street, landmark, area].filter(Boolean);
    const loc: LocationInfo = {
      area: area || 'Campus / City Area',
      street: street || undefined,
      building: building || undefined,
      block: block || undefined,
      landmark: landmark || undefined,
      fullAddress: parts.join(', ') || 'Reported Location'
    };

    onLocationSelected(loc);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-xl max-w-lg mt-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-slate-200">
          <MapPin className="w-4 h-4 text-rose-400" />
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
            Location Details
          </h4>
        </div>

        {/* GPS Button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center space-x-1.5 transition-all"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{gpsCaptured ? 'GPS Captured ✓' : 'Use My GPS'}</span>
        </button>
      </div>

      <form onSubmit={handleManualApply} className="mt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Area / Campus Zone *
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Hostel Zone, North Campus"
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Street / Road
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. Hostel 4 Road, Ring Road"
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Building / Department
            </label>
            <input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="e.g. Science Block, Hostel B"
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Block / Room / Floor
            </label>
            <input
              type="text"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              placeholder="e.g. 2nd Floor, Room 204"
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Prominent Landmark
          </label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g. Near Dining Hall Gate, Opposite Water Cooler"
            className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-950/30 transition-all"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Confirm & Attach Location</span>
        </button>
      </form>
    </div>
  );
};
