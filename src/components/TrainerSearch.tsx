import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Home,
  Dumbbell,
  SlidersHorizontal,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Trainer, LocationType } from '../types';
import { calculateZipDistance, getZipLocationDetails } from '../utils/zipUtils';
import { TrainerCard } from './TrainerCard';
import { TrainerDetailModal } from './TrainerDetailModal';

interface TrainerSearchProps {
  trainers: Trainer[];
  onStartMessage: (trainerId: string) => void;
  onSelectPlanForTrainer: (trainerId: string) => void;
}

const POPULAR_ZIPS = [
  { zip: '90210', label: 'Beverly Hills / LA' },
  { zip: '10001', label: 'New York City' },
  { zip: '60601', label: 'Chicago' },
  { zip: '94102', label: 'San Francisco' },
  { zip: '33139', label: 'Miami Beach' },
  { zip: '75001', label: 'Dallas' }
];

export const TrainerSearch: React.FC<TrainerSearchProps> = ({
  trainers,
  onStartMessage,
  onSelectPlanForTrainer
}) => {
  const [zipInput, setZipInput] = useState<string>('90210');
  const [activeZip, setActiveZip] = useState<string>('90210');
  const [locationFilter, setLocationFilter] = useState<'all' | LocationType>('all');
  const [maxRadius, setMaxRadius] = useState<number>(30);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  const zipDetails = useMemo(() => getZipLocationDetails(activeZip), [activeZip]);

  // Extract unique specialties from active trainers
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    trainers.forEach((t) => t.specialties.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [trainers]);

  // Compute distances & filter trainers
  const filteredTrainers = useMemo(() => {
    return trainers
      .filter((trainer) => trainer.active)
      .map((trainer) => {
        const dist = calculateZipDistance(activeZip, trainer.primaryZip);
        return { trainer, distance: dist };
      })
      .filter(({ trainer, distance }) => {
        // Radius filter
        if (maxRadius < 100 && distance > maxRadius) return false;

        // Location filter: home / gym
        if (locationFilter === 'home' && !trainer.locationsSupported.includes('home')) {
          return false;
        }
        if (locationFilter === 'gym' && !trainer.locationsSupported.includes('gym')) {
          return false;
        }

        // Specialty filter
        if (selectedSpecialty !== 'all' && !trainer.specialties.includes(selectedSpecialty)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [trainers, activeZip, locationFilter, maxRadius, selectedSpecialty]);

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = zipInput.trim().slice(0, 5);
    if (clean.length >= 3) {
      setActiveZip(clean);
    }
  };

  const handleSelectQuickZip = (zip: string) => {
    setZipInput(zip);
    setActiveZip(zip);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Background Checked &amp; Accredited</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Find Certified Local Fitness Trainers
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Coaches who travel to your <strong className="text-emerald-400">home</strong> or meet at a <strong className="text-teal-400">gym location of your choice</strong>. Search by your zip code below.
            </p>
          </div>

          {/* Quick ZIP Search Form */}
          <form
            onSubmit={handleZipSubmit}
            className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-stretch gap-2"
          >
            <div className="relative flex-1 sm:w-64">
              <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-zip-search"
                type="text"
                pattern="[0-9]*"
                maxLength={5}
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                placeholder="Enter 5-digit ZIP"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-500"
              />
              {zipInput && (
                <button
                  type="button"
                  onClick={() => setZipInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              id="btn-search-zip"
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Search Trainers</span>
            </button>
          </form>
        </div>

        {/* Quick ZIP suggestions chips */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Quick Cities:</span>
          {POPULAR_ZIPS.map((pz) => (
            <button
              key={pz.zip}
              id={`quick-zip-${pz.zip}`}
              onClick={() => handleSelectQuickZip(pz.zip)}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                activeZip === pz.zip
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {pz.label} ({pz.zip})
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Location Willingness Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              id="filter-loc-all"
              onClick={() => setLocationFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                locationFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Locations
            </button>
            <button
              id="filter-loc-home"
              onClick={() => setLocationFilter('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
                locationFilter === 'home'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Meets at Home</span>
            </button>
            <button
              id="filter-loc-gym"
              onClick={() => setLocationFilter('gym')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
                locationFilter === 'gym'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Meets at Gym</span>
            </button>
          </div>

          {/* Radius selector */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Within radius:</span>
            <select
              id="select-radius"
              value={maxRadius}
              onChange={(e) => setMaxRadius(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value={15}>15 Miles</option>
              <option value={25}>25 Miles</option>
              <option value={50}>50 Miles</option>
              <option value={100}>100 Miles (Nationwide)</option>
            </select>
          </div>
        </div>

        {/* Specialties pills scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">
            Specialty:
          </span>
          <button
            onClick={() => setSelectedSpecialty('all')}
            className={`px-2.5 py-1 rounded-full text-xs shrink-0 transition-colors ${
              selectedSpecialty === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Specialties
          </button>
          {allSpecialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-2.5 py-1 rounded-full text-xs shrink-0 transition-colors ${
                selectedSpecialty === spec
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Search status line */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Showing <strong>{filteredTrainers.length}</strong> vetted {filteredTrainers.length === 1 ? 'trainer' : 'trainers'} near{' '}
            <strong className="text-white">ZIP {activeZip}</strong>
            {zipDetails && ` (${zipDetails.city}, ${zipDetails.state})`}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">Sorted by distance</span>
      </div>

      {/* Trainer Cards Grid */}
      {filteredTrainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrainers.map(({ trainer, distance }) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              userZip={activeZip}
              distance={distance}
              onViewDetails={(t) => setSelectedTrainer(t)}
              onStartMessage={(id) => onStartMessage(id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No trainers match these filters</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Try expanding your search radius to 50 or 100 miles, choosing &ldquo;All Locations&rdquo;, or testing one of our featured cities like Beverly Hills (90210), NYC (10001), or Chicago (60601).
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setLocationFilter('all');
                setMaxRadius(100);
                setSelectedSpecialty('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => handleSelectQuickZip('90210')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-colors"
            >
              Search ZIP 90210
            </button>
          </div>
        </div>
      )}

      {/* Trainer Detail Modal */}
      {selectedTrainer && (
        <TrainerDetailModal
          trainer={selectedTrainer}
          onClose={() => setSelectedTrainer(null)}
          onStartChat={onStartMessage}
          onSelectPlanForTrainer={onSelectPlanForTrainer}
          userZip={activeZip}
          calculatedDistance={
            filteredTrainers.find((item) => item.trainer.id === selectedTrainer.id)?.distance
          }
        />
      )}
    </div>
  );
};
