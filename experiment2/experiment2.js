const midi = require('midi');
const util = require('util');
var express = require("express");

// Set up a new input.
const input = new midi.Input();
var output = new midi.Output();

// Count the available input ports.
var portCount = input.getPortCount();

var elektronPort = portCount-1;

// Get the name of a specified input port.
var portName = input.getPortName(elektronPort);

console.log(`port count: ${portCount}, port name: ${portName}`)

function prettyMidiPrint(message)
{
  // https://users.cs.cf.ac.uk/Dave.Marshall/Multimedia/node158.html summarizes many of these
  // https://learn.sparkfun.com/tutorials/midi-tutorial/all also very helpful
  var fmtMessage;
  switch (message[0]) {
    case 0xc9: // might not always be 0xc9? maybe it's "fx control channel" on digitone which defaults to 9
      return util.format('%s: %s', 'program change(0xc9)', message[1]);
    case 0xf8:
      return 'clock(0xf8)';
    case 0xfa:
      return 'start(0xfa)';
    case 0xfc:
      return 'stop(0xfc)';
    case 0xb4: // 0xb4 120 - sent when stop hit twice on digitone
    case 0xf0: // unknown
    default:
      return util.format('unknown(%s): %s, %s', message[0].toString(16), message[1], message[2]);
  }
}

var playing = false;
var currentProgram = 0;
var programHistory = new Array();

// Configure a callback for received midi message handling
input.on('message', (deltaTime, message) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  switch(message[0]) {
    case 0xf8: // timing clock sent every 1/24th of quarter note
      break;
    case 0xfa:
      playing = true;
      console.log('playing');
      break;
    case 0xfc:
      playing = false;
      console.log('stopping');
      break;
    case 0xc9: // program change received
      currentProgram = message[1];
      programHistory.push(currentProgram);
    default:
      console.log(`m: ${prettyMidiPrint(message)} d: ${deltaTime}`);
  }
});



// Create a endpoint for current status
var app = express();

app.listen(4400, () => {
  console.log("Server running on port 4400")
});

app.get("/current", (req, res, next) => {
  res.json({playing: playing, currentProgram: currentProgram});
});
// Create an endpoint for program history

app.get("/history", (req, res, next) => {
  res.json({history: programHistory});
});

// Open the first available input port.
input.openPort(elektronPort);
output.openPort(elektronPort);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(false, false, false);

// ... receive MIDI messages ...

// Close the port when done.
setTimeout(function() {
  input.closePort();
  output.closePort();
}, 60*60*1000); // 1 hr