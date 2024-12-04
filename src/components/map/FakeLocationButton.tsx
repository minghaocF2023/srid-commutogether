import React from "react";

interface FakeLocationButtonProps {
  onSetFakeLocation: () => void;
}

const FakeLocationButton: React.FC<FakeLocationButtonProps> = ({
  onSetFakeLocation,
}) => {
  return (
    <div className="absolute bottom-[160px] left-1/2 transform -translate-x-1/2 z-[1000] shadow-lg rounded-lg">
      <button
        onClick={onSetFakeLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Fake Location
      </button>
    </div>
  );
};

export default FakeLocationButton;
