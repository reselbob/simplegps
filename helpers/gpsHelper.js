const { logger } = require('../logger/logger');

const isNumeric = (num) => {
    return !isNaN(num)
}

const parseArrayForNumbers = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (isNumeric(arr[i])) arr[i] = parseFloat(arr[i])
    }
    return arr;
}

/*
 converts lat/long data into ##.###### format
*/
const gpggaLatLongConvert = (gpsObj) => {

    logger.debug({function: 'gpggaLatLongConvert', original: gpsObj});

    const lat = (t) => {
        return (Number(t.slice(0, 2)) + (Number(t.slice(2, 9)) / 60))
    }

    const lng = (g) => {
        return (Number(g.slice(0, 3)) + (Number(g.slice(3, 10)) / 60))
    }

    if (isNumeric(gpsObj.latitude)) {
        gpsObj.latitude = lat(gpsObj.latitude.toString());
    }

    if (isNumeric(gpsObj.longitude)) {
        gpsObj.longitude = lng(gpsObj.longitude.toString());
    }
    logger.debug({function: 'gpggaLatLongConvert', converted: gpsObj});
    return gpsObj
}

const gpggaParser = (gpsSentence) => {
    logger.debug({ location: 'gpsHelper', gpsSentence })
    const arr = parseArrayForNumbers(gpsSentence.split(','));
    const gpsObj = {};
    gpsObj.messageTypeId = arr[0],
        gpsObj.utcTime = arr[1];
    gpsObj.latitude = arr[2];
    gpsObj.latHemisphere = arr[3];
    gpsObj.longitude = arr[4];
    gpsObj.longHemisphere = arr[5];
    gpsObj.positionFixIndicator = arr[6];
    gpsObj.satelliteNumber = arr[7];
    gpsObj.HDOP = arr[8];
    gpsObj.altitude = arr[9];
    gpsObj.altitudeUnits = arr[10];
    gpsObj.heightAboveWGS84Ellipsoid = arr[11];
    gpsObj.heightAboveWGS84EllipsoidUnits = arr[12];
    gpsObj.timeSinceLastUpdate = arr[13];
    gpsObj.checkSum = arr[14].substr(0, arr[14].length - 1);

    return gpsObj

}



module.exports = { gpggaParser, gpggaLatLongConvert };