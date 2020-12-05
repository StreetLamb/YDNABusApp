import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const MapContainer = styled.div`
  height: 60vh;
`;

const SideBar = styled.div`
  display: inline-block;
  position: relative;
  top: 0;
  left: 0;
  margin: 12px;
  background-color: #404040;
  color: #ffffff;
  z-index: 1 !important;
  padding: 6px;
  font-weight: bold;
`;

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3RyZWV0bGFtYiIsImEiOiJja2lhY2k4emUwbzl6MnJueHg3YW92dXhmIn0.5Wo81l5OS_yeT3391QfdgA";

const Map = ({ changeCurrentBusStops }) => {
  const mapContainer = useRef(null);
  const [mapOptions, setMapOptions] = useState({
    lng: 103.8,
    lat: 1.34,
    zoom: 11.4,
  });

  useEffect(() => {
    console.log("run");
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [mapOptions.lng, mapOptions.lat],
      zoom: mapOptions.zoom,
    });

    map.on("load", () => {
      map.addLayer({
        id: "busStops",
        type: "circle",
        source: {
          type: "vector",
          url: "mapbox://streetlamb.a509iu0r",
        },
        "source-layer": "busStops-4833k4",
        paint: {
          "circle-color": "rgba(0,0,0,0.1)",
        },
      });

      map.addLayer({
        id: "busStops-highlighted",
        type: "circle",
        source: {
          type: "vector",
          url: "mapbox://streetlamb.a509iu0r",
        },
        "source-layer": "busStops-4833k4",
        filter: ["in", "BusStopCode", ""],
      });

      map.addLayer({
        id: "busStops-highlighted",
        type: "circle",
        source: {
          type: "vector",
          url: "mapbox://streetlamb.70lzh80w",
        },
        "source-layer": "busRoutes_busStops1-2agmlg",
      });

      map.on("move", () => {
        setMapOptions({
          lng: map.getCenter().lng.toFixed(4),
          lat: map.getCenter().lat.toFixed(4),
          zoom: map.getZoom().toFixed(2),
        });

        const { width, height } = mapContainer.current.getBoundingClientRect();
        const { left } = mapContainer.current.getBoundingClientRect();

        const bbox = [
          [left + width / 2 - 20, height / 2 - 20],
          [left + width / 2 + 20, height / 2 + 20],
        ];

        const features = map.queryRenderedFeatures(bbox, {
          layers: ["busStops"],
        });

        if (features && features.length > 0) {
          let filter = features.reduce(
            function (memo, feature) {
              memo.push(feature.properties.BusStopCode);
              return memo;
            },
            ["in", "BusStopCode"]
          );
          map.setFilter("busStops-highlighted", filter);
        }
      });

      map.on("moveend", () => {
        const features = map.queryRenderedFeatures({
          layers: ["busStops-highlighted"],
        });
        if (features) {
          let newFeatures = features.reduce((memo, feature) => {
            memo.push(feature.properties);
            return memo;
          }, []);
          changeCurrentBusStops(newFeatures);
        }
      });
    });
  }, []);

  return (
    <MapContainer ref={(el) => (mapContainer.current = el)}>
      <SideBar>
        Longitude: {mapOptions.lng} | Latitude: {mapOptions.lat} | Zoom:{" "}
        {mapOptions.zoom}
      </SideBar>
    </MapContainer>
  );
};

export default Map;
