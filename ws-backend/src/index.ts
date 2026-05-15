import WebSocket, {WebSocketServer} from 'ws';

const wss = new WebSocketServer({ port: 8080 });



wss.on('connection', function connection(ws) {
    ws.on("open", (w:any) => (console.log(w)));

    ws.on('message', (mes) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(mes);
            }
        })
        console.log("received" + mes.toString);
    });

    ws.close()
})

wss.close()
