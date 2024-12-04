import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subscription {
  id: string;
  stopId: string;
  stopName: string;
  departureTime: string;
  arrivalTime: string;
  destination: string;
  date: string;
  routeId: string;
}

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  removeSubscription: (id: string) => void;
  hasSubscription: (routeId: string) => boolean;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      addSubscription: (subscription) =>
        set((state) => ({
          subscriptions: [...state.subscriptions, subscription],
        })),
      removeSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        })),
      hasSubscription: (routeId) => 
        get().subscriptions.some((sub) => sub.routeId === routeId),
    }),
    {
      name: 'subscription-storage',
    }
  )
); 