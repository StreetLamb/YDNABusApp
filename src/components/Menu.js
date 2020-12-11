import MenuItem from "./MenuItem";
import SearchBar from "./SearchBar";
import { ReactComponent as SwapIcon } from "../icons/swap-vertical-outline.svg";

const Menu = ({
  busStops,
  busRoutes,
  setServiceNo,
  freezeView,
  setRouteDirection,
  searchHandler,
  setMarker,
}) => {
  //   const [togglebusRoute, setTogglebusRoute] = useState(false); //toggle to view bus routes

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
              <div style={{ display: "flex" }}>
                <SwapIcon
                  style={{ height: "2rem" }}
                  onClick={setRouteDirection}
                />
              </div>
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
