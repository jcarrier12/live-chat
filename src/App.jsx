import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message:receive', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('message:receive');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = { user: 'Guest', content: input, timestamp: new Date().toISOString() };
    socket.emit('message:send', newMsg);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-900 text-white p-4">
      <div className="flex flex-col w-full max-w-xl h-[500px] border border-gray-600 rounded-xl overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto bg-black">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <span className="font-bold text-green-400">{msg.user}</span>
              <span className="ml-2 text-gray-300">{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="flex p-2 bg-gray-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 bg-gray-700 rounded-l-md outline-none"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-green-500 px-4 rounded-r-md hover:bg-green-600">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
