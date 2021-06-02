const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { logger, winston } = require('./logger/logger');
const { Listener } = require('node-gpsd');
const {gpggaParser, gpggaLatLongConvert} = require('./helpers/gpsHelper');
const { pushGps, getLastGps } = require('./helpers/gpsRotator')
const { getDistance } = require('./helpers/geoDiffer');

const app = express();
const port = process.env.GPS_APP_PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/currentLocation',  (req, res) => {
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
  latHemisphere:'N',
  longitude: 11824.67467,
  longHemisphere:'W',
  altitude: 21.7,
  altitudeUnit: 'M'
}

*/
app.post('/distanceFromMe', (req, res) => {
  const yourLocation = gpggaLatLongConvert(req.body);
  const myLocation = getLastGps();
  const distance = getDistance(myLocation, yourLocation);
  res.send(distance);
})

const server = app.listen(port, () => {
  const obj = {};
  obj.port = port;
  obj.startTime = new Date();
  obj.host = process.env.GPS_APP_HOST || 'localhost';
  logger.info(obj)
})

const shutdown = async () => {
  logger.info(`GPS is disconnecting at ${new Date()}`);
  await listener.disconnect();
  logger.info(`Server is shutting down at ${new Date()}`);
  await server.close();
};

module.exports = { server, shutdown };