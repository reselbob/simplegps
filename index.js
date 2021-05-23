const express = require('express');
const morgan = require( 'morgan');
const { logger, winston } = require( './logger/logger');
const { Listener } = require( 'node-gpsd');
const gpggaParser  = require( './helpers/gpsHelper');
const { kafkaProducer } = require( './helpers/kafkaHelper');

//if the kafkaProducer is valid, connect it
if (kafkaProducer) kafkaProducer.connect();


const app = express();
const port = process.env.GPS_APP_PORT || 3000;

app.use(morgan('combined', { stream: winston.stream }));

const sendEvent = async (eventMessage) => {
  if (kafkaProducer) {
    const topic = process.env.SIMPLEGPS_KAFKA_TOPIC || 'test_topic';
    await producer.send({
      topic: topic,
      messages: [
        { value: eventMessage },
      ]
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

app.listen(port, () => {
  const obj = {};
  obj.port = port;
  obj.startTime = new Date();
  obj.host = process.env.GPS_APP_HOST || 'localhost';
  logger.info(obj)
})