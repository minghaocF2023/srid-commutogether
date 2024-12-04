"use client"
import { Avatar } from "@mui/material";
import Link from "next/link";
import Header from "@/components/Header";
import { useSubscriptionStore } from "@/lib/stores/subscriptionStore";
import type { Subscription } from "@/lib/stores/subscriptionStore";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const subscriptions = useSubscriptionStore((state: { subscriptions: Subscription[] }) => state.subscriptions);

  return (
    <div className="min-h-screen p-4 pb-20 bg-white">
      <div className="flex justify-between items-center mb-6">
        <p className="text-xl">Hi, Tommy</p>
        <Link href="/profile">
          <Avatar alt="Tommy" src="Tommy_Flanagan.webp" sx={{ width: 56, height: 56 }} />
        </Link>
      </div>

      {/* Subscription */}
      <div className="mb-5">
        <h2 className="text-lg mb-3">Subscribed Transit Schedule</h2>
        <Link href="/subscription">
          <button className="w-full bg-[#FFB800] text-white py-3 rounded-full text-center">
            New Subscription
          </button>
        </Link>

        {subscriptions.length > 0 && (
          <div className="mt-4 space-y-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-[#2C2C2C] text-white rounded-xl p-4 cursor-pointer"
                onClick={() => router.push(`/subscription/detail/${subscription.id}`)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span>Caltrain {subscription.date}</span>
                  <span className="bg-red-500 px-2 py-1 rounded-full text-sm">20 Minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p>{subscription.stopName}</p>
                    <p className="text-sm text-gray-400">{subscription.departureTime}</p>
                  </div>
                  <div className="text-center">→</div>
                  <div>
                    <p>{subscription.destination}</p>
                    <p className="text-sm text-gray-400">{subscription.arrivalTime}</p>
                  </div>
                </div>
                <button className="w-full text-center text-gray-400 mt-2">
                  Detail
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Header />
    </div>
  );
};

export default Home;
