const gpggaParser = (gpsSentence) => {
    const arr = gpsSentence.split(',');
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
    gpsObj.heightAboveWGS84Ellipsoid= arr[11];
    gpsObj.heightAboveWGS84EllipsoidUnits = arr[12];
    gpsObj.timeSinceLastUpdate = arr[13];
    gpsObj.checkSum = arr[14].substr(0,arr[14].length-1);

    return gpsObj

}

module.exports = gpggaParser;