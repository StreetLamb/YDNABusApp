import MenuItem from "./MenuItem";
import SearchBar from "./SearchBar";
import { ReactComponent as SwapIcon } from "../icons/swap-vertical-outline.svg";
import styled from "styled-components";

const SwapIconContainer = styled.div`
  background: #eff1f5;
  display: flex;
  &:active {
    background: #d2d4d8;
  }
`;

const Menu = ({
  busStops,
  busRoutes,
  setServiceNo,
  freezeView,
  setRouteDirection,
  searchHandler,
  setMarker,
}) => {
  return (
    <div
      style={{
        height: "40vh",
        overflow: "scroll",
        background: "#EFF1F5",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SearchBar searchHandler={searchHandler} />
        {(freezeView === "map" || freezeView === "search") &&
        busStops.length > 0 ? (
          busStops.map((busStop, key) => {
            return (
              <MenuItem
                key={`${busStop.properties.BusStopCode}-${key}`}
                feature={busStop}
                setServiceNo={setServiceNo}
                setMarker={setMarker}
              />
            );
          })
        ) : freezeView === "route" && busRoutes.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  fontWeight: "700",
                  fontSize: "1.5rem",
                  padding: ".2rem",
                }}
              >
                {busRoutes[0].properties.ServiceNo}
              </span>
              <SwapIconContainer onClick={setRouteDirection}>
                <SwapIcon style={{ height: "2rem" }} />
              </SwapIconContainer>
            </div>

            {busRoutes.map((route, key) => {
              const { Description, BusStopCode, RoadName } = route.properties;
              return (
                <MenuItem
                  key={`${BusStopCode}-${key}`}
                  feature={{
                    properties: { Description, BusStopCode, RoadName },
                    geometry: {
                      coordinates: [
                        route.geometry.coordinates[0],
                        route.geometry.coordinates[1],
                      ],
                    },
                  }}
                  setServiceNo={setServiceNo}
                  setMarker={setMarker}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Menu;
