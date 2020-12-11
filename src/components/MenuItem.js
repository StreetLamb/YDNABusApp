import { useState } from "react";
import styled from "styled-components";
import getBusArrival from "../api/api";
import { ReactComponent as WheelChair } from "../icons/icon-wheelchair.svg";
import { ReactComponent as DoubleDeckerBus } from "../icons/Icon_Icon_DoubleDeckerbus.svg";
import { ReactComponent as NormalBus } from "../icons/icon-bus-normal.svg";
import { ReactComponent as RefreshIcon } from "../icons/refresh-outline.svg";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-bottom: 1px solid #d5d8dc;
  background: white;
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
            <span style={{ color: "#203462", fontWeight: "700" }}>
              {feature.properties.Description}
            </span>
          </TitleContainer>
          <SubtitleContainer>
            <Span style={{ paddingRight: ".5rem", color: "grey" }}>
              {feature.properties.BusStopCode}
            </Span>
            <span style={{ color: "grey" }}>{feature.properties.RoadName}</span>
          </SubtitleContainer>
        </TextContainer>
        <SideContainer>
          {openArrival ? (
            <RefreshIcon
              style={{ height: "1.5rem", color: "grey" }}
              onClick={(e) => getArrivals(e, true)}
            />
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
                      style={{
                        padding: "1rem 20vw 1rem 0",
                        color: "#285ec7",
                        fontWeight: "bold",
                      }}
                    >
                      {bus.ServiceNo}
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        paddingRight: "1rem",
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
                      {bus.NextBus.Feature === "WAB" ? (
                        <WheelChair style={{ height: "1rem" }} />
                      ) : null}
                      {bus.NextBus.Type === "DD" ? (
                        <DoubleDeckerBus style={{ height: "1.5rem" }} />
                      ) : (
                        <NormalBus
                          style={{ height: "1rem", paddingTop: ".5rem" }}
                        />
                      )}
                      &nbsp;
                      <span>{timeDiff(bus.NextBus.EstimatedArrival)}</span>
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        paddingRight: "1rem",
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
                      {bus.NextBus2.Feature === "WAB" ? (
                        <WheelChair style={{ height: "1rem" }} />
                      ) : null}
                      {bus.NextBus2.Type === "DD" ? (
                        <DoubleDeckerBus style={{ height: "1.5rem" }} />
                      ) : (
                        <NormalBus
                          style={{ height: "1rem", paddingTop: ".5rem" }}
                        />
                      )}
                      &nbsp;
                      {timeDiff(bus.NextBus2.EstimatedArrival)}
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        paddingRight: "1rem",
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
                      {bus.NextBus3.Feature === "WAB" ? (
                        <WheelChair style={{ height: "1rem" }} />
                      ) : null}
                      {bus.NextBus3.Type === "DD" ? (
                        <DoubleDeckerBus style={{ height: "1.5rem" }} />
                      ) : (
                        <NormalBus
                          style={{ height: "1rem", paddingTop: ".5rem" }}
                        />
                      )}
                      &nbsp;
                      <span>{timeDiff(bus.NextBus3.EstimatedArrival)}</span>
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
