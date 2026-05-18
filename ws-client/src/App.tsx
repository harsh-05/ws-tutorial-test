import { useEffect, useRef, useState } from "react"


function App() {
  const [number, setNumber] = useState(0);
  const wsRef = useRef<WebSocket>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("client is connected !");
    }
    
    ws.onmessage = (e) => {
        const data = JSON.parse(e.data)
      setNumber(data.number);
    }

    return () => {
      ws.close();

    }

  }, [])

  function senddata() {
    const data = JSON.stringify({ type: "increment" });
    if(wsRef.current?.readyState === WebSocket.OPEN)
    wsRef.current?.send(data);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={()=>{ senddata()}} className="bg-blue-300 py-2 px-4 rounded-md active:bg-blue-400 active:text-white shadow-xl active:shadow-lg shadow-blue-400">{`Clicked : ${number} times` }</button>
    </div>
  )
      
}

export default App
