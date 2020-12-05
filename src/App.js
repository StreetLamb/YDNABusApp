// import "./App.css";
import { useState } from "react";
import Map from "./components/Map";
import styled from "styled-components";
import Menu from "./components/Menu";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

// const NavBar = styled.ul`
//   display: flex;
//   width: 100%;
//   justify-contents: space-evenly;
// `;

function App() {
  const [currentBusStops, setCurrentBusStops] = useState([]);

  return (
    <AppContainer className="App">
      {/* <NavBar>
        <li>
          <span>Home</span>
        </li>
        <li>
          <span>Login</span>
        </li>
        <li>
          <span>About</span>
        </li>
      </NavBar> */}
      <Map changeCurrentBusStops={(e) => setCurrentBusStops(e)} />
      <Menu busStops={currentBusStops} />
    </AppContainer>
  );
}

export default App;

//http://192.168.1.217:3000
