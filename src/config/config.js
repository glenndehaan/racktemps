/**
 * General config
 */
const config = {
    application: {
        name: "RackTemps",
        env: " (local)",
        basePath: "/",
        port: 3001,
        bind: "0.0.0.0"
    },
    display: {
        enabled: true,
        channel: "3E"
    },
    led: {
       enabled: true,
       pin: 16
    },
    tempSensor: {
        dht11: {
            enabled: true,
            pin: 18
        }
    }
};

module.exports = config;
