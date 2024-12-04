"use client";
import React from "react";
import { Popup } from "react-map-gl";

type MarkerPopupProps = {
  photo: any;
  onClose: () => void;
};

const MarkerPopup: React.FC<MarkerPopupProps> = ({ photo, onClose }) => (
  <Popup
    longitude={photo.longitude}
    latitude={photo.latitude}
    anchor="top"
    onClose={onClose}
  >
    <div>
      <img
        src={photo.photoUrl}
        alt={photo.location}
        style={{ width: "200px", borderRadius: "8px" }}
      />
      <p>{photo.location}</p>
      <button
        onClick={() => {
          window.location.href = `/albums/${photo.albumId}`;
        }}
        style={{
          marginTop: "10px",
          padding: "8px 12px",
          background: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        View Album
      </button>
    </div>
  </Popup>
);

export default MarkerPopup;
