"use client";
import React, { useRef, useCallback, useState } from "react";
import Map, { MapRef, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import photoData from "@/data/photos.json";
import { setupMap } from "@/utils/mapSetup";
import StyledButton from "@/components/StyledButton";
import FakeLocationMarker from "@/components/map/FakeLocationMarker";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

const MapPage = () => {
  const mapRef = useRef<MapRef | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 37.39,
    longitude: -122.07,
    zoom: 12, // Initial zoom level
  });
  const [fakeLocation, setFakeLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null); // State to store fake location
  const [isFakingLocation, setIsFakingLocation] = useState(false); // State for faking process
  const router = useRouter();

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    setupMap(map);
  }, []);

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

  const handleAddStory = () => {
    console.log("Add story clicked");
    router.push("/story");
  };

  const handleStartFakingLocation = () => {
    setIsFakingLocation(true);
  };

  const handleCancelFakingLocation = () => {
    setIsFakingLocation(false);
  };

  const handleDoneFakingLocation = () => {
    setFakeLocation({
      latitude: viewport.latitude,
      longitude: viewport.longitude,
    });
    setIsFakingLocation(false);
    console.log("Fake location set to:", viewport.latitude, viewport.longitude);
  };

  const MIN_ZOOM_FOR_MARKERS = 8; // Markers hidden below this zoom level

  return (
    <div className="relative w-screen h-screen">
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={viewport}
        onMove={onMove}
        minZoom={0}
        maxZoom={18}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onLoad={onMapLoad}
      >
        {/* Render Photo Markers */}
        {viewport.zoom >= MIN_ZOOM_FOR_MARKERS &&
          photoData.albums.map((album: any) => {
            const markerSize =
              viewport.zoom >= 12
                ? 100 // Cap size at 100px for zoom level >= 12
                : 30 + Math.pow((viewport.zoom - 8) / (12 - 8), 2) * (100 - 30); // Exponential scaling

            return (
              <Marker
                key={album.name}
                longitude={album.photos[0].longitude}
                latitude={album.photos[0].latitude}
                anchor="center"
              >
                <div className="relative text-center">
                  {/* Marker Image */}
                  <img
                    src={album.photos[0].photoUrl}
                    alt={album.name}
                    className="rounded-full border-4 border-red-500 shadow-md cursor-pointer transition-all"
                    style={{
                      width: `${markerSize}px`,
                      height: `${markerSize}px`,
                    }}
                  />
                  {/* Name on Hover */}
                  <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 transition-opacity hover:opacity-100">
                    {album.name}
                  </div>
                </div>
              </Marker>
            );
          })}

        {/* Render Fake Location Marker */}
        <FakeLocationMarker fakeLocation={fakeLocation} zoom={viewport.zoom} />

        {/* Render Needle at Map Center when faking location */}
        {isFakingLocation && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full"
            style={{ zIndex: 1000 }}
          >
            <div
              className="relative"
              style={{
                position: "relative",
                width: "64px",
                height: "64px",
              }}
            >
              <MapPin
                size={64}
                className="text-red-500"
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </div>
        )}
      </Map>

      {/* Add Story Button */}
      <div className="absolute bottom-[100px] left-1/2 transform -translate-x-1/2 z-[1000] shadow-lg rounded-lg">
        <StyledButton
          text="Add Story"
          onClick={handleAddStory}
          styleType="primary"
          className="add-story-button"
        />
      </div>

      {/* Fake Location Buttons */}
      <div className="absolute bottom-[160px] left-1/2 transform -translate-x-1/2 z-[1000] space-x-2 flex">
        {!isFakingLocation ? (
          <button
            onClick={handleStartFakingLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Fake Location
          </button>
        ) : (
          <>
            <button
              onClick={handleCancelFakingLocation}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDoneFakingLocation}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MapPage;
