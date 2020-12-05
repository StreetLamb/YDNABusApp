const TOKEN = process.env.REACT_APP_TOKEN;

const getBusArrival = async (busStopCode) => {
  let requestOptions = {
    method: "GET",
    headers: {
      AccountKey: TOKEN,
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

export default getBusArrival;
