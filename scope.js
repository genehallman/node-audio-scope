var spawn = require('child_process').spawn;

var screenWidth = 140;
var screenHeight = 49; //rows

console.log("\033[2J");	 /* clear screen */
console.log("\033[0;0H");

var history = [];
history[screenWidth-1] = null;

var ps = spawn('rec', ['-t', 's16', '-r', '256k', '-']);

var tValue = 0;
var tCount = 0;

var start = null, count = 0, total = 0, lastWrite = null;

ps.stdout.on('data', function(buf) {
  writeDebug(buf);
  var i = 0;
  var id = null;
  
  var nextByte = function() {
    if (i < buf.length-1) {
      var value = buf.readInt16LE(i); // between -2^15 and +(2^15)-1
      tValue += value / Math.pow(2, 15); // now between -1 and 1
      tCount ++;
      i += 2;
      writeBytes();
      process.nextTick(nextByte);
    }
  };
  nextByte();
});

function writeBytes() {
  if (lastWrite && (Date.now() - lastWrite) < 2) {
    return;
  }
  lastWrite = Date.now();
  writeAt(5,0, "Running Total: " + tValue, true);
  writeAt(6,0, "Bytes Counted: " + tCount, true);
  
  var value2 = tValue / tCount;
  tValue = 0;
  tCount = 0;
  value2 = (value2 + 1) / 2; // now between 0 and 1
  writeAt(7,0, "Row Value    : " + value2, true);
  value2 = Math.round(value2 * (screenHeight-1)); // now between 0 and (screenHeight-1)
  value2 = (screenHeight-1) - value2; // inverted so between (screenHeight-1) and 0

  
  history.push(value2);

  for (var j = 0; j < history.length-1; j++) {
    var oldValue = history[j] || Math.round((screenHeight-1) / 2);
    var newValue = history[j+1] || Math.round((screenHeight-1) / 2);
    writeAt(oldValue, j, " ");
    writeAt(newValue, j, "@");
  }
  
  history.shift();
}

function writeDebug(buf) {
  if (!start) {
    start = Date.now();
  } else {
    total = (Date.now() - start);
    count++;
  }
  
  writeAt(1,0, "Buffer Size  : " + buf.length, true);
  writeAt(2,0, "Time Elapsed : " + total, true);
  writeAt(3,0, "Data Count   : " + count, true);
  writeAt(4,0, "Avg Rate     : " + total/count, true);
}

function writeAt(row, col, ch, clearRow) {
  process.stdout.write("\033["+row+";"+col+"H"+(clearRow ? "\033[K" : "")+ch);
}