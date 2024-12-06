"use client";
import React, { useRef, use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useSubscriptionStore } from "@/lib/stores/subscriptionStore";
import type { Subscription } from "@/lib/stores/subscriptionStore";
import Map, { MapRef, Marker } from "react-map-gl";
import { setupMap } from "@/utils/mapSetup";
import useLocalStorage from "@/hook/useLocalStorage";
import FakeLocationMarker from "@/components/map/FakeLocationMarker";

interface PageProps {
  params: Promise<{ id: string }>;
}

const SubscriptionDetailPage = ({ params }: PageProps) => {
  const mapRef = useRef<MapRef | null>(null);
  const router = useRouter();
  const { id } = use(params);
  const subscription = useSubscriptionStore(
    (state: { subscriptions: Subscription[] }) =>
      state.subscriptions.find((sub) => sub.id === id)
  );
  const removeSubscription = useSubscriptionStore(
    (state) => state.removeSubscription
  );
  const [showNotification, setShowNotification] = useState(true);
  const [fakeLocation, setFakeLocation] = useLocalStorage<{
    latitude: number;
    longitude: number;
  } | null>("location", null); // State to store fake location
  const [viewport, setViewport] = useState({
    latitude: fakeLocation?.latitude || 37.4104,
    longitude: fakeLocation?.longitude || -122.059,
    zoom: 13, // Initial zoom level
  });

  const onMove = useCallback(
    (evt: { viewState: { latitude: any; longitude: any; zoom: any } }) => {
      setViewport({
        latitude: evt.viewState.latitude,
        longitude: evt.viewState.longitude,
        zoom: evt.viewState.zoom,
      });
    },
    []
  );

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    setupMap(map);
    map.setLayerZoomRange(
      "transitland-route-names-layer",
      8,
      map.getLayer("transitland-route-names-layer")?.maxzoom || 22
    );
    map.setLayoutProperty("transit-label", "text-allow-overlap", true);
    map.setLayoutProperty("transit-label", "icon-allow-overlap", true);
    map.setLayoutProperty("transit-label", "symbol-z-order", "viewport-y");

    // if no fake location, set to current location
    setViewport({
      latitude: 37.7762,
      longitude: -122.3949,
      zoom: 13,
    });
    map.flyTo({
      center: [-122.3949, 37.7762],
      zoom: 13,
      essential: true,
    });
  }, [fakeLocation, setFakeLocation]);

  useEffect(() => {
    if (!subscription) {
      router.push("/");
    }
  }, [subscription, router]);

  if (!subscription) {
    return null;
  }

  const handleUnsubscribe = () => {
    removeSubscription(id);
    router.push("/");
  };

  // determine train position
  const getTrainPosition = (from: string, to: string): number => {
    const stations = ["San Jose", "Sunnyvale", "MTV", "San Francisco"];
    const fromIndex = stations.findIndex(
      (station) => station === (from === "Mountain View" ? "MTV" : from)
    );
    const toIndex = stations.findIndex(
      (station) => station === (to === "Mountain View" ? "MTV" : to)
    );

    // Calculate a position between the stations
    const totalStops = Math.abs(toIndex - fromIndex);
    const progress = Math.floor(Math.random() * (totalStops + 1));
    return fromIndex + (toIndex > fromIndex ? progress : -progress);
  };

  const currentPosition = getTrainPosition(
    subscription.stopName,
    subscription.destination
  );

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed inset-x-0 top-0 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg mx-auto max-w-md p-4">
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-3">
                <p className="text-green-700">
                  Your train will arrive in 20 minutes
                </p>
              </div>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-3">
                <p className="text-orange-700">
                  You should leave in 5 minutes!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center mb-6">
        <span
          className="text-sm cursor-pointer flex items-center"
          onClick={() => router.back()}
        >
          ← back to home
        </span>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Train Schedule</h1>

      {/* Status Information */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <p className="text-sm">Train arrives in 20 minutes</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <p className="text-sm">Recommended departure in 5 minutes</p>
        </div>
      </div>

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
          <Map
            ref={mapRef}
            onMove={onMove}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            initialViewState={viewport}
            minZoom={0}
            maxZoom={18}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/chunzhix/cm4cpjaw801fj01rdgeb0btsp"
            onLoad={onMapLoad}
            icon-allow-overlap={true}
          ></Map>
        </div>
        <p className="text-sm">Live tracking</p>
      </div>

      {/* Train Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          {["San Jose", "Sunnyvale", "MTV", "San Francisco"].map(
            (stop, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === currentPosition
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>
                <span className="text-xs">{stop}</span>
              </div>
            )
          )}
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
