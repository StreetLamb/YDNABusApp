import MenuItem from "./MenuItem";
import SearchBar from "react";

const Menu = ({ busStops }) => {
  return (
    <div>
      {/* <SearchBar /> */}
      <div
        style={{
          overflow: "scroll",
          height: "40vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {busStops.length > 0 ? (
          busStops.map((busStop) => {
            return <MenuItem key={busStop.BusStopCode} properties={busStop} />;
          })
        ) : (
          <div>Empty</div>
        )}
      </div>
    </div>
  );
};

export default Menu;
