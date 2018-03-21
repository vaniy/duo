var app = require('./app');
var https = require('https');
var http = require('http');
// var chatServer = require('./lib/chat_server');
var fs = require('fs');
// var http = chatServer.createServer(app);
// var options = {
//     key: fs.readFileSync('./certification/214217433150386.key'),
//     cert: fs.readFileSync('./certification/214217433150386.pem')
// }


// io.emit('some event', {for: 'everyone' });
http.createServer(app).listen(8009)
    // http.createServer(app).listen(80)
    // https.createServer(options, app).listen(443)
    // http.listen(80,function(){
    // 	console.log('listening on *:80');
    // });