'use strict';

const PubNub = require('pubnub');
 
var pubnub = new PubNub({
    subscribeKey: "sub-c-4e681cea-8380-11e7-8979-5e3a640e5579",
    publishKey: "pub-c-cb417719-13c2-493c-800e-b45315fdf059",
    ssl: true
});

const Drone = require("rolling-spider");
var drone = new Drone();

const STEPS = 10;

drone.connect(function () {
    drone.setup(function () {
        drone.flatTrim();
        drone.startPing();
        drone.flatTrim();
        console.log('Connected to: ', drone.name);
    })
})

pubnub.addListener({
    message: function(message) {
        switch (message.message.command) {
            case "setup":
                console.log('drone:', message.message.command);
                drone.setup(function () {
                    drone.flatTrim();
                    drone.startPing();
                    drone.flatTrim();
                })
            break;

            case "takeoff":
                console.log('drone:', message.message.command);
                drone.takeOff(); 
                break;

            case "land":
                console.log('drone:', message.message.command);
                drone.land();
                break;

            case "shutdown":
                console.log('drone:', message.message.command);
                drone.land();
                process.exit();
                break;

            case "forward":
                console.log('drone:', message.message.command);
                drone.forward({ steps: STEPS });
                break;

            case "backward":
                console.log('drone:', message.message.command);
                drone.backward({ steps: STEPS });
                break;

            case "left":
                console.log('drone:', message.message.command);
                drone.tiltLeft({ steps: STEPS });
                break;

            case "right":
                console.log('drone:', message.message.command);
                drone.tiltRight({ steps: STEPS });
                break;

            case undefined:
                console.log('undefined drone command:', message.message.command);
                break;
            
            default:
                console.log('unrecognised drone command:', message.message.command);
                break;
        }
    }
});

pubnub.subscribe({
    channels: ['drone_channel'],
});
