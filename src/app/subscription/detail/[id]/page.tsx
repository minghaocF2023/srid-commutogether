"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useSubscriptionStore } from "@/lib/stores/subscriptionStore";
import type { Subscription } from "@/lib/stores/subscriptionStore";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

const SubscriptionDetailPage = ({ params }: PageProps) => {
  const router = useRouter();
  const { id } = use(params);
  const subscription = useSubscriptionStore((state: { subscriptions: Subscription[] }) => 
    state.subscriptions.find(sub => sub.id === id)
  );
  const removeSubscription = useSubscriptionStore((state) => state.removeSubscription);

  if (!subscription) {
    router.push('/');
    return null;
  }

  const handleUnsubscribe = () => {
    removeSubscription(id);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      {/* Top Navigation */}
      <div className="flex items-center mb-6">
        <span className="text-sm">← back to home</span>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Subscription</h1>

      {/* Route Card */}
      <div className="bg-gray-800 text-white p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span>{subscription.stopName}</span>
          <span>→</span>
          <span>{subscription.destination}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>{subscription.departureTime}</span>
          <span>{subscription.arrivalTime}</span>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-6">
        <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
          {/* TO-DO: Replace with actual map implementation */}
          <div className="w-full h-full bg-gray-200" />
        </div>
        <p className="text-sm">Live tracking</p>
      </div>

      {/* Train Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          {['San Jose', 'Sunnyvale', 'MTV', 'San Francisco'].map((stop, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-1">
              </div>
              <span className="text-xs">{stop}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Messages */}
      <div className="space-y-2 mb-6">
        <div className="bg-red-500 text-white p-3 rounded-lg">
          Your train will arrive in 20 mins
        </div>
        <div className="bg-red-500 text-white p-3 rounded-lg">
          You should leave in 5 mins!
        </div>
      </div>

      {/* Unsubscribe Button */}
      <button
        onClick={handleUnsubscribe}
        className="w-full bg-red-500 text-white py-3 rounded-lg"
      >
        Unsubscribe
      </button>

      <Header />
    </div>
  );
};

export default SubscriptionDetailPage; 