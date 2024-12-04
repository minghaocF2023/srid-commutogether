"use client";
import React, { useRef, useCallback, useState } from "react";
import Map, { MapRef, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import photoData from "@/data/photos.json";
import { setupMap } from "@/utils/mapSetup";
import StyledButton from "@/components/StyledButton";
import { useRouter } from "next/navigation";

const MapPage = () => {
  const mapRef = useRef<MapRef | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 37.39,
    longitude: -122.07,
    zoom: 12, // Initial zoom level
  });
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
    </div>
  );
};

export default MapPage;
