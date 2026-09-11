import React from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  Home,
  Dumbbell,
  Star,
  MessageSquare,
  CheckCircle2,
  Lock,
  CalendarCheck
} from 'lucide-react';
import { Trainer } from '../types';

interface TrainerDetailModalProps {
  trainer: Trainer | null;
  onClose: () => void;
  onStartChat: (trainerId: string) => void;
  onSelectPlanForTrainer: (trainerId: string) => void;
  userZip: string;
  calculatedDistance?: number;
}

export const TrainerDetailModal: React.FC<TrainerDetailModalProps> = ({
  trainer,
  onClose,
  onStartChat,
  onSelectPlanForTrainer,
  userZip,
  calculatedDistance
}) => {
  if (!trainer) return null;

  const meetsAtHome = trainer.locationsSupported.includes('home');
  const meetsAtGym = trainer.locationsSupported.includes('gym');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image cover */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-800 overflow-hidden">
          <img
            src={trainer.avatarUrl}
            alt={trainer.name}
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            id="btn-close-trainer-modal"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Vetting Badges */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-1.5">
            {trainer.isBackgroundChecked && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-bold shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Background Cleared</span>
              </span>
            )}
            {trainer.isAccredited && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-400/90 text-slate-950 text-xs font-bold shadow">
                <Award className="w-3.5 h-3.5" />
                <span>Accredited Trainer</span>
              </span>
            )}
            {trainer.insuranceVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-medium">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>$1M Insured</span>
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-200">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{trainer.name}</h2>
                <p className="text-xs sm:text-sm text-emerald-400 font-medium">{trainer.headline}</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-white">{trainer.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400">({trainer.reviewCount})</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{trainer.city}, {trainer.state} (ZIP {trainer.primaryZip})</span>
              </span>
              {calculatedDistance !== undefined && (
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {calculatedDistance} mi from ZIP {userZip}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{trainer.yearsExperience} Years Pro Experience</span>
              </span>
            </div>
          </div>

          {/* Location Willingness Callout */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Session Meeting Locations
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`p-2.5 rounded-lg border flex items-center gap-2 text-xs font-medium ${
                  meetsAtHome
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800/40 border-slate-700/40 text-slate-500 opacity-60'
                }`}
              >
                <Home className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">At Your Home</div>
                  <div className="text-[10px] text-slate-400">Brings equipment or uses yours</div>
                </div>
              </div>

              <div
                className={`p-2.5 rounded-lg border flex items-center gap-2 text-xs font-medium ${
                  meetsAtGym
                    ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                    : 'bg-slate-800/40 border-slate-700/40 text-slate-500 opacity-60'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">At Gym of Choice</div>
                  <div className="text-[10px] text-slate-400">Commercial or private gym</div>
                </div>
              </div>
            </div>

            {trainer.preferredGyms && trainer.preferredGyms.length > 0 && (
              <div className="mt-2 text-[11px] text-slate-400">
                <span className="text-slate-300 font-medium">Frequent Gyms: </span>
                {trainer.preferredGyms.join(' • ')}
              </div>
            )}
          </div>

          {/* Trainer Blurb */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Trainer Philosophy &amp; Blurb
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              &ldquo;{trainer.blurb}&rdquo;
            </p>
          </div>

          {/* Verified Credentials */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Verified Accreditations</span>
              <span className="text-emerald-400 text-[11px] font-normal flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Independently Audited
              </span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {trainer.credentials.map((cred, idx) => (
                <span
                  key={idx}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1"
                >
                  <Award className="w-3 h-3 text-teal-400" />
                  {cred}
                </span>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Focus Areas &amp; Specialties
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {trainer.specialties.map((spec, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-2 py-0.5 rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Background Check Details */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety &amp; Criminal Background Check Cleared</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              7-Year multi-jurisdictional criminal record check, sex offender registry search, and active CPR/AED certified through accredited third-party verification outside this app.
            </p>
            {trainer.backgroundCheckDate && (
              <p className="text-[10px] text-slate-500 font-mono">
                Verification status: {trainer.backgroundCheckDate}
              </p>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <button
            id="btn-modal-chat"
            onClick={() => {
              onStartChat(trainer.id);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition-colors text-xs sm:text-sm"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Message Coach</span>
          </button>

          <button
            id="btn-modal-book-plan"
            onClick={() => {
              onSelectPlanForTrainer(trainer.id);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 px-3 rounded-xl shadow-md transition-all text-xs sm:text-sm"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Select Monthly Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
