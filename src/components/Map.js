import React from "react";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import busRoutesData from "../data/busRoutesData.json";
import busStopsData from "../data/busStopsData.json";
import Menu from "./Menu";

const MainContainer = styled.div``;

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
  const [freezeView, setFreezeView] = useState("map"); //map, route, search
  const [busStops, setBusStops] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);
  const [routeDirection, setRouteDirection] = useState("1");
  const [serviceNo, setServiceNo] = useState(null);
  const [searchText, setSearchText] = useState("");

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
        layout: {
          visibility: "visible",
        },
      });

      map.addLayer({
        id: "busRoutes",
        type: "circle",
        source: {
          type: "vector",
          url: "mapbox://streetlamb.a509iu0r",
        },
        "source-layer": "busStops-4833k4",
        paint: {
          "circle-color": "rgba(0,0,0,1)",
        },
        filter: ["in", "BusStopCode", ""],
        layout: {
          visibility: "none",
        },
      });

      map.addLayer({
        id: "search",
        type: "circle",
        source: {
          type: "vector",
          url: "mapbox://streetlamb.a509iu0r",
        },
        "source-layer": "busStops-4833k4",
        paint: {
          "circle-color": "rgba(0,0,0,1)",
        },
        filter: ["in", "BusStopCode", ""],
        layout: {
          visibility: "none",
        },
      });

      const { width, height } = mapContainer.current.getBoundingClientRect();
      const { left } = mapContainer.current.getBoundingClientRect();

      function highlight() {
        setMapOptions({
          lng: map.getCenter().lng.toFixed(4),
          lat: map.getCenter().lat.toFixed(4),
          zoom: map.getZoom().toFixed(2),
        });

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

      map.on("move", "busStops", highlight);
      map.on("moveend", "busStops", updateBusStops);
      // map.on("zoom", () => {
      //   if (map.getZoom() < 12) {
      //     map.setPaintProperty("busStops", "circle-color", "rgba(0,0,0,0)");
      //   } else {
      //     map.setPaintProperty("busStops", "circle-color", "rgba(0,0,0,0.1)");
      //   }
      // });
    });
  }, []);

  useEffect(() => {
    try {
      console.log(freezeView);
      if (freezeView === "map") {
        map.setLayoutProperty("busStops-highlighted", "visibility", "visible");
        map.setLayoutProperty("busRoutes", "visibility", "none");
        map.setLayoutProperty("search", "visibility", "none");
      } else if (freezeView === "route") {
        map.setLayoutProperty("busRoutes", "visibility", "visible");
        map.setLayoutProperty("busStops-highlighted", "visibility", "none");
        map.setLayoutProperty("search", "visibility", "none");
      } else if (freezeView === "search") {
        map.setLayoutProperty("search", "visibility", "visible");
        map.setLayoutProperty("busStops-highlighted", "visibility", "none");
        map.setLayoutProperty("busRoutes", "visibility", "none");
      }
    } catch {}
  }, [freezeView]);

  useEffect(() => {
    if (serviceNo) {
      // map.zoomTo(9.5);
      setFreezeView("route");
      let features = allbusRoutes.features.filter(
        (feature) =>
          feature.properties.ServiceNo === serviceNo &&
          feature.properties.Direction === routeDirection
      );

      if (features && features.length > 0) {
        const busRoutes = [];
        let filter = features.reduce(
          function (memo, feature) {
            memo.push(feature.properties.BusStopCode);
            busRoutes.push(feature.properties);
            return memo;
          },
          ["in", "BusStopCode"]
        );

        map.setFilter("busRoutes", filter);
        setBusRoutes(busRoutes);
      }
    } else {
      setFreezeView("map");
    }
    console.log(busRoutes);
  }, [serviceNo, routeDirection]);

  useEffect(() => {
    //TODO buscode in strings and numbers, cannot track. filter not working for description ans service no. Maybe need to add busstop file.
    if (searchText.length > 0) {
      setFreezeView("search");
      let features = busStopsData.features.filter(
        (feature) =>
          // feature.properties.ServiceNo.toLowerCase().startsWith(
          //   searchText.toLowerCase()
          // ) ||
          feature.properties.Description.toLowerCase().startsWith(
            searchText.toLowerCase()
          ) ||
          feature.properties.BusStopCode.toLowerCase().startsWith(
            searchText.toLowerCase()
          )
      );

      if (features && features.length > 0) {
        const searchResult = [];
        let filter = features.reduce(
          function (memo, feature) {
            memo.push(feature.properties.BusStopCode);
            searchResult.push(feature.properties);
            return memo;
          },
          ["in", "BusStopCode"]
        );
        console.log(filter);
        map.setFilter("search", filter);
        setBusStops(searchResult);
      }
    }
  }, [searchText]);

  const clickHandler = () => {
    setFreezeView("map");
  };

  return (
    <MainContainer
      style={{ display: "flex", flexDirection: "column", height: "120vh" }}
    >
      <SideBar>
        Longitude: {mapOptions.lng} | Latitude: {mapOptions.lat} | Zoom:{" "}
        {mapOptions.zoom}
        <button onClick={clickHandler}>Remove toggle</button>
      </SideBar>
      <div
        ref={(el) => (mapContainer.current = el)}
        style={{ height: "60vh" }}
      />
      <div>
        <Menu
          setServiceNo={setServiceNo}
          setRouteDirection={setRouteDirection}
          busRoutes={busRoutes}
          freezeView={freezeView}
          busStops={busStops}
          routeDirection={routeDirection}
          searchText={searchText}
          searchHandler={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* {React.cloneElement(children, { busRoutes, freezeView, busStops,  })} */}
    </MainContainer>
  );
};

export default Map;
