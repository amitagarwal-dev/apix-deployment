const httpServer                        = require('http').createServer();
const port = process.argv[2];
if(port == undefined)
throw "USAGE: node httpserver.js <PORT>";

httpServer.maxConnections       = 1000;
httpServer.timeout              = 130000;

httpServer.on ('error', (e) => {
    console.log ({
            ERROR           : e,
    });
})

httpServer.on ('request', clientRequestHandler);

httpServer.on ('listening', () => {
console.log ('Server Is Listening On IP : %s And PORT : %s :-)', '0.0.0.0', port);
});


httpServer.on ('connection', () => {
console.log ('Connection Established');

});

httpServer.on ('timeout', (clientSocket) => {
    console.log ({
            ERROR           : "Timedout Occured Between Client And Server",
    });
    clientSocket.destroy();
});

httpServer.on ('clientError', (err, socket) => {
    console.log ({
            ClientError : err,
        });
        socket.end ('HTTP/1.1 400 Bad Request');
    });

httpServer.listen(port, '0.0.0.0', 300);
function clientRequestHandler (_ClientRequest_, _ClientResponse_) {
    console.log("CLIENT METHOD: ",_ClientRequest_.method);
    console.log("CLIENT URL: ",_ClientRequest_.url);
    let chunk ='';
    _ClientRequest_.on ('data', (ClientData) => {readingClientData(ClientData)}).on ('end', () => {
            console.log("DATA FROM CLIENT: ",chunk);
            responseToClient(_ClientRequest_, _ClientResponse_);
          console.log("#################################################");
    }).on ('error', (e) => {
            console.log ("ERROR ON READING STREAM [FUNCTION : clientRequestHandler] ERROR :", e);
            _ClientRequest_.destroy ();
    });


    function readingClientData (ClientData) {
            chunk += ClientData;
}
function responseToClient(req, res) {
    let message = '';
    switch (req.url) {

        case '/login':
            message = "\"{\\\"TOKEN\\\":\\\"amit1234567890\\\"}\""
            console.log("RESPONSE TO CLIENT: ", JSON.parse(message));
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Connection'  : 'close'});
            res.write(JSON.parse(message));
            res.end();
        break;
    
        case '/logout':
            message = "\"{\\\"ERRORCODE\\\":\\\"00\\\"}\""
            console.log("RESPONSE TO CLIENT: ", JSON.parse(message));
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Connection'  : 'close'});
            res.write(JSON.parse(message));
            res.end();
        break;
    
default:
    message = '{"Error":"Web Service Not Found"}';
    console.log("RESPONSE TO CLIENT: ", JSON.parse(message));
    res.writeHead(404, {
        'Content-Type': 'application/json',
        'Connection'  : 'close'});
    res.write(message);
    res.end();
}
}

}
