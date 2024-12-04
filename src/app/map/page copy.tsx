"use client";
import React, { useRef, useCallback, useState } from "react";
import Map, { MapRef, Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import photoData from "@/data/photos.json";
import { setupMap } from "@/utils/mapSetup";
import { useRouter } from "next/navigation";

const MapPage = () => {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const router = useRouter();

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    setupMap(map);
  }, []);

  const handleMarkerClick = (album: any) => {
    setSelectedAlbum(album);
    router.push(`/album/${album.name}`);
  };

  return (
    <div>
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: -122.07,
          latitude: 37.39,
          zoom: 12,
        }}
        minZoom={0}
        maxZoom={18}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onLoad={onMapLoad}
      >
        {photoData.albums.map((album: any) => (
          <Marker
            key={album.name}
            longitude={album.photos[0].longitude}
            latitude={album.photos[0].latitude}
            anchor="center"
            onClick={() => handleMarkerClick(album)}
          >
            <img
              src={album.photos[0].photoUrl}
              alt={album.name}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: "3px solid #ff0000", // Optional: Adds a red border for a checkpoint-like effect
                cursor: "pointer",
                objectFit: "cover",
                boxShadow: "0 0 5px rgba(0,0,0,0.5)",
              }}
            />
          </Marker>
        ))}
        {selectedAlbum && (
          <Popup
            longitude={selectedAlbum.photos[0].longitude}
            latitude={selectedAlbum.photos[0].latitude}
            onClose={() => setSelectedAlbum(null)}
          >
            <div>{selectedAlbum.name}</div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapPage;
