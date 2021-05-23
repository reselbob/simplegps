const { Kafka } = require('kafkajs');
const appId = process.env.SIMPLEGPS_KAFKA_APP_ID || 'SimpleGPS';
let kafkaProducer;

//TODO Validate the environment variables


if (process.env.SIMPLEGPS_KAFKA_HOST_IP && process.env.SIMPLEGPS_KAFKA_HOST_PORT) {
    
    kafka = new Kafka({
        clientId: appId,
        brokers: [`${process.env.SIMPLEGPS_KAFKA_HOST_IP}:${process.env.SIMPLEGPS_KAFKA_HOST_PORT}`]
    })

    kafkaProducer = kafka.producer()

}

module.exports = {kafkaProducer};
