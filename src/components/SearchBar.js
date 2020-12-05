import { useState } from "react";

const SearchBar = ({ searchText }) => {
  const [searchText, setSearchText] = useState("");

  const handleChange = (e) => {
    // setSearchText(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for Buses and Bus Stops..."
        value={searchText}
        onChange={handleChange}
        style={{
          padding: ".7rem",
          width: "100%",
          fontSize: "1rem",
          border: "None",
          borderBottom: "1px solid grey",
        }}
      />
    </div>
  );
};

export default SearchBar;
