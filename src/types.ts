export type LocationType = 'home' | 'gym';

export interface Trainer {
  id: string;
  name: string;
  avatarUrl: string;
  headline: string;
  primaryZip: string;
  city: string;
  state: string;
  serviceRadiusMiles: number;
  locationsSupported: LocationType[];
  credentials: string[];
  yearsExperience: number;
  specialties: string[];
  blurb: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  isBackgroundChecked: boolean;
  backgroundCheckDate?: string;
  isAccredited: boolean;
  insuranceVerified: boolean;
  preferredGyms?: string[];
  joinedDate: string;
  active: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  sessionsCount: number;
  billingCadence: 'monthly';
  perSessionRate: number;
  popular?: boolean;
  tagline: string;
  features: string[];
}

export interface Message {
  id: string;
  trainerId: string;
  sender: 'user' | 'trainer' | 'system';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isLocationShare?: boolean;
  locationData?: {
    type: LocationType;
    nameOrAddress: string;
  };
  sessionProposal?: {
    date: string;
    time: string;
    location: string;
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface ConversationThread {
  trainerId: string;
  messages: Message[];
  unreadCount: number;
  lastMessageText: string;
  lastMessageTimestamp: string;
}

export interface Subscription {
  planId: string;
  planName: string;
  price: number;
  sessionsRemaining: number;
  totalSessions: number;
  status: 'active' | 'cancelled';
  startDate: string;
  renewalDate: string;
  paymentMethod: {
    brand: 'visa' | 'mastercard' | 'amex';
    last4: string;
  };
  assignedTrainerId?: string;
}

export type PlatformMode = 'ios' | 'android' | 'web';
export type AppTab = 'search' | 'vetting' | 'plans' | 'messages' | 'admin';
