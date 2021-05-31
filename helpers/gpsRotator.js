const { logger } = require("../logger/logger");

/*
The purpose of this module is to provide a mechanism to store
gps location in memory in rotation.
*/
const arr = [];

/*
    Adds a gps location to the in-memory array
*/
const pushGps = (gps) => {
    if(arr.length > 10){
        arr.shift()
    }
    arr.push(gps);
    logger.debug(`the current size of the in-memory array is ${arr.length}`);
}

const getLastGps = () =>{
    return arr.slice(-1)[0];
}

module.exports = {pushGps, getLastGps}