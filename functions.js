require('./database.js');

function logWithTimestamp(message) {

    const time = new Date().toLocaleTimeString("de-DE");
    const day = new Date().toLocaleDateString("de-DE");
    const weekDay = new Date().getDay();
    const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const timestamp = `[ ${dayNames[weekDay]}, ${day} | ${time} ]`;
    return console.log(timestamp + ' ' + message);
}

module.exports = {
    logWithTimestamp,
};