import React, { useState } from 'react';
import {
  X,
  Lock,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Plan, Subscription } from '../types';

interface StripeCheckoutModalProps {
  plan: Plan | null;
  onClose: () => void;
  onPaymentSuccess: (subscription: Subscription) => void;
  trainerName?: string;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  plan,
  onClose,
  onPaymentSuccess,
  trainerName
}) => {
  if (!plan) return null;

  const [cardholderName, setCardholderName] = useState('Alex Rivera');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [rawCardNumber, setRawCardNumber] = useState('4242424242424242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [zip, setZip] = useState('90210');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [createdSubscription, setCreatedSubscription] = useState<Subscription | null>(null);

  // Format card number with spaces
  const handleCardNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    setRawCardNumber(digits);
    const spaced = digits.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(spaced);
  };

  const handleQuickFillSuccess = () => {
    setRawCardNumber('4242424242424242');
    setCardNumber('4242 4242 4242 4242');
    setExpiry('11/29');
    setCvc('424');
    setErrorMsg(null);
  };

  const handleQuickFillDecline = () => {
    setRawCardNumber('4000000000000002');
    setCardNumber('4000 0000 0000 0002');
    setExpiry('08/27');
    setCvc('999');
    setErrorMsg(null);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cardholderName.trim()) {
      setErrorMsg('Please enter cardholder full name.');
      return;
    }

    if (rawCardNumber.length < 15) {
      setErrorMsg('Please enter a complete 16-digit card number.');
      return;
    }

    setIsProcessing(true);

    // Simulate Stripe Gateway API call
    setTimeout(() => {
      setIsProcessing(false);

      if (rawCardNumber.endsWith('0002')) {
        setErrorMsg('Your card was declined by your bank (Stripe Test Error: generic_decline). Please use test card 4242.');
        return;
      }

      const today = new Date();
      const renewal = new Date();
      renewal.setDate(today.getDate() + 30);

      const brand = rawCardNumber.startsWith('3') ? 'amex' : rawCardNumber.startsWith('5') ? 'mastercard' : 'visa';
      const last4 = rawCardNumber.slice(-4) || '4242';

      const newSub: Subscription = {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        sessionsRemaining: plan.sessionsCount,
        totalSessions: plan.sessionsCount,
        status: 'active',
        startDate: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        renewalDate: renewal.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        paymentMethod: {
          brand,
          last4
        }
      };

      setCreatedSubscription(newSub);
      setPaymentDone(true);
      onPaymentSuccess(newSub);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Stripe Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#635BFF] text-white rounded-lg flex items-center justify-center font-black text-xs shadow-sm">
              S
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Stripe Secure Gateway</span>
                <Lock className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400">256-Bit SSL Encrypted Checkout</div>
            </div>
          </div>

          <button
            id="btn-close-stripe-modal"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentDone && createdSubscription ? (
          /* Payment Success View */
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-1">
                <Sparkles className="w-3 h-3" />
                Payment Authorized
              </div>
              <h3 className="text-xl font-bold text-white">Subscription Active!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your card has been billed <strong className="text-emerald-400">${createdSubscription.price}.00</strong> for the {createdSubscription.planName}.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-left space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Monthly Sessions Credited:</span>
                <span className="font-bold text-emerald-400">{createdSubscription.sessionsRemaining} Sessions</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Next Billing Date:</span>
                <span className="text-slate-200">{createdSubscription.renewalDate}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="text-slate-200 capitalize">{createdSubscription.paymentMethod.brand} •••• {createdSubscription.paymentMethod.last4}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Stripe Reference:</span>
                <span className="font-mono text-[11px] text-slate-400">sub_live_9f82k301x</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              You can now schedule sessions at your home or gym with any verified trainer!
            </p>

            <button
              id="btn-checkout-done"
              onClick={onClose}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md active:scale-98"
            >
              Start Booking With Trainers
            </button>
          </div>
        ) : (
          /* Payment Form View */
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Plan Summary Card */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Monthly Membership
                </span>
                <h4 className="text-base font-bold text-white">{plan.name}</h4>
                <p className="text-xs text-slate-400">
                  {plan.sessionsCount} In-person sessions/mo (${plan.perSessionRate.toFixed(2)}/ea)
                </p>
                {trainerName && (
                  <p className="text-[11px] text-teal-400 mt-0.5">
                    Selected with Coach {trainerName}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white">${plan.price}</div>
                <div className="text-[10px] text-slate-400">billed monthly</div>
              </div>
            </div>

            {/* 1-Click Express Pay Button */}
            <div>
              <button
                type="button"
                onClick={() => {
                  handleQuickFillSuccess();
                  setTimeout(() => {
                    document.getElementById('btn-submit-stripe')?.click();
                  }, 200);
                }}
                className="w-full bg-black hover:bg-zinc-900 border border-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>⚡ Express Pay with</span>
                <span className="font-bold tracking-tight">Apple Pay / Google Pay</span>
              </button>
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative bg-slate-900 px-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Or pay with card
                </span>
              </div>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-medium text-slate-300">Test Cards:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  id="btn-stripe-quick-fill-success"
                  onClick={handleQuickFillSuccess}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-semibold"
                >
                  Use 4242 (Success)
                </button>
                <button
                  type="button"
                  id="btn-stripe-quick-fill-decline"
                  onClick={handleQuickFillDecline}
                  className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-[10px] font-semibold"
                >
                  Test Decline
                </button>
              </div>
            </div>

            {/* Stripe Card Form */}
            <form onSubmit={handleProcessPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  id="stripe-name"
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#635BFF] focus:border-[#635BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Card Information</span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>Visa</span> • <span>MC</span> • <span>Amex</span>
                  </div>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="stripe-card-number"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#635BFF] focus:border-[#635BFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Expires</label>
                  <input
                    id="stripe-expiry"
                    type="text"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">CVC</label>
                  <input
                    id="stripe-cvc"
                    type="text"
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Billing ZIP</label>
                  <input
                    id="stripe-zip"
                    type="text"
                    maxLength={5}
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="ZIP"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl text-xs text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                id="btn-submit-stripe"
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#635BFF] hover:bg-[#5851EA] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing with Stripe...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Subscribe ${plan.price}.00 / month</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-[10px] text-slate-500 text-center space-y-0.5 pt-1">
              <div>By confirming payment, you authorize recurring monthly charges.</div>
              <div>Cancel anytime in app with no penalty or hidden cancellation fees.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
