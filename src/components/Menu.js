import MenuItem from "./MenuItem";
// import SearchBar from "./SearchBar";

const Menu = ({
  busStops,
  busRoutes,
  setServiceNo,
  toggleRouteView,
  setRouteDirection,
  routeDirection,
}) => {
  //   const [togglebusRoute, setTogglebusRoute] = useState(false); //toggle to view bus routes

  return (
    <div
      style={{
        overflow: "scroll",
        height: "40vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!toggleRouteView && busStops.length > 0 ? (
        busStops.map((busStop) => {
          return (
            <MenuItem
              key={busStop.BusStopCode}
              properties={busStop}
              setServiceNo={setServiceNo}
            />
          );
        })
      ) : toggleRouteView && busRoutes.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{busRoutes[0].ServiceNo}</span>
          <button onClick={() => setRouteDirection("1")}>1</button>
          <button onClick={() => setRouteDirection("2")}>2</button>
          {busRoutes
            //   .filter((route) => route.Direction === routeDirection)
            .map((route, key) => {
              return <span key={key}>{route.Description}</span>;
            })}
        </div>
      ) : null}
    </div>
  );
};

export default Menu;
