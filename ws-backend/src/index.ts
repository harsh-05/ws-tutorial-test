import WebSocket, {WebSocketServer, type ClientOptions} from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface ExtwebSocket extends WebSocket {
    userNumber: number;
}

let userNUmber = 1;
wss.on('connection', function connection(ws:ExtwebSocket) {
 
    ws.userNumber = userNUmber++;    

    ws.on('error', (e) => (console.log(e)));

    ws.on('message', (mes) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                
                client.send(`User ${ws.userNumber} sends message : ` + mes.toString());
            }
            let c = client as ExtwebSocket;
            
        })
        console.log("A message has appeared and size is : " + wss.clients.size);
    });

    console.log("A connection is added and size is : " + wss.clients.size);

    ws.on('close', () => {
        console.log(`user ${ws.userNumber} has been closed !!`);
    })

})

wss.on('close', (ws:ExtwebSocket) => {
   
    console.log("A connection is closed and currently the user size is" + wss.clients.size);
})


