import React from "react";
import { Marker } from "react-map-gl";

interface FakeLocationMarkerProps {
  fakeLocation: { latitude: number; longitude: number } | null;
  zoom: number;
}

const FakeLocationMarker: React.FC<FakeLocationMarkerProps> = ({
  fakeLocation,
  zoom,
}) => {
  if (!fakeLocation) return null;

  // Calculate size based on zoom level
  const markerSize =
    zoom < 8
      ? 20
      : zoom >= 14
      ? 40
      : 20 + Math.pow((zoom - 8) / (14 - 8), 2) * (40 - 20);

  return (
    <Marker
      longitude={fakeLocation.longitude}
      latitude={fakeLocation.latitude}
      anchor="center"
    >
      <div
        className="bg-blue-500 text-white rounded-full flex items-center justify-center z-[1000]"
        style={{
          width: `${markerSize}px`,
          height: `${markerSize}px`,
          border: "3px solid white",
          boxShadow: "0 0 5px rgba(0,0,0,0.5)",
        }}
      ></div>
    </Marker>
  );
};

export default FakeLocationMarker;
