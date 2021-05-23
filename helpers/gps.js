const gpggaParser = (gpsSentence) => {
    const arr = gpsSentence.split(',');
    const gpsObj = {};
    gpsObj.time = arr[1];
    gpsObj.latitude = arr[2];
    gpsObj.latHemisphere = arr[3];
    gpsObj.longitude = arr[4];
    gpsObj.longHemispere = arr[5];
    gpsObj.gpsStatus = arr[6];
    gpsObj.satelliteNumber = arr[7];
    gpsObj.HDOP = arr[8];
    gpsObj.altitude = arr[9];
    gpsObj.undulation = arr[10];
    gpsObj.differentialTime = arr[11];
    gpsObj.differentialBaseStationID = arr[12];

    return gpsObj

}

module.exports = gpggaParser;