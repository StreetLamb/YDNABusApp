import React from "react";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import busRoutesData from "../data/busRoutesData.json";
import busStopsData from "../data/busStopsData.json";
import Menu from "./Menu";

const MainContainer = styled.div``;

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

let map = null;

const Map = () => {
  const mapContainer = useRef(null);
  const [freezeView, setFreezeView] = useState("map"); //map, route, search
  const [busStops, setBusStops] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);
  const [routeDirection, setRouteDirection] = useState("1");
  const [serviceNo, setServiceNo] = useState(null);

  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/streetlamb/ckii98mrj2hcc19s10sboh3rp",
    });

    map.on("load", () => {
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );

      map.setFilter("busStops-highlighted", ["in", "BusStopCode", ""]);

      function highlight() {
        const { width, height } = mapContainer.current.getBoundingClientRect();
        const { left } = mapContainer.current.getBoundingClientRect();
        let factor = -126 + map.getZoom().toFixed(2) * 13.3;
        if (factor < 0) {
          factor = 1;
        }

        const bbox = [
          [left + width / 2 - factor, height / 2 - factor], //left, up
          [left + width / 2 + factor, height / 2 + factor], //right, down
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
            memo.push(feature);
            return memo;
          }, []);
          setBusStops(newFeatures);
        }
      }

      map.on("move", "busStops", highlight);
      map.on("moveend", "busStops", updateBusStops);
      map.on("zoom", () => {
        if (map.getZoom() < 12) {
          map.setPaintProperty("busStops", "circle-color", "rgba(0,0,0,0)");
        } else {
          map.setPaintProperty("busStops", "circle-color", "rgba(0,0,0,0.1)");
        }
      });
    });
  }, []);

  useEffect(() => {
    try {
      console.log(freezeView);
      if (freezeView === "map") {
        map.setLayoutProperty("busStops-highlighted", "visibility", "visible");
        map.setLayoutProperty("busStops", "visibility", "visible");
        map.setLayoutProperty("busRoutes", "visibility", "none");
        map.setLayoutProperty("search", "visibility", "none");
        map.setFilter("busStopMarkers", ["in", "BusStopCode", ""]);
      } else if (freezeView === "route") {
        map.setLayoutProperty("busRoutes", "visibility", "visible");
        map.setLayoutProperty("busStops", "visibility", "none");
        map.setLayoutProperty("busStops-highlighted", "visibility", "none");
        map.setLayoutProperty("search", "visibility", "none");
        map.setFilter("busStopMarkers", ["in", "BusStopCode", ""]);
      } else if (freezeView === "search") {
        map.setLayoutProperty("search", "visibility", "visible");
        map.setLayoutProperty("busStops-highlighted", "visibility", "none");
        map.setLayoutProperty("busStops", "visibility", "none");
        map.setLayoutProperty("busRoutes", "visibility", "none");
        map.setFilter("busStopMarkers", ["in", "BusStopCode", ""]);
      }
    } catch {}
  }, [freezeView]);

  const searchHandler = (searchText) => {
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
            searchResult.push(feature);
            return memo;
          },
          ["in", "BusStopCode"]
        );
        map.setFilter("search", filter);
        setBusStops(searchResult);
        map.flyTo({
          center: [
            features[0].geometry.coordinates[0],
            features[0].geometry.coordinates[1],
          ],
          zoom: 12.5,
          // speed: 1,
          // curve: 1,
          // easing(t) {
          //   return t;
          // },
        });
      }
    }
  };

  const mapHandler = () => {
    setFreezeView("map");
  };

  const routeHandler = (serviceNo) => {
    // map.zoomTo(9.5);
    setServiceNo(serviceNo);
    let direction = routeDirection === "1" ? "2" : "1";
    setRouteDirection(direction);
    setFreezeView("route");

    let features = busRoutesData.features.filter(
      (feature) =>
        feature.properties.ServiceNo === serviceNo &&
        feature.properties.Direction === direction
    );

    if (features && features.length > 0) {
      let busRoutes = [];
      let filter = features.reduce(
        function (memo, feature) {
          memo.push(feature.properties.BusStopCode);
          busRoutes.push(feature);
          return memo;
        },
        ["in", "BusStopCode"]
      );

      map.setFilter("busRoutes", filter);
      busRoutes = busRoutes.sort((a, b) => {
        return a.properties.StopSequence - b.properties.StopSequence;
      });
      setBusRoutes(busRoutes.sort());
    }
  };

  const markerHandler = (busStopCode, longitude, latitude) => {
    map.setFilter("busStopMarkers", ["in", "BusStopCode", busStopCode]);
    if (freezeView !== "map") {
      map.flyTo({
        center: [longitude, latitude],
        zoom: 16,
      });
    }
  };

  return (
    <MainContainer
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "grey",
      }}
    >
      {/* <SideBar>
          Longitude: {mapOptions.lng} | Latitude: {mapOptions.lat} | Zoom:{" "}
          {mapOptions.zoom}
          <NavigateIcon style={{ height: "2rem" }} />
        </SideBar> */}
      <div
        ref={(el) => (mapContainer.current = el)}
        style={{
          height: "60vh",
          position: "relative",
        }}
      >
        {freezeView !== "map" ? (
          <button
            onClick={mapHandler}
            style={{
              position: "absolute",
              width: "7rem",
              bottom: "1rem",
              color: "white",
              background: "#404040",
              border: "none",
              borderRadius: ".5rem",
              padding: ".2rem",
              left: "calc(50vw - 3.5rem)",
              zIndex: "1 !important",
            }}
          >
            Unfreeze map
          </button>
        ) : null}
      </div>

      <Menu
        setServiceNo={(s) => routeHandler(s)}
        setRouteDirection={(r) => routeHandler(serviceNo)}
        busRoutes={busRoutes}
        freezeView={freezeView}
        busStops={busStops}
        routeDirection={routeDirection}
        searchHandler={searchHandler}
        setMarker={markerHandler}
      />
    </MainContainer>
  );
};

export default Map;
