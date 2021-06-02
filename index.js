const express = require('express');
const morgan = require( 'morgan');
const { logger, winston } = require( './logger/logger');
const { Listener } = require( 'node-gpsd');
const gpggaParser  = require( './helpers/gpsHelper');
const {pushGps, getLastGps} = require('./helpers/gpsRotator')

const app = express();
const port = process.env.GPS_APP_PORT || 3000;

app.use(morgan('combined', { stream: winston.stream.write }));

var listener = new Listener({
  port: 2947,
  hostname: 'localhost',
  logger: {
    info: function () { },
    warn: console.warn,
    error: console.error
  },
  parse: false
});

listener.connect(function () {
  logger.info(`Connected to GPS device at: ${new Date()}`);
});


// parse is false, so raw data get emitted.
listener.on('raw', function (data) {
  if (data.includes('GPGGA')) {
    const result = gpggaParser(data)
    pushGps(result);
    logger.gpsEvent(result);
  }
});

listener.watch({ class: 'WATCH', nmea: true });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/currentLocation', async (req, res) => {
  const location = getLastGps();
  res.send(location);
})

  /*
  takes a JSON structure as follows
  {
    latitude: double,
    latHemisphere: 'N' or 'S'
    longitude: double,
    longHemisphere: 'E' or 'W',
    altitude: double,
    altitudeUnit: defaults to 'M', meters
  }

  Example
   {
    latitude: 3401.2106,
    latHemisphere:'N'
    longitude: 11824.67467,
    longHemisphere:'W',
    altitude: 21.7,
    altitudeUnit: 'M'
  }

  */
app.post('/isnear', async (req, res) => {

  //go to the log file and get the last line
  const otherLocation = req.body;
  const location = getLastGps();
  throw new Error('Not Implemented');
  res.send(location)
})

const server = app.listen(port, () => {
  const obj = {};
  obj.port = port;
  obj.startTime = new Date();
  obj.host = process.env.GPS_APP_HOST || 'localhost';
  logger.info(obj)
})

const shutdown = () => {
  logger.info(`Server shutting down at ${new Date()}`);
  listener.disconnect();
  server.close();
};

module.exports = {server, shutdown };