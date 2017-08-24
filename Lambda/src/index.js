// index.js
// Computer/Alexa, start drone control...

'use strict';

const droneChannel = 'drone_channel'

const PubNub = require('pubnub')
var pubnub = new PubNub({
    ssl           : true,  // <- enable TLS Tunneling over TCP 
    publishKey   : "pub-c-cb417719-13c2-493c-800e-b45315fdf059",
    subscribeKey : "sub-c-4e681cea-8380-11e7-8979-5e3a640e5579"
});

console.log("pubnub object created")

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to drone control.';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Control the drone by saying takeoff, left, right, land or shutdown';
    const shouldEndSession = false;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const shouldEndSession = true;
    const speechOutput = 'Drone control session ended!';
    
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function about(intent, session, callback) {
    const cardTitle = intent.name;
    const shouldEndSession = false;
    let speechOutput = "This utility was created by Michael Alderson.";

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

// --------------- Drone control command relay -----------------------

// TODO
// Handle non-response (no listener)
// log objects
// up, down, turn left, turn right
// DONE
// Create common drone control function instead of copy/paste (seems not to work)

function droneCommand(droneCommand, cardTitle, speechOutput, shouldEndSession, callback) {

    console.log("drone command: ", droneCommand)
 
    const commandMessage = {
        "command" : droneCommand,
    };

    pubnub.publish({
        channel: droneChannel,
        message: commandMessage
    },
    function(status, response) {
        if (status.error) {
            console.log(`ERRROR drone command: ${droneCommand} - ${response} -- ${status}`);
            callback({}, buildSpeechletResponse(cardTitle, "Could not send command to drone", null, shouldEndSession));
        } else {
            console.log(`SUCCESS drone command: ${droneCommand} - ${response} -- ${status}`);
            callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
        }
    });
}

// --------------- Drone control functions -----------------------

function droneSetup(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone setup complete.";
    const shouldEndSession = false;
    droneCommand("setup", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneTakeoff(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone is taking off.";
    const shouldEndSession = false;
    droneCommand("takeoff", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneLand(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone is landing.";
    const shouldEndSession = false;
    droneCommand("land", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneForward(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone is moving forward.";
    const shouldEndSession = false;
    droneCommand("forward", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneBackward(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone is moving backward.";
    const shouldEndSession = false;
    droneCommand("backward", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneMoveLeft(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone is moving left.";
    const shouldEndSession = false;
    droneCommand("left", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneMoveRight(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone is moving right.";
    const shouldEndSession = false;
    droneCommand("right", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneTurnLeft(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone is turning left.";
    const shouldEndSession = false;
    droneCommand("turn_left", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneTurnRight(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone is turning right.";
    const shouldEndSession = false;
    droneCommand("turn_right", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneAscend(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone is going up.";
    const shouldEndSession = false;
    droneCommand("ascend", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneDescend(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone is going down.";
    const shouldEndSession = false;
    droneCommand("descend", cardTitle, speechOutput, shouldEndSession, callback);
}

function droneShutdown(intent, session, callback) {
    const cardTitle = intent.name;
    const speechOutput = "Drone has been shutdown. Exiting skill.";
    const shouldEndSession = true;
    droneCommand("shutdown", cardTitle, speechOutput, shouldEndSession, callback);
}
        
// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    //console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    //console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    //console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'SetupIntent') {
        droneSetup(intent, session, callback);
    } else if (intentName === 'TakeoffIntent') {
        droneTakeoff(intent, session, callback);
    } else if (intentName === 'LandIntent') {
        droneLand(intent, session, callback);
    } else if (intentName === 'ShutdownIntent') {
        droneShutdown(intent, session, callback);
    } else if (intentName === 'ForwardIntent') {
        droneForward(intent, session, callback);
    } else if (intentName === 'BackwardIntent') {
        droneBackward(intent, session, callback);
    } else if (intentName === 'LeftIntent') {
        droneMoveLeft(intent, session, callback);
    } else if (intentName === 'RightIntent') {
        droneMoveRight(intent, session, callback);
    } else if (intentName === 'TurnLeftIntent') {
        droneTurnLeft(intent, session, callback);
    } else if (intentName === 'TurnRightIntent') {
        droneTurnRight(intent, session, callback);
    } else if (intentName === 'AscendIntent') {
        droneAscend(intent, session, callback);
    } else if (intentName === 'DescendIntent') {
        droneDescend(intent, session, callback);
    } else if (intentName === 'AboutIntent') {
        about(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    //console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        //console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
