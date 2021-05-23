const express = require('express');
const morgan = require('morgan');
const {logger, winston} = require('./logger/logger');
const gpsd = require('node-gpsd');
const gpggaParser = require('./helpers/gps')


const app = express();
const port = process.env.GPS_APP_PORT || 3000;

//TODO: Clean up logging

app.use(morgan('combined', { stream: winston.stream }));


var listener = new gpsd.Listener({
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
  logger.info('Connected');
});

//not going to happen, parse is false
listener.on('TPV', function (data) {
  logger.gpsEvent(data);
});

// parse is false, so raw data get emitted.
listener.on('raw', function (data) {
  if(data.includes('GPGGA')){
    const result = gpggaParser(data)
    logger.gpsEvent(result);
  }
});

listener.watch({ class: 'WATCH', nmea: true });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  const obj = {};
  obj.port = port;
  obj.startTime = new Date();
  obj.host = process.env.GPS_APP_HOST || 'localhost';
  logger.info(obj)
})