import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Lock,
  ShieldCheck,
  MapPin,
  Home,
  Dumbbell,
  Calendar,
  Check,
  CheckCheck,
  Sparkles,
  Clock,
  ChevronLeft,
  CalendarCheck2,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { Trainer, Message } from '../types';

interface SecureMessagingProps {
  trainers: Trainer[];
  activeTrainerId: string;
  onSelectTrainer: (id: string) => void;
  messages: Record<string, Message[]>;
  onSendMessage: (trainerId: string, text: string, options?: Partial<Message>) => void;
  userZip: string;
}

export const SecureMessaging: React.FC<SecureMessagingProps> = ({
  trainers,
  activeTrainerId,
  onSelectTrainer,
  messages,
  onSendMessage,
  userZip
}) => {
  const [inputText, setInputText] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [proposedDate, setProposedDate] = useState('Tomorrow');
  const [proposedTime, setProposedTime] = useState('6:00 PM');
  const [proposedLocType, setProposedLocType] = useState<'home' | 'gym'>('home');
  const [proposedLocDetails, setProposedLocDetails] = useState(`My Home in ${userZip}`);
  const [mobileConversationView, setMobileConversationView] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTrainer = trainers.find((t) => t.id === activeTrainerId) || trainers[0];
  const activeThread = (activeTrainer ? messages[activeTrainer.id] : []) || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeTrainer) return;

    onSendMessage(activeTrainer.id, inputText.trim());
    setInputText('');
  };

  const handleQuickLocationShare = (type: 'home' | 'gym', addressOrGym: string) => {
    if (!activeTrainer) return;
    const text = type === 'home'
      ? `📍 Home Address Shared: ${addressOrGym}. Looking forward to training here!`
      : `🏋️ Gym Location Suggested: ${addressOrGym}. Let's meet at the reception!`;

    onSendMessage(activeTrainer.id, text, {
      isLocationShare: true,
      locationData: {
        type,
        nameOrAddress: addressOrGym
      }
    });
    setShowLocationPicker(false);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrainer) return;

    const locLabel = proposedLocType === 'home' ? `Home: ${proposedLocDetails}` : `Gym: ${proposedLocDetails}`;
    const text = `📅 Session Proposal: ${proposedDate} at ${proposedTime} (${locLabel})`;

    onSendMessage(activeTrainer.id, text, {
      sessionProposal: {
        date: proposedDate,
        time: proposedTime,
        location: locLabel,
        status: 'pending'
      }
    });

    setShowScheduleModal(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4 h-[calc(100vh-140px)] min-h-[580px] max-h-[820px] flex flex-col">
      {/* Container with conversations list and active chat */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex relative">
        {/* Left / Sidebar: Conversations Thread List */}
        <aside
          className={`w-full md:w-80 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 ${
            mobileConversationView ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Trainer Messages</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </h2>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>256-bit Encrypted</span>
              </div>
            </div>
          </div>

          {/* Trainer Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-850">
            {trainers.map((trainer) => {
              const thread = messages[trainer.id] || [];
              const lastMsg = thread[thread.length - 1];
              const isSelected = trainer.id === activeTrainer?.id;

              return (
                <button
                  key={trainer.id}
                  id={`thread-trainer-${trainer.id}`}
                  onClick={() => {
                    onSelectTrainer(trainer.id);
                    setMobileConversationView(true);
                  }}
                  className={`w-full p-3 text-left flex items-start gap-3 transition-colors ${
                    isSelected
                      ? 'bg-slate-850/90 border-l-4 border-emerald-500'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={trainer.avatarUrl}
                      alt={trainer.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                    {trainer.isBackgroundChecked && (
                      <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-slate-950 p-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {trainer.name}
                      </h4>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {lastMsg.timestamp.replace('Today at ', '').replace('Yesterday at ', 'Yday ')}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-emerald-400 font-medium truncate">
                      {trainer.credentials[0]} • {trainer.city}
                    </div>

                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {lastMsg ? lastMsg.text : 'Start chatting with ' + trainer.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right / Main: Active Chat Pane */}
        {activeTrainer ? (
          <main
            className={`flex-1 flex flex-col bg-slate-900 overflow-hidden ${
              !mobileConversationView ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Active Trainer Header */}
            <div className="p-3 sm:p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Mobile Back to Threads */}
                <button
                  id="btn-back-to-threads"
                  onClick={() => setMobileConversationView(false)}
                  className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="relative">
                  <img
                    src={activeTrainer.avatarUrl}
                    alt={activeTrainer.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-white">{activeTrainer.name}</h3>
                    <span className="hidden sm:inline text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                      Verified Coach
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Meets: {activeTrainer.locationsSupported.map((l) => l === 'home' ? 'Home' : 'Gym').join(' & ')}</span>
                    <span>•</span>
                    <span>ZIP {activeTrainer.primaryZip}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-open-schedule-modal"
                  onClick={() => setShowScheduleModal(true)}
                  className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Propose Session</span>
                </button>
              </div>
            </div>

            {/* Encryption notice banner */}
            <div className="bg-slate-950/40 border-b border-slate-800/60 px-3 py-1.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>
                End-to-end encrypted trainer communication. All session notes &amp; addresses are strictly confidential.
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Coach Intro Blurb Bubble */}
              <div className="max-w-md mx-auto bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-white flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Coach {activeTrainer.name} is Background Cleared</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  &ldquo;{activeTrainer.blurb}&rdquo;
                </p>
                <div className="text-[10px] text-emerald-400 font-semibold pt-0.5">
                  Certifications: {activeTrainer.credentials.join(' • ')}
                </div>
              </div>

              {activeThread.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-md rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md shadow-emerald-950/20'
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/80'
                      }`}
                    >
                      {/* Session Proposal Card if message contains one */}
                      {msg.sessionProposal && (
                        <div className="mb-2 p-2.5 bg-slate-950/50 rounded-xl border border-white/20 text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-emerald-300 font-bold">
                            <span className="flex items-center gap-1">
                              <CalendarCheck2 className="w-4 h-4" />
                              <span>Workout Proposal</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 px-1.5 py-0.5 rounded">
                              Confirmed
                            </span>
                          </div>
                          <div className="text-white font-medium">
                            {msg.sessionProposal.date} @ {msg.sessionProposal.time}
                          </div>
                          <div className="text-[11px] text-slate-300">
                            Location: {msg.sessionProposal.location}
                          </div>
                        </div>
                      )}

                      <p>{msg.text}</p>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 px-1">
                      <span>{msg.timestamp}</span>
                      {isUser && (
                        <CheckCheck className="w-3 h-3 text-emerald-400 inline" />
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="bg-slate-950/80 px-3 py-1.5 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-300">
              <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold shrink-0">
                Quick Actions:
              </span>
              <button
                id="btn-quick-home"
                onClick={() => setShowLocationPicker(true)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Home className="w-3 h-3 text-emerald-400" />
                <span>Share Home Address</span>
              </button>
              <button
                id="btn-quick-gym"
                onClick={() => {
                  const gymChoice = activeTrainer.preferredGyms?.[0] || 'Local Equinox / Crunch';
                  handleQuickLocationShare('gym', gymChoice);
                }}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Dumbbell className="w-3 h-3 text-teal-400" />
                <span>Suggest Gym Meeting</span>
              </button>
              <button
                id="btn-quick-schedule"
                onClick={() => setShowScheduleModal(true)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Schedule Session</span>
              </button>
            </div>

            {/* Message Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                id="input-chat-message"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message Coach ${activeTrainer.name.split(' ')[0]}...`}
                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
              />

              <button
                id="btn-send-message"
                type="submit"
                disabled={!inputText.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 p-2.5 rounded-xl transition-all shadow active:scale-95 shrink-0"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </main>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center text-slate-400">
            Select a trainer from the left to start a secure conversation.
          </div>
        )}
      </div>

      {/* Quick Location Picker Modal */}
      {showLocationPicker && activeTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Share Home Location</span>
            </h3>
            <p className="text-xs text-slate-400">
              Provide your address for Coach {activeTrainer.name} to travel to your private residence for sessions.
            </p>

            <div className="space-y-2">
              <button
                id="btn-select-home-sample-1"
                onClick={() => handleQuickLocationShare('home', `452 Linden Terrace, ZIP ${userZip}`)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>452 Linden Terrace (Home &amp; Patio)</span>
                <span className="text-[10px] text-emerald-400">ZIP {userZip}</span>
              </button>
              <button
                id="btn-select-home-sample-2"
                onClick={() => handleQuickLocationShare('home', `1880 Ocean Blvd #4B (Condo Gym), ZIP ${userZip}`)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>1880 Ocean Blvd (Building Gym)</span>
                <span className="text-[10px] text-emerald-400">ZIP {userZip}</span>
              </button>
            </div>

            <button
              onClick={() => setShowLocationPicker(false)}
              className="w-full py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Schedule Proposal Modal */}
      {showScheduleModal && activeTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Propose Workout Session</span>
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Day</label>
                <select
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Saturday Morning">Saturday Morning</option>
                  <option value="Next Monday">Next Monday</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Session Time</label>
                <select
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="7:00 AM (Early Bird)">7:00 AM (Early Bird)</option>
                  <option value="9:30 AM">9:30 AM</option>
                  <option value="12:00 PM (Lunch Break)">12:00 PM (Lunch Break)</option>
                  <option value="5:30 PM">5:30 PM</option>
                  <option value="6:30 PM (Post-Work)">6:30 PM (Post-Work)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Meeting Location</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProposedLocType('home');
                      setProposedLocDetails(`My Residence in ZIP ${userZip}`);
                    }}
                    className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-semibold ${
                      proposedLocType === 'home'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-950 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>My Home</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProposedLocType('gym');
                      setProposedLocDetails(activeTrainer.preferredGyms?.[0] || 'Local Equinox');
                    }}
                    className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-semibold ${
                      proposedLocType === 'gym'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-950 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>Gym of Choice</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={proposedLocDetails}
                  onChange={(e) => setProposedLocDetails(e.target.value)}
                  placeholder="Address or Gym Name"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl shadow transition-all"
                >
                  Send Proposal to Coach {activeTrainer.name.split(' ')[0]}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
