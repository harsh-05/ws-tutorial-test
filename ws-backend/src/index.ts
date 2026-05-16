import WebSocket, {WebSocketServer, type ClientOptions} from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface ExtwebSocket extends WebSocket {
    userNumber: number;
}

let userNUmber = 1;
wss.on('connection', function connection(ws:ExtwebSocket, ) {
 
    ws.userNumber = userNUmber++;    

    ws.on('error', (e) => (console.log(e)));

    ws.on('message', (mes) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
               
                client.send(`User ${ws.userNumber} sends message : ` + mes.toString());
            }
        })
        console.log("received " + mes.toString());
        console.log("received " + mes.toLocaleString());
        console.log("received " + mes);
    });

})


