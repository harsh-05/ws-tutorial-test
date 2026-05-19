import { WebSocketServer } from "ws";
import {z} from 'zod'

const messageSchema = z.object({
    type: z.literal("message"),
    message: z.string(),
})

const joinSchema = z.object({
    type: z.literal("join"),
    userName: z.string()
})

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
    ws.send("Web ")  
})