var baudio = require('baudio');

var b = baudio();
var n = -21;
b.push(function (t) {
  var sec = Math.floor(t);
  var tmpN = n + (sec);

	// middle A is 440 hz
	var FREQ = 440 * Math.pow(2, tmpN / 12);
	// we have to produce 1 sin wave cycle every 1/261.63	sec
	var TIME = 1/FREQ;
  // this gives us how far through the cycle we are
	var x = (t % TIME);
	// this gives us that as a percentage of the cycle
	var y = x / TIME;
  // this gives us the correct value to output
  z = Math.sin(y * Math.PI * 2);
  
  return z;
});

b.play();
if (!process.stdout.isTTY) b.pipe(process.stdout);

