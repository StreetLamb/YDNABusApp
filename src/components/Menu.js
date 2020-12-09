import MenuItem from "./MenuItem";
import SearchBar from "./SearchBar";
import { useState } from "react";

const Menu = ({
  busStops,
  busRoutes,
  searchText,
  setServiceNo,
  freezeView,
  setRouteDirection,
  searchHandler,
}) => {
  //   const [togglebusRoute, setTogglebusRoute] = useState(false); //toggle to view bus routes

  return (
    <div>
      <div
        style={{
          overflow: "scroll",
          height: "40vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SearchBar searchText={searchText} searchHandler={searchHandler} />
        {(freezeView === "map" || freezeView === "search") &&
        busStops.length > 0 ? (
          busStops.map((busStop) => {
            return (
              <MenuItem
                key={busStop.BusStopCode}
                properties={busStop}
                setServiceNo={setServiceNo}
              />
            );
          })
        ) : freezeView === "route" && busRoutes.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{busRoutes[0].ServiceNo}</span>
            <button onClick={() => setRouteDirection("1")}>1</button>
            <button onClick={() => setRouteDirection("2")}>2</button>
            {busRoutes.map((route, key) => {
              return <span key={key}>{route.Description}</span>;
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Menu;
