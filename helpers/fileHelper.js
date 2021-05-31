const readLastLines = require('read-last-lines');
const path = require('path');
const appRoot = require('app-root-path');

const getLastLine = async() => {
    const logPath = require('app-root-path').resolve('/logs/gps.log')
    const line =  await readLastLines.read(logPath, 1)

    return line;
}

module.exports = {getLastLine};
