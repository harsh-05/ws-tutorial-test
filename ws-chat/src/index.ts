import WebSocket, { WebSocketServer } from "ws";
import {safeParse, z} from 'zod'

const messageSchema = z.object({
    type: z.literal("message"),
    message: z.string(),
})

const joinSchema = z.object({
    type: z.literal("join"),
    userName: z.string()
})

type JoinType = z.infer<typeof joinSchema>;
type MessageType = z.infer<typeof messageSchema>;

const messData = z.discriminatedUnion("type", [messageSchema, joinSchema]);

const clientMap = new Map<string, WebSocket>();
const websocketclientMap = new Map<WebSocket, string>();

const wss = new WebSocketServer({ port: 8080 });

type ExtWebsocket = WebSocket & {
        username: string
}

wss.on("connection", (ws: ExtWebsocket, req) => {

    

    ws.on("message", (data) => {
        let parsed: unknown;
        try {
            parsed = JSON.parse(data.toString());
        } catch {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "error", message: " Invalid Json format !" }));
            }
            return;
        }
        const zodResult = messData.safeParse(parsed);
        if (!zodResult.success) {
            ws.send(JSON.stringify({ type: "error", message: zodResult.error.message }));
        } else {
            if (zodResult.data.type === "join") {
                handleJoinUser(clientMap, zodResult.data, ws);
                ws.username = zodResult.data.userName;
            }

            if (zodResult.data.type === "message") {
                handleMessage(clientMap, zodResult.data, ws);
            }
        }
    })

    ws.on("close", () => {
        clientMap.delete(ws.username);
        
    })
})


function handleJoinUser(clientMap: Map<string, WebSocket>, data: JoinType, ws:WebSocket) { 
    if (clientMap.has(data.userName)) {
        ws.send(JSON.stringify({ type: "error", message: "Username already exists!! change the Username" }));
    } else {
        clientMap.set(data.userName, ws);
    }
}


function handleMessage(clientMap: Map<string, WebSocket>, data: MessageType, ws: WebSocket) { 
    if (data.message === "") return;
    clientMap.forEach((client, userName) => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify({ type: "message", message: data.message }));
        }
    })
}