'use strict';

var PubNub = require('pubnub');
 
var pubnub = new PubNub({
    subscribeKey: "sub-c-4e681cea-8380-11e7-8979-5e3a640e5579",
    publishKey: "pub-c-cb417719-13c2-493c-800e-b45315fdf059",
    ssl: true
});

pubnub.addListener({
    message: function(message){
        console.log(message.message.command)
    }
});

pubnub.subscribe({
    channels: ['drone_channel'],
});
