//http://nodejs.org/api/https.html
var https = require('https')
var fs = require('fs');
var async = require('async');
//var cronJob = require('cron').CronJob;
var firmata = require('firmata');

var credentials = require('./credentials/credentials.js');

// --------------- ARDUINO ---------------

// Verdrahtung Arduino:
//	schwarz: GND
//	rot: 5V
//	orange: digital OUT Pin 9

// -------------- VARIABLES -----------------
var feed_username = "ambuzzador"; //username
var first_rotation = 0;
var second_rotation = 181;
var pause_rotation = 3000;
var pause_finished = 2000;


var device = '/dev/ttyACM0'
var ServoPin = 9;
board = new firmata.Board(device, arduinoReady);
 
function arduinoReady(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connected to Arduino using firmware: ' + board.firmware.name + '-' + board.firmware.version.major + '.' + board.firmware.version.minor);
    board.pinMode(ServoPin, board.MODES.SERVO);
}


function fire(arr) {
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
}


var options = {
  host: "graph.facebook.com",
  port: 443,
  path: "/" + feed_username + "/feed?access_token=" + credentials.access_token + "&fields=likes.summary(true)&limit=1",
  method: 'GET'
};


setInterval(trigger, 60000) // 60000 milliseconds = 1 minute


function trigger() {

	var req = https.request(options, function(res) {
//		console.log('STATUS: ' + res.statusCode);
//		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
//			console.log('BODY: ' + chunk);
			var oida = JSON.parse(chunk);
			var count = oida.data[0].likes.summary.total_count;
			console.log("read on "+ Date() + "I come up with "+ count + " likes");
			fs.readFile("like_count", 'utf8', function(err,data) {
				if (err) {
					return console.log(err);
				}
//				console.log('file read: ' + data);
				var count_minus = data;
// CHECK IT
				if (count>count_minus) { 
					console.log("aktuelle Likes ("+ count + ") größer als Likes zuvor (" + count_minus + ")");
					var diff = count-count_minus
					var arr = [];
					for (var i=0; i<=diff-1; i++) {
						arr[i] = i;
					}
					fire(arr);	
				} else {
					console.log("aktuelle Likes ("+ count + ") kleiner gleich Likes zuvor (" + count_minus + ")");
					console.log("je suis désolé")
				}
				
				fs.writeFile("like_count", count, function(err) {
				if(err) {
					console.log(err);
				} else {
					//console.log("write: " + count);
				}		
				});
			});		
		});
	});
	
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	// write data to request body
	req.write('data\n');
	req.write('data\n');
	req.end();
}


