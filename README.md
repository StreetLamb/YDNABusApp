# YDNABusApp: You don't need a bus app!

YDNABusApp was conceived to provide bus information in Singapore without a need for a dedicated app. Built with React & CSS.

YDNABusApp provides users with an interactive map that users can scroll around to look at bus stops around. Users can then view bus arrival timings at specific bus stops, and retrieve the bus routes of bus services.

## Project Status

Currently, its complete but I might integrate taxi, bicycle and train data to make it a cohesive app for public transportation needs.

## Project screenshot

<img src="https://user-images.githubusercontent.com/16421050/101976291-d3175680-3c7e-11eb-8b73-8b8e10fb0d25.png" height="800" >
<img src="https://user-images.githubusercontent.com/16421050/101976470-8c2a6080-3c80-11eb-9f25-e886bf5d80e0.png" height="800" >


## Installation and setup instructions

Clone this repo. You will need node and npm installed globally on your machine.

Installation:

```bash
npm install
```

To start app:

```bash
npm run start
```

You need to provide your own mapbox and LTA datamall token in a .env file in the root folder. Example:

```
REACT_APP_LTA_TOKEN=<YOUR LTA DATAMALL TOKEN HERE>
REACT_APP_MAPBOX_TOKEN=<YOUR MAPBOX TOKEN HERE>
```

To visit app:
```
localhost:3000/
```

