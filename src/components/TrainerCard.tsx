import React from 'react';
import {
  ShieldCheck,
  Award,
  MapPin,
  Home,
  Dumbbell,
  Star,
  MessageSquare,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Trainer } from '../types';

interface TrainerCardProps {
  trainer: Trainer;
  userZip: string;
  distance: number;
  onViewDetails: (trainer: Trainer) => void;
  onStartMessage: (trainerId: string) => void;
}

export const TrainerCard: React.FC<TrainerCardProps> = ({
  trainer,
  userZip,
  distance,
  onViewDetails,
  onStartMessage
}) => {
  const meetsAtHome = trainer.locationsSupported.includes('home');
  const meetsAtGym = trainer.locationsSupported.includes('gym');

  return (
    <article
      id={`trainer-card-${trainer.id}`}
      className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all hover:shadow-lg hover:shadow-black/40 flex flex-col justify-between group"
    >
      <div>
        {/* Top Header: Avatar, Name, Rating, Vetting status */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <img
              src={trainer.avatarUrl}
              alt={trainer.name}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover object-center border border-slate-700 shadow-sm"
              loading="lazy"
            />
            {trainer.isBackgroundChecked && (
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-md"
                title="Criminal Background Checked & Cleared"
              >
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate group-hover:text-emerald-300 transition-colors">
                {trainer.name}
              </h3>
              <div className="flex items-center gap-1 bg-slate-850 px-2 py-0.5 rounded-md border border-slate-700 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-white">{trainer.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400">({trainer.reviewCount})</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 font-medium">{trainer.headline}</p>

            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold text-emerald-400">{distance} mi away</span>
                <span className="text-slate-500">• {trainer.city}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{trainer.yearsExperience} yrs exp</span>
              </span>
            </div>
          </div>
        </div>

        {/* Location Preferences */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Meets at:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {meetsAtHome && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                <Home className="w-3 h-3" />
                <span>At Your Home</span>
              </span>
            )}
            {meetsAtGym && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-teal-500/10 border border-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full">
                <Dumbbell className="w-3 h-3" />
                <span>At Gym of Choice</span>
              </span>
            )}
          </div>
        </div>

        {/* Credentials Pill List */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {trainer.credentials.slice(0, 3).map((cred, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded flex items-center gap-0.5"
            >
              <Award className="w-2.5 h-2.5 text-teal-400" />
              {cred}
            </span>
          ))}
          {trainer.credentials.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{trainer.credentials.length - 3} more
            </span>
          )}
        </div>

        {/* Blurb excerpt */}
        <p className="mt-2.5 text-xs text-slate-400 line-clamp-2 italic leading-relaxed">
          &ldquo;{trainer.blurb}&rdquo;
        </p>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
        <button
          id={`btn-message-trainer-${trainer.id}`}
          onClick={() => onStartMessage(trainer.id)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-xl border border-slate-700 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>Message</span>
        </button>

        <button
          id={`btn-details-trainer-${trainer.id}`}
          onClick={() => onViewDetails(trainer)}
          className="flex-1 flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2 px-2.5 rounded-xl transition-all shadow-sm"
        >
          <span>View Profile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
