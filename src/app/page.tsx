"use client";
import { Avatar } from "@mui/material";
import Link from "next/link";
import Header from "@/components/Header";
import { useSubscriptionStore } from "@/lib/stores/subscriptionStore";
import type { Subscription } from "@/lib/stores/subscriptionStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Define the memory images directly
const memoryImages = [
  { id: 1, src: "/memories/memory1.jpg", width: 800, height: 600 },
  { id: 2, src: "/memories/memory2.jpeg", width: 800, height: 600 },
  { id: 3, src: "/memories/memory3.jpg", width: 800, height: 600 },
  { id: 4, src: "/memories/memory4.jpeg", width: 800, height: 600 },
];

const Home = () => {
  const router = useRouter();
  const subscriptions = useSubscriptionStore(
    (state: { subscriptions: Subscription[] }) => state.subscriptions
  );
  const [aspectRatio, setAspectRatio] = useState<number>(2);
  const [scrollToTop, setScrollToTop] = useState<boolean>(true);
  const [showPreferences, setShowPreferences] = useState(false);

  const handleScroll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.scrollTop === 0) {
      setScrollToTop(true);
    } else {
      setScrollToTop(false);
    }
  };

  useEffect(() => {
    const updateAspectRatio = () => {
      const width = window.innerWidth - 32;
      setAspectRatio(width / (width * 0.4)); // Reduced height ratio to 0.4
    };

    updateAspectRatio();
    window.addEventListener("resize", updateAspectRatio);
    return () => window.removeEventListener("resize", updateAspectRatio);
  }, []);

  const handleEditPreference = () => {
    setShowPreferences(true);
  };

  return (
    <div
      onScroll={() => handleScroll}
      className="max-h-screen  pb-20 bg-white overflow-y-auto"
    >
      {/* Header */}
      <div
        className={
          "sticky z-50 bg-white top-0 p-4  flex justify-between items-center mb-6" +
          (scrollToTop ? " shadow-none" : " shadow")
        }
      >
        <div className="flex items-center justify-center gap-3">
          <img src="/logo.png" alt="Commutogther" className="w-10" />
          <h1 className="text-xl">Hi, Tommy</h1>
        </div>

        <Link href="/profile">
          <Avatar
            alt="Tommy"
            src="Tommy_Flanagan.webp"
            sx={{ width: 56, height: 56 }}
          />
        </Link>
      </div>

      <div className="px-4">
        {/* Transportation Preference */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Transportation Preference</p>
          <div className="flex justify-between items-center mt-2 bg-white rounded-lg border border-[#FFB800] p-4">
            <div>
              <h2 className="text-2xl font-bold">Caltrain</h2>
              <button
                onClick={handleEditPreference}
                className="bg-[#F5A524] text-white px-4 py-1 rounded text-sm mt-2"
              >
                Edit Preference
              </button>
            </div>
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <Image
                src="/caltrain.jpg"
                alt="Caltrain"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Preference Selection Modal */}
        {showPreferences && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-[90%] max-w-md">
              <h3 className="text-xl font-semibold mb-4">Preference Setting</h3>

              {/* Caltrain Option */}
              <div className="border-2 border-[#F5A524] rounded p-4 mb-3 flex justify-between items-center">
                <span className="text-lg">Caltrain</span>
                <Image
                  src="/caltrain.jpg"
                  alt="Caltrain"
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </div>

              {/* Disabled Options */}
              <div className="border rounded-lg p-4 mb-3 flex justify-between items-center opacity-50">
                <span className="text-lg">Bart</span>
                <Image
                  src="/bart.jpg"
                  alt="Bart"
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </div>

              <div className="border rounded-lg p-4 mb-6 flex justify-between items-center opacity-50">
                <span className="text-lg">Bus</span>
                <Image
                  src="/bus.jpg"
                  alt="Bus"
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 py-2 bg-gray-200 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 py-2 bg-[#F5A524] text-white rounded"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Memory Section */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Memory</p>
          <div className="mt-2 rounded-2xl overflow-hidden">
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
              }}
              className="w-full aspect-[16/9]"
              loop={true}
            >
              {memoryImages.map((memory) => (
                <SwiperSlide key={memory.id} className="w-full h-full">
                  <div className="relative w-full h-full bg-gray-100">
                    <img
                      src={memory.src}
                      alt={`Memory ${memory.id}`}
                      className="object-cover w-full h-full"
                    />
                    {/* <Image
                      src={memory.src}
                      alt={`Memory ${memory.id}`}
                      fill
                      style={{
                        objectFit: "contain",
                        backgroundColor: "rgb(243 244 246)",
                        padding: "4px",
                      }}
                      sizes="(max-width: 768px) 100vw"
                      className="hover:scale-105 transition-transform duration-300"
                    /> */}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Subscription */}
        <div className="mb-5">
          <h2 className="text-lg mb-3">Subscribed Transit Schedule</h2>
          <Link href="/subscription">
            <button className="w-full bg-[#F5A524] text-white py-3 rounded text-center">
              New Subscription
            </button>
          </Link>

          {subscriptions.length > 0 && (
            <div className="mt-4 space-y-4">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="bg-[#2C2C2C] text-white rounded-xl p-4 cursor-pointer"
                  onClick={() =>
                    router.push(`/subscription/detail/${subscription.id}`)
                  }
                >
                  <div className="flex justify-between items-center mb-2">
                    <span>Caltrain {subscription.date}</span>
                    <span className="bg-red-500 px-2 py-1 rounded-full text-sm">
                      20 Minutes
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p>{subscription.stopName}</p>
                      <p className="text-sm text-gray-400">
                        {subscription.departureTime}
                      </p>
                    </div>
                    <div className="text-center">→</div>
                    <div>
                      <p>{subscription.destination}</p>
                      <p className="text-sm text-gray-400">
                        {subscription.arrivalTime}
                      </p>
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
      </div>

      <Header />
    </div>
  );
};

export default Home;
