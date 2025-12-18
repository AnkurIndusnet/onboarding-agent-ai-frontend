import { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Welcome! I will generate your onboarding checklist." },
    { from: "user", text: "I am a frontend developer" },
    { from: "bot", text: "Checklist generated successfully." }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [
      ...prev,
      { from: "user", text: input }
    ]);

    setInput("");

    // fake bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Got it! Updating your checklist." }
      ]);
    }, 800);
  };

  return (
    <div className="chatbot-page">
      <h2>Onboarding Assistant</h2>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.from}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
