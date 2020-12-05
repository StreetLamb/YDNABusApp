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

const MenuItem = ({ properties }) => {
  const [busArrivals, setBusArrivals] = useState(null);
  const [openArrival, setOpenArrival] = useState(false);

  const getArrivals = async (e, refresh = false) => {
    e.stopPropagation(); //prevents event from bubbling
    e.preventDefault(); //prevents event from bubbling
    if ((refresh === false && !openArrival) || refresh === true) {
      setBusArrivals(await getBusArrival(properties.BusStopCode));
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
            <span>{properties.Description}</span>
          </TitleContainer>
          <SubtitleContainer>
            <Span style={{ paddingRight: ".5rem" }}>
              {properties.BusStopCode}
            </Span>
            <span>{properties.RoadName}</span>
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
              {busArrivals.map((bus) => {
                return (
                  <tr>
                    <td style={{ padding: "0.5rem 40vw 0.5rem 0" }}>
                      {bus.ServiceNo}
                    </td>
                    <td style={{ padding: "0 1rem" }}>
                      {timeDiff(bus.NextBus.EstimatedArrival)}
                    </td>
                    <td style={{ padding: "0 1rem" }}>
                      {timeDiff(bus.NextBus2.EstimatedArrival)}
                    </td>
                    <td style={{ padding: "0 1rem" }}>
                      {timeDiff(bus.NextBus3.EstimatedArrival)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ArrivalContainer>
      ) : null}
      {/* {openArrival && busArrivals
        ? busArrivals.map((bus) => {
            return (
              <ArrivalContainer key={bus.ServiceNo}>
                <table>
                  <tbody>
                    <tr>
                      <td>{bus.ServiceNo}</td>
                      <td>{timeDiff(bus.NextBus.EstimatedArrival)}</td>
                      <td>{timeDiff(bus.NextBus2.EstimatedArrival)}</td>
                      <td>{timeDiff(bus.NextBus3.EstimatedArrival)}</td>
                    </tr>
                  </tbody>
                </table>
              </ArrivalContainer>
            );
          })
        : null} */}
    </MainContainer>
  );
};

export default MenuItem;