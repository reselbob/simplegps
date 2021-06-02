const isNumeric = (num)=> {
    return ! isNaN(num)
  }
  

const gpggaParser = (gpsSentence) => {
    const arr = gpsSentence.split(',');
    const gpsObj = {};
    gpsObj.messageTypeId = arr[0],
    gpsObj.utcTime = parseFloat(arr[1]);
    gpsObj.latitude = parseFloat(arr[2]);
    gpsObj.latHemisphere = arr[3];
    gpsObj.longitude = parseFloat(arr[4]);
    gpsObj.longHemisphere = arr[5];
    gpsObj.positionFixIndicator = parseInt(arr[6]);
    gpsObj.satelliteNumber = parseInt(arr[7]);
    gpsObj.HDOP = parseFloat(arr[8]);
    gpsObj.altitude = parseFloat(arr[9]);
    gpsObj.altitudeUnits = arr[10];
    gpsObj.heightAboveWGS84Ellipsoid= parseFloat(arr[11]);
    gpsObj.heightAboveWGS84EllipsoidUnits = arr[12];
    let buff = arr[13];
    if  (isNumeric(buff)){gpsObj.timeSinceLastUpdate = parseFloat(arr[13])} else {gpsObj.timeSinceLastUpdate = arr[13]};
    //gpsObj.timeSinceLastUpdate = arr[13]; 
    gpsObj.checkSum = arr[14].substr(0,arr[14].length-1);

    return gpsObj

}

module.exports = gpggaParser;