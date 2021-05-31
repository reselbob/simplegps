const arr = [];

const pushGps = (gps) => {
    if(arr.length > 10){
        arr.shift()
    }
    arr.push(gps);
}

const getLastGps = () =>{
    return arr.slice(-1)[0];
}

module.exports = {pushGps, getLastGps}