import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  Calendar,
  RefreshCw,
  Home,
  Dumbbell,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Plan, Subscription, Trainer } from '../types';
import { INITIAL_PLANS } from '../data/initialData';
import { StripeCheckoutModal } from './StripeCheckoutModal';

interface PlansPricingPageProps {
  activeSubscription: Subscription | null;
  onUpdateSubscription: (sub: Subscription | null) => void;
  trainers: Trainer[];
  preSelectedTrainerId?: string | null;
}

export const PlansPricingPage: React.FC<PlansPricingPageProps> = ({
  activeSubscription,
  onUpdateSubscription,
  trainers,
  preSelectedTrainerId
}) => {
  const [selectedPlanForStripe, setSelectedPlanForStripe] = useState<Plan | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const matchedTrainer = preSelectedTrainerId
    ? trainers.find((t) => t.id === preSelectedTrainerId)
    : null;

  const handleCancelSubscription = () => {
    onUpdateSubscription(null);
    setShowCancelConfirm(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Flexible Monthly Training Plans</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Simple, Transparent Monthly Tiers
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Vetted personal training delivered directly to your <strong className="text-emerald-400">home</strong> or at your <strong className="text-teal-400">gym of choice</strong>. Billed monthly. Pause or cancel anytime.
        </p>
      </div>

      {/* Active Subscription Status Banner if user is subscribed */}
      {activeSubscription && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Your Current Active Membership
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {activeSubscription.planName} (${activeSubscription.price}/month)
              </h3>
              <p className="text-xs text-slate-300">
                You have <strong className="text-emerald-400 font-bold">{activeSubscription.sessionsRemaining}</strong> of {activeSubscription.totalSessions} sessions remaining this billing period.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span>Next auto-renewal: {activeSubscription.renewalDate}</span>
                <span>•</span>
                <span className="capitalize">Card: {activeSubscription.paymentMethod.brand} •••• {activeSubscription.paymentMethod.last4}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-use-session"
                onClick={() => {
                  if (activeSubscription.sessionsRemaining > 0) {
                    onUpdateSubscription({
                      ...activeSubscription,
                      sessionsRemaining: activeSubscription.sessionsRemaining - 1
                    });
                  }
                }}
                disabled={activeSubscription.sessionsRemaining <= 0}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow"
              >
                Log Session Used (-1)
              </button>

              <button
                id="btn-manage-sub"
                onClick={() => setShowCancelConfirm(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-700 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {showCancelConfirm && (
            <div className="mt-3 p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center justify-between gap-2 text-xs text-red-300">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Are you sure you want to cancel your recurring monthly membership?</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelSubscription}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-xs"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs"
                >
                  Keep It
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_PLANS.map((plan) => {
          const isPro = plan.popular;
          const isCurrentActive = activeSubscription?.planId === plan.id;

          return (
            <div
              key={plan.id}
              id={`pricing-card-${plan.id}`}
              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all ${
                isPro
                  ? 'bg-gradient-to-b from-slate-850 via-slate-900 to-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-950/40 scale-102'
                  : 'bg-slate-900/90 border border-slate-800 shadow-lg'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MOST POPULAR • BEST VALUE</span>
                </div>
              )}

              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{plan.tagline}</p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-400">
                      / month
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      ${plan.perSessionRate.toFixed(2)} per session
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({plan.sessionsCount} sessions/mo)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Billed monthly • Rollover unused sessions
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-5 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Plan Includes:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                {isCurrentActive ? (
                  <button
                    disabled
                    className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your Current Plan</span>
                  </button>
                ) : (
                  <button
                    id={`btn-select-plan-${plan.id}`}
                    onClick={() => setSelectedPlanForStripe(plan)}
                    className={`w-full font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 ${
                      isPro
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Select Tier &amp; Pay via Stripe</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4 shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>Tier Comparison Breakdown</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Plan Feature</th>
                <th className="py-3 px-3 text-center">Starter ($169/mo)</th>
                <th className="py-3 px-3 text-center text-emerald-400 font-bold">Pro ($250/mo)</th>
                <th className="py-3 px-3 text-center">Elite ($349/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Sessions per Month</td>
                <td className="py-2.5 px-3 text-center">4 Sessions</td>
                <td className="py-2.5 px-3 text-center font-bold text-emerald-400">8 Sessions</td>
                <td className="py-2.5 px-3 text-center">12 Sessions</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Effective Cost / Session</td>
                <td className="py-2.5 px-3 text-center">$42.25</td>
                <td className="py-2.5 px-3 text-center font-bold text-emerald-400">$31.25</td>
                <td className="py-2.5 px-3 text-center">$29.08</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Meets at Home</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓ Yes</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓ Yes</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓ Yes</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Meets at Gym of Choice</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓ Yes</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓ Yes</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓ Yes</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Secure In-App Trainer Messaging</td>
                <td className="py-2.5 px-3 text-center text-emerald-400">Standard</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">Priority 24/7</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">Priority + Video</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Stripe Integrated Gateway</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓ Encrypted</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓ Encrypted</td>
                <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✓ Encrypted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Stripe Security Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 border border-[#635BFF]/30 flex items-center justify-center text-[#635BFF] shrink-0 font-black text-sm">
            Stripe
          </div>
          <div>
            <div className="text-white font-semibold flex items-center gap-1.5">
              <span>Encrypted Stripe Payment Processing</span>
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Card details are tokenized directly with Stripe. No sensitive financial data is ever stored on local servers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-slate-300 font-medium text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PCI-DSS Level 1 Certified</span>
        </div>
      </div>

      {/* Stripe Checkout Modal */}
      {selectedPlanForStripe && (
        <StripeCheckoutModal
          plan={selectedPlanForStripe}
          onClose={() => setSelectedPlanForStripe(null)}
          onPaymentSuccess={(sub) => {
            onUpdateSubscription(sub);
          }}
          trainerName={matchedTrainer?.name}
        />
      )}
    </div>
  );
};
