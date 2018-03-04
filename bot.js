var AWS = require('aws-sdk');
var fs = require('fs');
var ts = require('tailstream');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

let credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

AWS.config.credentials = credentials;
   var FULFILLED = 'Fulfilled',
   RESPONSE_FILE = 'response.mpeg',
   REMOVE_REQUEST_FILE = 'rm request.wav',
   SOX_COMMAND = 'sox -d -t wavpcm -c 1 -b 16 -r 16000 -e signed-integer --endian little - silence 1 0 1% 5 0.3t 2% > request.wav',
   streaming = false,
   inputStream,
   lexruntime = new AWS.LexRuntime({
     region: 'us-east-1'
   });

var setupStream = function() {
   streaming = true;
   inputStream = ts.createReadStream('./request.wav');
   var params = {
     botAlias: '$LATEST',
     botName: 'FaceDetectorAI',
     userId: 'lexHeadTesting',
     contentType: 'audio/l16; rate=16000; channels=1',
     inputStream: inputStream
   };

   //play a dong sound before sending message to LEX API
   execSync('aplay /home/pi/snowboy/rpi-arm-raspbian-8.0-1.2.0/resources/dong.wav');

   lexruntime.postContent(params, function(err, data) {
     if (err) {
       console.log(err, err.stack);
       process.exit(1);
     } else {
       fs.writeFile(RESPONSE_FILE, data.audioStream, function(err) {
         if (err) {
           return console.log(err);
           process.exit(1);
         }
       });
       var playback = exec('sudo mpg321 ' + RESPONSE_FILE);
       playback.on('close', function(code) {
         exec('rm ' + RESPONSE_FILE);
         if (data.dialogState !== FULFILLED) {
           streaming = false;
           record();
         }
       });
     }
   });
 }

var record = function() {
   var recording = exec(SOX_COMMAND);
   recording.stderr.on('data', function(data) {
     console.log(data);
     if (!streaming) {
       setupStream();
     }
   });
   recording.on('close', function(code) {
     inputStream.done();
     exec(REMOVE_REQUEST_FILE);
   });
 }
record();
