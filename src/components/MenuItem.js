import { useState } from "react";
import styled from "styled-components";
import getBusArrival from "../api/api";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-bottom: 1px solid black;
`;

const TopContainer = styled.div`
  display: flex;
  padding: 0.2rem;
  justify-items: space-between;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 9;
`;

const TitleContainer = styled.div`
  display: flex;
`;

const SubtitleContainer = styled.div`
  display: flex;
  padding-top: 0.5rem;
`;

const ArrivalContainer = styled.div`
  display: flex;
`;

const Span = styled.span`
  padding-right: 0.5rem;
`;

const SideContainer = styled.div`
flex:1'
`;

const RefreshButton = styled.button`
  border: None;
  height: 2rem;
`;

const StyledTD = styled.td`
  padding: 0 1rem;
  color: green;
`;

const MenuItem = ({ feature, setServiceNo, setMarker }) => {
  const [busArrivals, setBusArrivals] = useState(null);
  const [openArrival, setOpenArrival] = useState(false);

  const getArrivals = async (e, refresh = false) => {
    e.stopPropagation(); //prevents event from bubbling
    e.preventDefault(); //prevents event from bubbling
    if ((refresh === false && !openArrival) || refresh === true) {
      setBusArrivals(await getBusArrival(feature.properties.BusStopCode));
      setMarker(
        feature.properties.BusStopCode,
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1]
      ); //place marker on map to show the bus stop
    }
    if (refresh === false) setOpenArrival(!openArrival);
  };

  const timeDiff = (end) => {
    let diff = ((new Date(end) - new Date()) / (60 * 1000)).toFixed(0);
    if (diff < 1) {
      diff = "Arr";
    } else if (diff === "NaN") {
      return "-";
    }
    return diff;
  };

  return (
    <MainContainer>
      <TopContainer onClick={getArrivals}>
        <TextContainer>
          <TitleContainer>
            <span>{feature.properties.Description}</span>
          </TitleContainer>
          <SubtitleContainer>
            <Span style={{ paddingRight: ".5rem" }}>
              {feature.properties.BusStopCode}
            </Span>
            <span>{feature.properties.RoadName}</span>
          </SubtitleContainer>
        </TextContainer>
        <SideContainer>
          {openArrival ? (
            <RefreshButton onClick={(e) => getArrivals(e, true)}>
              Refresh
            </RefreshButton>
          ) : null}
        </SideContainer>
      </TopContainer>
      {openArrival && busArrivals ? (
        <ArrivalContainer>
          <table>
            <tbody>
              {busArrivals.map((bus, key) => {
                return (
                  <tr key={`${bus.ServiceNo}-${key}`}>
                    <td
                      onClick={() => setServiceNo(bus.ServiceNo)}
                      style={{ padding: "0.5rem 40vw 0.5rem 0" }}
                    >
                      {bus.ServiceNo}
                    </td>
                    <td
                      style={{
                        padding: "0 1rem",
                        fontWeight: "bold",
                        color:
                          bus.NextBus.Load === "SEA"
                            ? "green"
                            : bus.NextBus.Load === "SDA"
                            ? "darkorange"
                            : bus.NextBus.Load === "LSD"
                            ? "red"
                            : "black",
                      }}
                    >
                      {bus.NextBus.Feature === "WAB" ? <span>♿</span> : null}
                      {timeDiff(bus.NextBus.EstimatedArrival)}
                    </td>
                    <td
                      style={{
                        margin: "0 1rem 1rem 0",
                        fontWeight: "bold",
                        color:
                          bus.NextBus2.Load === "SEA"
                            ? "green"
                            : bus.NextBus2.Load === "SDA"
                            ? "darkorange"
                            : bus.NextBus2.Load === "LSD"
                            ? "red"
                            : "black",
                      }}
                    >
                      {bus.NextBus2.Feature === "WAB" ? <span>♿</span> : null}
                      {timeDiff(bus.NextBus2.EstimatedArrival)}
                    </td>
                    <td
                      style={{
                        padding: "0 1rem",
                        fontWeight: "bold",
                        color:
                          bus.NextBus3.Load === "SEA"
                            ? "green"
                            : bus.NextBus3.Load === "SDA"
                            ? "darkorange"
                            : bus.NextBus3.Load === "LSD"
                            ? "red"
                            : "black",
                      }}
                    >
                      {bus.NextBus3.Feature === "WAB" ? <span>♿</span> : null}
                      {timeDiff(bus.NextBus3.EstimatedArrival)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ArrivalContainer>
      ) : null}
    </MainContainer>
  );
};

export default MenuItem;
