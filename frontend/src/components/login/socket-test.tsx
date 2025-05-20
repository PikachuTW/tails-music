import { getIo } from "../../utils/api";
import { useEffect, useState } from "react";

export default function SocketTest() {
  const [status, setStatus] = useState<string>("Disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  
  useEffect(() => {
    const socket = getIo();
    
    socket.on("connect", () => {
      setStatus("Connected");
      setMessages(prev => [...prev, `Connected with ID: ${socket.id}`]);
    });

    socket.on("disconnect", () => {
      setStatus("Disconnected");
      setMessages(prev => [...prev, "Disconnected"]);
    });

    socket.on("connect_error", (error) => {
      setStatus(`Error: ${error.message}`);
      setMessages(prev => [...prev, `Connection error: ${error.message}`]);
      console.error("Connection error:", error);
    });

    // 接收來自服務器的消息
    socket.on("message", (data) => {
      setMessages(prev => [...prev, `Received: ${JSON.stringify(data)}`]);
    });

    socket.on('error', (error) => {
      setStatus(`Error: ${error.message}`);
      setMessages(prev => [...prev, `Connection error: ${error.message}`]);
      console.error("Connection error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    const socket = getIo();
    socket.emit("message", { text: "Hello from client", time: new Date().toISOString() });
    setMessages(prev => [...prev, "Sent: Hello from client"]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Socket.IO Test</h2>
      <div className="mb-4">
        Status: <span className={status === "Connected" ? "text-green-500" : "text-red-500"}>{status}</span>
      </div>
      <button 
        onClick={sendMessage} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        Send Test Message
      </button>
      <div className="w-full max-w-md border rounded p-4 bg-gray-100">
        <h3 className="font-bold mb-2">Message Log:</h3>
        <div className="h-64 overflow-y-auto text-sm">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            <ul className="space-y-1">
              {messages.map((msg, index) => (
                <li key={index} className="border-b pb-1">{msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 