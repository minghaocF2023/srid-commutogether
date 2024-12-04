"use client";
import React, { useRef, useCallback, useState, useEffect } from "react";
import Map, { MapRef, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import photoData from "@/data/photos.json";
import { setupMap } from "@/utils/mapSetup";
import StyledButton from "@/components/StyledButton";
import FakeLocationMarker from "@/components/map/FakeLocationMarker";
import { useRouter } from "next/navigation";
import { MapPin, LocateFixed } from "lucide-react";
import useLocalStorage from "@/hook/useLocalStorage";

const MapPage = () => {
  const mapRef = useRef<MapRef | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 37.39,
    longitude: -122.07,
    zoom: 8, // Initial zoom level
  });
  const [fakeLocation, setFakeLocation] = useLocalStorage<{
    latitude: number;
    longitude: number;
  } | null>("location", null); // State to store fake location
  const [isFakingLocation, setIsFakingLocation] = useState(false); // State for faking process
  const [closestAlbumId, setClosestAlbumId] = useState<string | null>(null); // Closest album ID
  const router = useRouter();

  // Fetch and set the user's actual location
  const fetchAndSetLocation = () => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Update viewport and animate the map to user's location
        setViewport({
          latitude,
          longitude,
          zoom: 8,
        });

        map.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true,
        });

        setFakeLocation({ latitude, longitude });
        console.log("Actual location set to:", latitude, longitude);
      },
      (error) => {
        console.error("Error fetching geolocation:", error.message);
      }
    );
  };

  // Move the map to the stored fake location
  const moveToStoredLocation = () => {
    if (!fakeLocation || !mapRef.current) {
      console.log("No stored location found.");
      return;
    }
    const map = mapRef.current.getMap();
    map.flyTo({
      center: [fakeLocation.longitude, fakeLocation.latitude],
      zoom: 14,
      essential: true,
    });
    console.log("Moved map to stored location:", fakeLocation);
  };

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    setupMap(map);

    // If a fake location is already stored, fly to it
    if (fakeLocation) {
      setViewport({
        latitude: fakeLocation.latitude,
        longitude: fakeLocation.longitude,
        zoom: 14,
      });

      map.flyTo({
        center: [fakeLocation.longitude, fakeLocation.latitude],
        zoom: 14,
        essential: true,
      });

      console.log(
        "Fake location loaded from storage:",
        fakeLocation.latitude,
        fakeLocation.longitude
      );
    }
  }, [fakeLocation]);

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
    if (closestAlbumId) {
      router.push(`/story?id=${closestAlbumId}`);
    } else {
      router.push("/story");
    }
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

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (fakeLocation) {
      let closestId = null;
      let minDistance = Infinity;

      photoData.albums.forEach((album) => {
        const distance = calculateDistance(
          fakeLocation.latitude,
          fakeLocation.longitude,
          album.photos[0].latitude,
          album.photos[0].longitude
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestId = album.albumId;
        }
      });

      setClosestAlbumId(closestId);
    }
  }, [fakeLocation]);

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
            const isHighlighted = album.albumId === closestAlbumId;
            const markerSize =
              viewport.zoom >= 12
                ? 100 // Cap size at 100px for zoom level >= 12
                : 30 + Math.pow((viewport.zoom - 8) / (12 - 8), 2) * (100 - 30); // Exponential scaling

            return (
              <Marker
                key={album.albumId}
                longitude={album.photos[0].longitude}
                latitude={album.photos[0].latitude}
                anchor="center"
              >
                <div
                  className="relative text-center"
                  onClick={() => router.push(`/stories/?id=${album.albumId}`)} // Navigate to stories page
                >
                  {/* Marker Image */}
                  <div
                    className={`rounded-full shadow-md cursor-pointer transition-all ${
                      isHighlighted
                        ? "highlighted-marker border-4 border-purple-500"
                        : album.containsUserUploads
                        ? "border-4 border-red-500"
                        : "grayscale border-4 border-gray-400"
                    }`}
                    style={{
                      width: `${markerSize}px`,
                      height: `${markerSize}px`,
                      position: "relative",
                    }}
                  >
                    <img
                      src={album.photos[0].photoUrl}
                      alt={album.name}
                      className={`rounded-full w-full h-full ${
                        album.containsUserUploads || isHighlighted
                          ? ""
                          : "grayscale"
                      }`}
                    />
                  </div>
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
            <MapPin size={64} className="text-red-500" />
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

      {/* Reset to Actual Location */}
      <div className="absolute bottom-[100px] left-[20px] z-[1000]">
        <button
          onClick={fetchAndSetLocation}
          className="flex flex-col items-center justify-center w-[70px] h-[70px] bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          <MapPin size={24} className="text-white mb-1" />
          <span className="text-xs font-medium">Actual</span>
        </button>
      </div>

      {/* Fly to Stored Location */}
      <div className="absolute bottom-[100px] right-[20px] z-[1000]">
        <button
          onClick={moveToStoredLocation}
          className="flex items-center justify-center w-[70px] h-[70px] bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <LocateFixed size={32} className="text-white" />
        </button>
      </div>

      {/* Display Latitude and Longitude when Faking Location */}
      {isFakingLocation && (
        <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-md shadow-md z-[1000] flex space-x-2">
          <span className="text-sm font-medium">
            Lat: {viewport.latitude.toFixed(6)}
          </span>
          <span className="text-sm font-medium">
            Lng: {viewport.longitude.toFixed(6)}
          </span>
        </div>
      )}

      {/* Fake Location Buttons */}
      <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 z-[1000] space-x-2 flex">
        {!isFakingLocation ? (
          <button
            onClick={handleStartFakingLocation}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
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
