import WebSocket, {WebSocketServer, type ClientOptions} from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// interface ExtwebSocket extends WebSocket {
//     userNumber: number;
// }

enum Message  {
    Increment = "increment"
}

type data = {
        type: Message.Increment
    }
    
let userNUmber = 0;



wss.on('connection', function connection(ws) {
 
    ws.send(JSON.stringify({ number: userNUmber }));  

    ws.on('error', (e) => (console.log(e)));

    ws.on('message', (mes) => {

        const stringdata = typeof mes === 'string' ? mes : mes.toString();
        const message = JSON.parse(stringdata);
        if (message.type === Message.Increment) {
            userNUmber++;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({number:userNUmber}))
                    }
            })
        }
        // wss.clients.forEach((client) => {
        //     if (client.readyState === WebSocket.OPEN) {
                
        //         // client.send(`User ${ws.userNumber} sends message : ` + mes.toString());
        //         client.send(JSON.stringify({ number: userNUmber }))
        //     }
            // let c = client as ExtwebSocket;
            
        // })
        // console.log("A message has appeared and size is : " + wss.clients.size);
    });

    // console.log("A connection is added and size is : " + wss.clients.size);

    ws.on('close', () => {
        console.log(`user $ has been closed !!`);
    })

})

wss.on('close', () => {
   
    console.log("A connection is closed and currently the user size is" + wss.clients.size);
})


