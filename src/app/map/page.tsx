"use client";
import React, { useRef, useCallback, useState } from "react";
import Map, { MapRef, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import photoData from "@/data/photos.json";
import { setupMap } from "@/utils/mapSetup";

const MapPage = () => {
  const mapRef = useRef<MapRef | null>(null);

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    setupMap(map);
  }, []);

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
          >
            <div style={{ position: "relative", textAlign: "center" }}>
              {/* Marker Image */}
              <img
                src={album.photos[0].photoUrl}
                alt={album.name}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "3px solid #ff0000",
                  cursor: "pointer",
                  objectFit: "cover",
                  boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                }}
              />
              {/* Name on Hover */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px", // Position below the marker
                  left: "50%",
                  transform: "translateX(-50%)", // Center text
                  background: "rgba(0, 0, 0, 0.8)",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  opacity: 0, // Initially hidden
                  transition: "opacity 0.3s", // Smooth hover effect
                }}
                className="album-name"
              >
                {album.name}
              </div>
            </div>
          </Marker>
        ))}
      </Map>
      <style jsx>{`
        .album-name:hover {
          opacity: 1 !important;
        }
        div img:hover + .album-name {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default MapPage;
