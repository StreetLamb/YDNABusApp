import MenuItem from "./MenuItem";
import SearchBar from "./SearchBar";

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
        background: "white",
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
            <span>{busRoutes[0].properties.ServiceNo}</span>
            <div style={{ display: "flex" }}>
              <button onClick={() => setRouteDirection("1")}>1</button>
              <button onClick={() => setRouteDirection("2")}>2</button>
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
