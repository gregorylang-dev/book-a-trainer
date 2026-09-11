import React, { useState, useEffect } from 'react';
import { Trainer, AppTab, PlatformMode, Subscription, Message } from './types';
import { INITIAL_TRAINERS, INITIAL_MESSAGES } from './data/initialData';
import { PlatformBar } from './components/PlatformBar';
import { DeviceFrame } from './components/DeviceFrame';
import { Navigation } from './components/Navigation';
import { TrainerSearch } from './components/TrainerSearch';
import { VettingSafetyPage } from './components/VettingSafetyPage';
import { PlansPricingPage } from './components/PlansPricingPage';
import { SecureMessaging } from './components/SecureMessaging';
import { AdminSection } from './components/AdminSection';

const STORAGE_KEY_TRAINERS = 'bookatrainer_trainers_v1';
const STORAGE_KEY_SUB = 'bookatrainer_subscription_v1';
const STORAGE_KEY_MESSAGES = 'bookatrainer_messages_v1';

export default function App() {
  // Platform simulation mode (iOS iPhone, Android Pixel, or Full Responsive Web)
  const [platformMode, setPlatformMode] = useState<PlatformMode>('ios');

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<AppTab>('search');
  const [navHistory, setNavHistory] = useState<AppTab[]>(['search']);

  // Trainers state with local persistence
  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TRAINERS) || localStorage.getItem('fitlink_trainers_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved trainers', e);
      }
    }
    return INITIAL_TRAINERS;
  });

  // Stripe subscription state
  const [subscription, setSubscription] = useState<Subscription | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SUB) || localStorage.getItem('fitlink_subscription_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse subscription', e);
      }
    }
    return null;
  });

  // Messages state
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MESSAGES) || localStorage.getItem('fitlink_messages_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
    return INITIAL_MESSAGES;
  });

  // Active chat coach id
  const [activeTrainerChatId, setActiveTrainerChatId] = useState<string>('tr-1');

  // Tagged trainer when jumping to plans page
  const [preSelectedTrainerId, setPreSelectedTrainerId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRAINERS, JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    if (subscription) {
      localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(subscription));
    } else {
      localStorage.removeItem(STORAGE_KEY_SUB);
    }
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // Handle Tab Navigation with history
  const handleSelectTab = (newTab: AppTab) => {
    setNavHistory((prev) => [...prev, newTab]);
    setCurrentTab(newTab);
  };

  const handleDeviceBack = () => {
    if (navHistory.length > 1) {
      const nextHistory = [...navHistory];
      nextHistory.pop(); // Remove current
      const prevTab = nextHistory[nextHistory.length - 1];
      setNavHistory(nextHistory);
      setCurrentTab(prevTab);
    }
  };

  // Start chat with a specific trainer from card or modal
  const handleStartMessageWithTrainer = (trainerId: string) => {
    setActiveTrainerChatId(trainerId);
    handleSelectTab('messages');

    // If no existing thread, create an opening greeting
    if (!messages[trainerId]) {
      const coach = trainers.find((t) => t.id === trainerId);
      const coachName = coach ? coach.name : 'Your Coach';
      const initialThread: Message[] = [
        {
          id: 'welcome-' + Date.now(),
          trainerId,
          sender: 'trainer',
          text: `Hi there! I am ${coachName}. Thanks for reaching out. Are you interested in in-home training or meeting at a local gym?`,
          timestamp: 'Just now',
          status: 'delivered'
        }
      ];
      setMessages((prev) => ({
        ...prev,
        [trainerId]: initialThread
      }));
    }
  };

  // User selects a plan for a specific trainer
  const handleSelectPlanForTrainer = (trainerId: string) => {
    setPreSelectedTrainerId(trainerId);
    handleSelectTab('plans');
  };

  // Send message and simulate realistic coach reply
  const handleSendMessage = (trainerId: string, text: string, options?: Partial<Message>) => {
    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      trainerId,
      sender: 'user',
      text,
      timestamp: 'Just now',
      status: 'sent',
      ...options
    };

    setMessages((prev) => ({
      ...prev,
      [trainerId]: [...(prev[trainerId] || []), userMsg]
    }));

    // Interactive realistic reply from coach after short delay
    setTimeout(() => {
      const coach = trainers.find((t) => t.id === trainerId);
      const coachFirstName = coach ? coach.name.split(' ')[0] : 'Coach';

      let replyText = `Thanks for your note! I have received your request and will make sure our training program matches your exact goals.`;

      if (options?.isLocationShare) {
        replyText = `Great location! I have noted the address. I'll bring resistance bands, suspension straps, and agility gear.`;
      } else if (options?.sessionProposal) {
        replyText = `Perfect! I have reviewed your proposed time (${options.sessionProposal.date} @ ${options.sessionProposal.time}) and confirmed it in my calendar. Let's do it!`;
      } else if (text.toLowerCase().includes('home')) {
        replyText = `In-home sessions are fantastic. I bring clean sanitized gear and need just an open 6x6 area. What time of day works best?`;
      } else if (text.toLowerCase().includes('gym')) {
        replyText = `Meeting at the gym is great! Which club do you prefer, or should we use your building fitness center?`;
      } else {
        replyText = `Sounds great! Feel free to choose either the 4-session ($169/mo) or 8-session ($250/mo) tier on our Plans tab, and we will get started right away!`;
      }

      const coachReply: Message = {
        id: 'reply-' + Date.now(),
        trainerId,
        sender: 'trainer',
        text: replyText,
        timestamp: 'Just now',
        status: 'delivered'
      };

      setMessages((prev) => ({
        ...prev,
        [trainerId]: [...(prev[trainerId] || []), coachReply]
      }));
    }, 1200);
  };

  // Admin Actions
  const handleAddTrainer = (newTrainer: Trainer) => {
    setTrainers((prev) => [newTrainer, ...prev]);
  };

  const handleDeleteTrainer = (id: string) => {
    if (confirm('Are you sure you want to remove this trainer from the directory?')) {
      setTrainers((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleToggleTrainerStatus = (id: string) => {
    setTrainers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const handleResetTrainers = () => {
    if (confirm('Reset to initial certified trainers dataset?')) {
      setTrainers(INITIAL_TRAINERS);
      localStorage.removeItem(STORAGE_KEY_TRAINERS);
    }
  };

  const handleViewTrainerInSearch = (zip: string) => {
    handleSelectTab('search');
  };

  // Unread messages calculation
  const totalUnreadCount = 0; // Simple indicator for navigation

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Device & Platform Simulator Switcher */}
      <PlatformBar
        platformMode={platformMode}
        onPlatformChange={(mode) => setPlatformMode(mode)}
      />

      {/* Frame: Renders in iPhone/Pixel Chassis or Web Mode */}
      <DeviceFrame
        platformMode={platformMode}
        onBack={handleDeviceBack}
        canGoBack={navHistory.length > 1}
      >
        {/* If in Web mode, top navigation sits here */}
        {platformMode === 'web' && (
          <Navigation
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            platformMode={platformMode}
            unreadCount={totalUnreadCount}
          />
        )}

        {/* Dynamic Screen Content Based on Current Tab */}
        <div className="flex-1 pb-16 sm:pb-4">
          {currentTab === 'search' && (
            <TrainerSearch
              trainers={trainers}
              onStartMessage={handleStartMessageWithTrainer}
              onSelectPlanForTrainer={handleSelectPlanForTrainer}
            />
          )}

          {currentTab === 'vetting' && <VettingSafetyPage />}

          {currentTab === 'plans' && (
            <PlansPricingPage
              activeSubscription={subscription}
              onUpdateSubscription={setSubscription}
              trainers={trainers}
              preSelectedTrainerId={preSelectedTrainerId}
            />
          )}

          {currentTab === 'messages' && (
            <SecureMessaging
              trainers={trainers}
              activeTrainerId={activeTrainerChatId}
              onSelectTrainer={(id) => setActiveTrainerChatId(id)}
              messages={messages}
              onSendMessage={handleSendMessage}
              userZip="90210"
            />
          )}

          {currentTab === 'admin' && (
            <AdminSection
              trainers={trainers}
              onAddTrainer={handleAddTrainer}
              onDeleteTrainer={handleDeleteTrainer}
              onToggleTrainerStatus={handleToggleTrainerStatus}
              onViewTrainerInSearch={handleViewTrainerInSearch}
              onResetTrainers={handleResetTrainers}
            />
          )}
        </div>

        {/* If in Mobile mode (iOS or Android), bottom tab navigation bar */}
        {platformMode !== 'web' && (
          <Navigation
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            platformMode={platformMode}
            unreadCount={totalUnreadCount}
          />
        )}
      </DeviceFrame>
    </div>
  );
}
