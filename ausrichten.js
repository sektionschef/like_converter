
var first_rotation = 0;
var second_rotation = 181;
var pause_rotation = 3000;
var pause_finished = 2000;

// --------------- ARDUINO ---------------

// Verdrahtung Arduino:
//	schwarz: GND
//	rot: 5V
//	orange: digital OUT Pin 9

var async = require('async');
var firmata = require('firmata');
var device = '/dev/ttyACM0';
var ServoPin = 9;
var board = new firmata.Board(device, arduinoReady);


function arduinoReady(err) {
    if (err) {
        console.log(err);
        return;
    }
	console.log('Connected to Arduino using firmware: ' + board.firmware.name + '-' + board.firmware.version.major + '.' + board.firmware.version.minor);
	board.pinMode(ServoPin, board.MODES.SERVO);
//	board.servoWrite(ServoPin,90);


var arr = [];
for (var i=1; i<=10; i++) {
	arr[i] = i;
}

async.eachSeries(arr, function (anything, callback) {async.series([
//	function (cally){setTimeout(function(){board.digitalWrite(13, board.HIGH);console.log(anything+". LED ON");cally()},pause_finished)},
	function (cally){setTimeout(function(){board.servoWrite(ServoPin,first_rotation);console.log(anything+". first fire");cally()},pause_finished)}, //servo write
//	function (cally){setTimeout(function(){board.digitalWrite(13, board.LOW);console.log(anything+". LED OFF");cally()},pause_rotation)},
	function (cally){setTimeout(function(){board.servoWrite(ServoPin,second_rotation);console.log(anything+". secondary fire");cally()},pause_finished)}, //servo write
	function (cally){callback();cally();}
])}, function (err) {
  if (err) { throw err; }
  console.log('Success');
});




// HELPER
//async.eachSeries([ 2, 3, 5, 7, 11 ], function (prime, callback) {
// console.log(prime);
//  callback(); // Alternatively: callback(new Error());
//}, function (err) {
//  if (err) { throw err; }
//  console.log('Well done :-)!');
//});



//	process.exit(code=0);



