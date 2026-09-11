import React, { useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  Award,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Home,
  Dumbbell,
  Clock,
  MapPin,
  Sparkles,
  Upload,
  Check,
  Search,
  RefreshCw,
  Eye
} from 'lucide-react';
import { Trainer, LocationType } from '../types';
import { getZipLocationDetails } from '../utils/zipUtils';

interface AdminSectionProps {
  trainers: Trainer[];
  onAddTrainer: (trainer: Trainer) => void;
  onDeleteTrainer: (id: string) => void;
  onToggleTrainerStatus: (id: string) => void;
  onViewTrainerInSearch: (zip: string) => void;
  onResetTrainers: () => void;
}

const PRESET_AVATARS = [
  { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80', label: 'Male Strength Coach' },
  { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80', label: 'Female Pilates Coach' },
  { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80', label: 'Athletic Conditioning Coach' },
  { url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=600&q=80', label: 'Functional Movement Coach' },
  { url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80', label: 'Bodyweight & Boxing Coach' },
  { url: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80', label: 'Mobility & Rehab Coach' }
];

const PRESET_CREDENTIALS = [
  'NASM-CPT',
  'NSCA-CSCS',
  'ACE-CPT',
  'ACSM-EP',
  'ISSA-CPT',
  'Precision Nutrition L1',
  'CPR/AED Certified',
  'B.S. Kinesiology'
];

const PRESET_SPECIALTIES = [
  'Strength & Hypertrophy',
  'Fat Loss & HIIT',
  'Functional Movement',
  'Mobility & Post-Rehab',
  'Pre/Post-Natal',
  'Boxing Conditioning',
  'Active Aging & Balance',
  'Kettlebells'
];

export const AdminSection: React.FC<AdminSectionProps> = ({
  trainers,
  onAddTrainer,
  onDeleteTrainer,
  onToggleTrainerStatus,
  onViewTrainerInSearch,
  onResetTrainers
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'add' | 'list'>('add');

  // Form State
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0].url);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [headline, setHeadline] = useState('');
  const [primaryZip, setPrimaryZip] = useState('90210');
  const [city, setCity] = useState('Beverly Hills');
  const [state, setState] = useState('CA');
  const [serviceRadiusMiles, setServiceRadiusMiles] = useState(20);
  const [meetsAtHome, setMeetsAtHome] = useState(true);
  const [meetsAtGym, setMeetsAtGym] = useState(true);
  const [yearsExperience, setYearsExperience] = useState(5);
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>(['NASM-CPT', 'CPR/AED Certified']);
  const [customCred, setCustomCred] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(['Strength & Hypertrophy']);
  const [blurb, setBlurb] = useState('');
  const [hourlyRate, setHourlyRate] = useState(85);
  const [isBackgroundChecked, setIsBackgroundChecked] = useState(true);
  const [isAccredited, setIsAccredited] = useState(true);
  const [insuranceVerified, setInsuranceVerified] = useState(true);

  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');

  // Auto-detect city from ZIP
  const handleZipChange = (zipVal: string) => {
    setPrimaryZip(zipVal);
    const details = getZipLocationDetails(zipVal);
    if (details) {
      setCity(details.city);
      setState(details.state);
    }
  };

  const handleToggleCredential = (cred: string) => {
    if (selectedCredentials.includes(cred)) {
      setSelectedCredentials(selectedCredentials.filter((c) => c !== cred));
    } else {
      setSelectedCredentials([...selectedCredentials, cred]);
    }
  };

  const handleAddCustomCredential = () => {
    if (customCred.trim() && !selectedCredentials.includes(customCred.trim())) {
      setSelectedCredentials([...selectedCredentials, customCred.trim()]);
      setCustomCred('');
    }
  };

  const handleToggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  const handleSubmitNewTrainer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please provide trainer full name.');
      return;
    }

    if (!meetsAtHome && !meetsAtGym) {
      alert('Please select at least one meeting location (Home or Gym).');
      return;
    }

    const locationsSupported: LocationType[] = [];
    if (meetsAtHome) locationsSupported.push('home');
    if (meetsAtGym) locationsSupported.push('gym');

    const newTrainer: Trainer = {
      id: 'tr-' + Date.now(),
      name: name.trim(),
      avatarUrl: customAvatarInput.trim() || avatarUrl,
      headline: headline.trim() || 'Certified Personal Trainer & Movement Coach',
      primaryZip: primaryZip.trim() || '90210',
      city: city.trim() || 'Los Angeles',
      state: state.trim() || 'CA',
      serviceRadiusMiles,
      locationsSupported,
      credentials: selectedCredentials.length > 0 ? selectedCredentials : ['NASM-CPT', 'CPR/AED Certified'],
      yearsExperience: Number(yearsExperience) || 3,
      specialties: selectedSpecialties.length > 0 ? selectedSpecialties : ['General Fitness'],
      blurb: blurb.trim() || 'Dedicated to helping clients achieve sustainable strength and health goals.',
      hourlyRate: Number(hourlyRate) || 80,
      rating: 5.0,
      reviewCount: 1,
      isBackgroundChecked,
      backgroundCheckDate: isBackgroundChecked ? 'Verified Today (Checkr Cleared)' : undefined,
      isAccredited,
      insuranceVerified,
      preferredGyms: meetsAtGym ? ['Local Commercial Gym', 'Client Residence Gym'] : ['Home Visits Only'],
      joinedDate: new Date().toISOString().split('T')[0],
      active: true
    };

    onAddTrainer(newTrainer);
    setFormSuccessMessage(`Successfully registered Coach ${newTrainer.name}! Added to ZIP ${newTrainer.primaryZip} directory.`);

    // Reset form
    setName('');
    setHeadline('');
    setBlurb('');
  };

  const filteredTrainers = trainers.filter((t) =>
    t.name.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    t.primaryZip.includes(adminSearchTerm) ||
    t.city.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Admin Dashboard Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Hub</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trainer Onboarding &amp; Roster Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add new fitness trainers with credentials, custom blurbs, pictures, and verify their safety standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="admin-tab-add"
            onClick={() => setActiveSubTab('add')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'add'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Trainer</span>
          </button>

          <button
            id="admin-tab-list"
            onClick={() => setActiveSubTab('list')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'list'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>Manage Roster ({trainers.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {formSuccessMessage && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{formSuccessMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onViewTrainerInSearch(primaryZip);
              }}
              className="bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-400 transition-colors"
            >
              View in Search Results
            </button>
            <button
              onClick={() => setFormSuccessMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* SubTab 1: ADD NEW TRAINER FORM */}
      {activeSubTab === 'add' && (
        <form
          onSubmit={handleSubmitNewTrainer}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl"
        >
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              <span>Trainer Profile &amp; Accreditation Form</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter the trainer&apos;s credentials, experience, picture, locations willing to meet, and personal philosophy blurb.
            </p>
          </div>

          {/* Picture / Avatar Selection */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              1. Profile Picture
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {PRESET_AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAvatarUrl(avatar.url);
                    setCustomAvatarInput('');
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    avatarUrl === avatar.url && !customAvatarInput
                      ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-102'
                      : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                  {avatarUrl === avatar.url && !customAvatarInput && (
                    <div className="absolute top-1 right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 shrink-0">Or custom image URL:</span>
              <input
                type="url"
                value={customAvatarInput}
                onChange={(e) => setCustomAvatarInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Basic Info: Name & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                2. Trainer Full Name *
              </label>
              <input
                id="admin-trainer-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Mitchell"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Professional Headline
              </label>
              <input
                id="admin-trainer-headline"
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Functional Strength &amp; Core Specialist"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Geographic Location & Service Radius */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400">
              3. Service Territory (ZIP Code &amp; Radius)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Base ZIP Code *</label>
                <input
                  id="admin-trainer-zip"
                  type="text"
                  maxLength={5}
                  value={primaryZip}
                  onChange={(e) => handleZipChange(e.target.value)}
                  placeholder="90210"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold text-center focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Beverly Hills"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">State</label>
                <input
                  type="text"
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="CA"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs uppercase text-center focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Travel Radius</label>
                <select
                  value={serviceRadiusMiles}
                  onChange={(e) => setServiceRadiusMiles(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
                >
                  <option value={10}>10 Miles</option>
                  <option value={15}>15 Miles</option>
                  <option value={20}>20 Miles</option>
                  <option value={30}>30 Miles</option>
                  <option value={50}>50 Miles</option>
                </select>
              </div>
            </div>
          </div>

          {/* Meeting Willingness (Home vs Gym) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              4. Meeting Locations Allowed
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  meetsAtHome
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  id="admin-check-home"
                  type="checkbox"
                  checked={meetsAtHome}
                  onChange={(e) => setMeetsAtHome(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-900"
                />
                <Home className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white text-xs sm:text-sm">Willing to Meet at Client&apos;s Home</div>
                  <div className="text-[10px] text-slate-400">Coaches clients in their living room, backyard, or condo setup</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  meetsAtGym
                    ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  id="admin-check-gym"
                  type="checkbox"
                  checked={meetsAtGym}
                  onChange={(e) => setMeetsAtGym(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-500 focus:ring-0 bg-slate-900"
                />
                <Dumbbell className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white text-xs sm:text-sm">Willing to Meet at Gym of Client&apos;s Choice</div>
                  <div className="text-[10px] text-slate-400">Equinox, residential building gym, or commercial fitness center</div>
                </div>
              </label>
            </div>
          </div>

          {/* Credentials & Years of Experience */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                5. Accreditations &amp; Years of Experience
              </label>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Years Pro Experience:</span>
                <input
                  id="admin-years-exp"
                  type="number"
                  min={1}
                  max={40}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-14 bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-1 text-center font-bold text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRESET_CREDENTIALS.map((cred) => (
                <button
                  key={cred}
                  type="button"
                  onClick={() => handleToggleCredential(cred)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    selectedCredentials.includes(cred)
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {selectedCredentials.includes(cred) && '✓ '}
                  {cred}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customCred}
                onChange={(e) => setCustomCred(e.target.value)}
                placeholder="Add custom certification (e.g. USA Weightlifting L1)"
                className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddCustomCredential}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              6. Focus Specialties
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SPECIALTIES.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => handleToggleSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
                    selectedSpecialties.includes(spec)
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Trainer Blurb */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              7. Trainer Bio &amp; Philosophy Blurb of Their Choosing *
            </label>
            <textarea
              id="admin-trainer-blurb"
              rows={3}
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="e.g. I help busy clients develop real strength and metabolic conditioning right in the comfort of their home or at their favorite gym. With 8 years of biomechanics expertise, every workout is safe, progressive, and energizing."
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs sm:text-sm leading-relaxed focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Admin Verification Standards */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>8. Admin Verification &amp; Vetting Checklist</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBackgroundChecked}
                  onChange={(e) => setIsBackgroundChecked(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-emerald-500 bg-slate-900"
                />
                <span className="text-slate-300">
                  <strong className="text-white block">Background Checked</strong>
                  External 7-yr check cleared
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAccredited}
                  onChange={(e) => setIsAccredited(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-emerald-500 bg-slate-900"
                />
                <span className="text-slate-300">
                  <strong className="text-white block">Accreditation Verified</strong>
                  Active registry confirmed
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={insuranceVerified}
                  onChange={(e) => setInsuranceVerified(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-emerald-500 bg-slate-900"
                />
                <span className="text-slate-300">
                  <strong className="text-white block">$1M+ Liability Insurance</strong>
                  COI document on file
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-admin-submit-trainer"
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl text-sm sm:text-base shadow-lg shadow-emerald-950/40 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Publish &amp; Activate Trainer in Directory</span>
          </button>
        </form>
      )}

      {/* SubTab 2: MANAGE EXISTING TRAINERS ROSTER */}
      {activeSubTab === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Active Trainers Roster ({trainers.length})
              </h2>
              <p className="text-xs text-slate-400">
                View status, edit active state, or test searching for any coach by their zip code.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearchTerm}
                  onChange={(e) => setAdminSearchTerm(e.target.value)}
                  placeholder="Filter by name, ZIP..."
                  className="bg-slate-950 border border-slate-700 text-white rounded-xl pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={onResetTrainers}
                title="Reset to default certified trainers roster"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trainers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Trainer</th>
                  <th className="py-3 px-3">Base Location</th>
                  <th className="py-3 px-3">Meets At</th>
                  <th className="py-3 px-3">Accreditation</th>
                  <th className="py-3 px-3">Vetted Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTrainers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={t.avatarUrl}
                          alt={t.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-xs sm:text-sm">{t.name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{t.headline}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">ZIP {t.primaryZip}</div>
                      <div className="text-[10px] text-slate-400">{t.city}, {t.state} ({t.serviceRadiusMiles} mi)</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex gap-1 flex-wrap">
                        {t.locationsSupported.includes('home') && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                            Home
                          </span>
                        )}
                        {t.locationsSupported.includes('gym') && (
                          <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-1.5 py-0.2 rounded">
                            Gym
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{t.credentials[0]}</div>
                      <div className="text-[10px] text-slate-400">{t.yearsExperience} yrs exp</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Background Cleared</span>
                        </span>
                        <div className="text-[9px] text-slate-500">{t.backgroundCheckDate || 'Verified'}</div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewTrainerInSearch(t.primaryZip)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                          title="View In Search Directory"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        </button>

                        <button
                          onClick={() => onToggleTrainerStatus(t.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                            t.active
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {t.active ? 'Active' : 'Paused'}
                        </button>

                        <button
                          onClick={() => onDeleteTrainer(t.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete Trainer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
