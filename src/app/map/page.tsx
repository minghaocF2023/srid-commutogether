"use client";
import React, { useRef, useCallback } from "react";
import Map, { MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapPage = () => {
  const mapRef = useRef<MapRef | null>(null); // Create a ref for the Map instance

  // const onMapIdle = useCallback((map: any) => {
  //   console.log("Map idle");
  //   const routeFeatures = map.queryRenderedFeatures({
  //     layers: ["transitland-rail-routes-layer"], // ID of the routes layer
  //   });

  //   const nameFeatures = map.queryRenderedFeatures({
  //     layers: ["transitland-route-names-layer"], // ID of the route names layer
  //   });

  //   console.log("Name features:");
  //   console.log(nameFeatures);

  //   console.log("Route features:");
  //   console.log(routeFeatures);

  //   console.log(
  //     routeFeatures.map((feature) => feature.properties?.route_color)
  //   );
  //   console.log(
  //     routeFeatures.map((feature) => feature.properties?.route_long_name)
  //   );
  // }, []);

  // Callback to handle map load event
  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return; // Ensure mapRef is available
    const map = mapRef.current.getMap(); // Get the actual Mapbox GL map instance

    console.log("Map loaded");

    // Add Transitland routes source
    map.addSource("transitland-routes", {
      type: "vector",
      tiles: [
        `https://transit.land/api/v2/tiles/routes/tiles/{z}/{x}/{y}.pbf?apikey=${process.env.NEXT_PUBLIC_TRANSITLAND_API_KEY}`,
      ],
      maxzoom: 10,
    });

    // Add routes layer with dynamic route color
    map.addLayer({
      id: "transitland-rail-routes-layer",
      type: "line",
      source: "transitland-routes",
      "source-layer": "routes", // Ensure this matches the actual source-layer name in the Transitland vector tiles
      filter: ["in", "route_type", 0, 1, 2], // Filter for train, subway, and tram routes
      paint: {
        "line-color": [
          "case",
          ["has", "route_color"], // Check if the route has a route_color property
          [
            "match", // Dynamically adjust specific colors
            ["get", "route_color"],
            "#dcddde", // Example: replace light gray
            "#3399ff", // Replace light gray with vivid blue
            "#bfbfbf", // Example: another problematic color
            "#ff4500", // Replace with orange
            ["get", "route_color"], // Default to the original route_color
          ],
          "black", // Default to black if route_color is missing
        ],
        "line-opacity": 0.6,
        "line-width": 2,
      },
      minzoom: 8,
    });

    // Add route names as a symbol layer
    map.addLayer({
      id: "transitland-route-names-layer",
      type: "symbol",
      source: "transitland-routes",
      "source-layer": "routes", // Ensure this matches the actual source-layer name in the Transitland vector tiles
      filter: ["in", "route_type", 0, 1, 2], // Filter for train, subway, and tram routes
      layout: {
        "text-field": [
          "coalesce",
          ["get", "route_long_name"], // Use long name if available
          ["concat", ["get", "agency_name"], " ", ["get", "route_short_name"]], // Fallback to agency + short name
        ],
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"], // Font family
        "text-size": 12, // Font size
        "symbol-placement": "line", // Align text along the route line
        "text-anchor": "center", // Center-align the text
      },
      paint: {
        "text-color": "#000000", // Text color
        "text-halo-color": "#ffffff", // Halo color for better readability
        "text-halo-width": 1, // Halo width
      },
      minzoom: 12,
    });

    // const idleHandler = () => {
    //   onMapIdle(map);
    //   // Remove the idle event listener after execution
    //   map.off("idle", idleHandler);
    // };

    // map.on("idle", idleHandler); // Attach the idle event listener
  }, []);

  return (
    <div>
      <Map
        ref={mapRef} // Attach the ref to the Map component
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN} // Use your Mapbox access token
        initialViewState={{
          longitude: -122.4,
          latitude: 37.77,
          zoom: 12,
        }}
        minZoom={0}
        maxZoom={18}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onLoad={onMapLoad} // Handle map load event
      />
    </div>
  );
};

export default MapPage;
