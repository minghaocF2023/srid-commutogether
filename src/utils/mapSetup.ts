import { Map } from "mapbox-gl";

export const setupMap = (map: Map) => {
  console.log("Map loaded");

  map.addSource("transitland-routes", {
    type: "vector",
    tiles: [
      `https://transit.land/api/v2/tiles/routes/tiles/{z}/{x}/{y}.pbf?apikey=${process.env.NEXT_PUBLIC_TRANSITLAND_API_KEY}`,
    ],
    maxzoom: 10,
  });

  map.addLayer({
    id: "transitland-rail-routes-layer",
    type: "line",
    source: "transitland-routes",
    "source-layer": "routes",
    filter: ["in", "route_type", 0, 1, 2],
    paint: {
      "line-color": [
        "case",
        ["has", "route_color"],
        [
          "match",
          ["get", "route_color"],
          "#dcddde",
          "#3399ff",
          "#bfbfbf",
          "#ff4500",
          ["get", "route_color"],
        ],
        "black",
      ],
      "line-opacity": 0.6,
      "line-width": 2,
    },
    minzoom: 8,
  });

  map.addLayer({
    id: "transitland-route-names-layer",
    type: "symbol",
    source: "transitland-routes",
    "source-layer": "routes",
    filter: ["in", "route_type", 0, 1, 2],
    layout: {
      "text-field": [
        "coalesce",
        ["get", "route_long_name"],
        ["concat", ["get", "agency_name"], " ", ["get", "route_short_name"]],
      ],
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-size": 12,
      "symbol-placement": "line",
      "text-anchor": "center",
    },
    paint: {
      "text-color": "#000000",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1,
    },
    minzoom: 12,
  });
};
