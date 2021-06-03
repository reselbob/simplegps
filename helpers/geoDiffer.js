const Distance = require('geo-distance')
const { logger } = require('../logger/logger');

/*
  takes a JSON structures as follows
  {
    latitude: double,
    latHemisphere: 'N' or 'S',
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

const getDistance = (myLocation, yourLocation) => {
    //TODO validate locations
    let myLat = myLocation.latitude;
    let myLong = myLocation.longitude;

    let yourLat = yourLocation.latitude;
    let yourLong = yourLocation.longitude;

    if (myLocation.latHemisphere.toUpperCase() === 'S'){
      myLat = myLat * -1
    }

    if (myLocation.longHemisphere.toUpperCase() === 'W'){
      myLong = myLong * -1
    }

    if (yourLocation.latHemisphere.toUpperCase() === 'S'){
      yourLat = yourLat * -1
    }

    if (yourLocation.longHemisphere.toUpperCase() === 'W'){
      yourLong = yourLong * -1
    }

    const mine = {
      lat: myLat,
      lon: myLong
    };
    const yours = {
      lat: yourLat,
      lon: yourLong
    };

    const distance = Distance.between(mine, yours);
    logger.debug({function: 'getDistance',mine, yours, distance });
    const result = distance.human_readable();

    return result;
};

module.exports = {getDistance}