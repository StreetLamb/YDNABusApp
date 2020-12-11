import { useState } from "react";

const SearchBar = ({ searchHandler }) => {
  const [searchText, setSearchText] = useState("");

  const onSumbitHandler = (e) => {
    e.preventDefault();
    searchHandler(searchText);
  };
  return (
    <div>
      <form action="." onSubmit={onSumbitHandler}>
        <input
          type="search"
          placeholder="Search for Bus Stops names and codes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: ".7rem",
            width: "100%",
            fontSize: "1rem",
            border: "none",
            borderBottom: "1px solid grey",
            borderRadius: "0",
            WebkitAppearance: "none",
          }}
        />
      </form>
    </div>
  );
};

export default SearchBar;
