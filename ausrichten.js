
var first_rotation = 0;
var second_rotation = 181;
var pause_rotation = 3000;

// --------------- ARDUINO ---------------

// Verdrahtung Arduino:
//	schwarz: GND
//	rot: 5V
//	orange: digital OUT Pin 9

var firmata = require('firmata');
var device = '/dev/ttyACM0';
var ServoPin = 9;
var board = new firmata.Board(device, arduinoReady);


function arduinoReady(callback) {
    console.log('Connected to Arduino using firmware: ' + board.firmware.name + '-' + board.firmware.version.major + '.' + board.firmware.version.minor);
    board.pinMode(ServoPin, board.MODES.SERVO);
//    board.servoWrite(ServoPin,90);
    fire();
}


function fire() {
    board.servoWrite(ServoPin,first_rotation);
    console.log('first fire, wait.');
    setTimeout(function() {
		console.log('second fire!');
		board.servoWrite(ServoPin,second_rotation);
		process.exit(code=0);
    }, pause_rotation);
}



// CALLBACK
/*
function mySandwich(param1, param2, callback) {
    console.log('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
    setTimeout(callback,3000);
}

function finished () {
    	console.log('Finished eating my sandwich.');
}
  
mySandwich('ham', 'cheese', finished );
*/
