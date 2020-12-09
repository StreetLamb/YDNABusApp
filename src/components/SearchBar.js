import { useState } from "react";

const SearchBar = ({ searchText, searchHandler }) => {
  return (
    <div>
      <input
        type="search"
        placeholder="Search for Buses and Bus Stops..."
        value={searchText}
        onChange={searchHandler}
        style={{
          padding: ".7rem",
          width: "100%",
          fontSize: "1rem",
          border: "none",
          borderBottom: "1px solid grey",
        }}
      />
    </div>
  );
};

export default SearchBar;
