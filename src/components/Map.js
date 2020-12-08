import React from "react";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import busRoutesData from "../data/busRoutesData.json";
import Menu from "./Menu";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MapContainer = styled.div`
  display: flex !important;
  height: 60vh !important;
`;

const StyledMenu = styled(Menu)``;

const SideBar = styled.div`
  display: inline-block;
  top: 0;
  left: 0;
  margin: 12px;
  background-color: #404040;
  color: #ffffff;
  z-index: 1 !important;
  padding: 6px;
  font-weight: bold;
`;

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

let map = null;

const Map = () => {
  const mapContainer = useRef(null);
  const [mapOptions, setMapOptions] = useState({
    lng: 103.8,
    lat: 1.34,
    zoom: 11.4,
  });
  const [allbusRoutes] = useState(busRoutesData);
  const [toggleRouteView, setToggleRouteView] = useState(false);
  const [busStops, setBusStops] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);
  const [routeDirection, setRouteDirection] = useState("1");
  const [serviceNo, setServiceNo] = useState(null);

  useEffect(() => {
    map = new mapboxgl.Map({
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
        layout: {
          visibility: "visible",
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
        id: "busRoutes",
        type: "circle",
        source: {
          type: "vector",
          url: "mapbox://streetlamb.cawwc0w9",
        },
        "source-layer": "busRoutes_busStops-34tvgd",
        paint: {
          "circle-color": "rgba(0,0,0,0)",
        },
      });

      map.on("zoom", () => {
        if (map.getZoom() < 11) {
          map.setPaintProperty("busStops", "circle-color", "rgba(0,0,0,0)");
        } else {
          map.setPaintProperty("busStops", "circle-color", "rgba(0,0,0,0.1)");
        }
      });
    });
  }, []);

  useEffect(() => {
    function highlight() {
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
    }
    function updateBusStops() {
      const features = map.queryRenderedFeatures({
        layers: ["busStops-highlighted"],
      });
      if (features && features.length > 0) {
        let newFeatures = features.reduce((memo, feature) => {
          memo.push(feature.properties);
          return memo;
        }, []);
        setBusStops(newFeatures);
      }
    }

    if (!toggleRouteView) {
      map.on("move", highlight);
      map.on("moveend", updateBusStops);
    }

    return () => {
      map.off("move", highlight);
      map.off("moveend", updateBusStops);
    };
  }, [toggleRouteView]);

  useEffect(() => {
    if (serviceNo) {
      // map.zoomTo(9.5);
      setToggleRouteView(true);
      let features = allbusRoutes.features.filter(
        (feature) =>
          feature.properties.ServiceNo === serviceNo &&
          feature.properties.Direction === routeDirection
      );

      if (features && features.length > 0) {
        const busRoutes = [];
        let filter = features.reduce(
          function (memo, feature) {
            if (feature.properties.BusStopCode[0] === "0") {
              memo.push(feature.properties.BusStopCode);
            } else {
              memo.push(parseInt(feature.properties.BusStopCode));
            }
            busRoutes.push(feature.properties);
            return memo;
          },
          ["in", "BusStopCode"]
        );

        map.setFilter("busStops-highlighted", filter);
        setBusRoutes(busRoutes);
      }
    } else {
      setToggleRouteView(false);
    }
  }, [serviceNo, routeDirection]);

  const clickHandler = () => {
    setToggleRouteView(false);
  };

  return (
    <MainContainer>
      <MapContainer ref={(el) => (mapContainer.current = el)}>
        <SideBar>
          Longitude: {mapOptions.lng} | Latitude: {mapOptions.lat} | Zoom:{" "}
          {mapOptions.zoom}
          <button onClick={clickHandler}>Remove toggle</button>
        </SideBar>
      </MapContainer>
      <div>
        <StyledMenu
          setServiceNo={(serviceNo) => setServiceNo(serviceNo)}
          setRouteDirection={(direction) => setRouteDirection(direction)}
          busRoutes={busRoutes}
          toggleRouteView={toggleRouteView}
          busStops={busStops}
          routeDirection={routeDirection}
        />
      </div>

      {/* {React.cloneElement(children, { busRoutes, toggleRouteView, busStops,  })} */}
    </MainContainer>
  );
};

export default Map;
