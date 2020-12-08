const LTA_TOKEN = process.env.REACT_APP_LTA_TOKEN;
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const getBusArrival = async (busStopCode) => {
  let requestOptions = {
    method: "GET",
    headers: {
      AccountKey: LTA_TOKEN,
    },
    redirect: "follow",
  };

  try {
    console.log("request");
    const response = await fetch(
      `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`,
      requestOptions
    );
    const result = await response.json();
    return result.Services;
  } catch (error) {
    return console.log("error", error);
  }
};

export const getBusRoutes = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `https://api.mapbox.com/datasets/v1/streetlamb/ckiem4yfn0if923pi6h8zgwqs/features?access_token=${MAPBOX_TOKEN}`,
      requestOptions
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};

export default getBusArrival;
