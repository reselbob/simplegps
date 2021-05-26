const express = require('express');
const morgan = require( 'morgan');
const { logger, winston } = require( './logger/logger');
const { Listener } = require( 'node-gpsd');
const gpggaParser  = require( './helpers/gpsHelper');
const { kafkaProducer } = require( './helpers/kafkaHelper');
const {getLastLine} = require('./helpers/fileHelper');

//if the kafkaProducer is valid, connect it
if (kafkaProducer) kafkaProducer.connect();


const app = express();
const port = process.env.GPS_APP_PORT || 3000;

app.use(morgan('combined', { stream: winston.stream }));

const sendEvent = async (eventMessage) => {
  if (kafkaProducer) {
    const topic = process.env.SIMPLEGPS_KAFKA_TOPIC || 'gps';
    await kafkaProducer.send({
      topic: topic,
      messages: [
        { value: eventMessage },
      ]
    })
    .catch(e => {
      logger.error(e);
    });
    const info = {
      message: 'Sent GPS info to Kakfa',
      payload: eventMessage
    }
    logger.info({info})
  }
}


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
    sendEvent(result);
    logger.gpsEvent(result);
  }
});

listener.watch({ class: 'WATCH', nmea: true });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/currentLocation', async (req, res) => {
  //go to the log file and get the last line
  const location = JSON.parse(await getLastLine());
  res.send(location.message)
})

app.listen(port, () => {
  const obj = {};
  obj.port = port;
  obj.startTime = new Date();
  obj.host = process.env.GPS_APP_HOST || 'localhost';
  logger.info(obj)
})