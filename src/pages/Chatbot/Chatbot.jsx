import "./Chatbot.css";

const Chatbot = () => {
  const messages = [
    { from: "bot", text: "Welcome! I will generate your onboarding checklist." },
    { from: "user", text: "I am a frontend developer" },
    { from: "bot", text: "Checklist generated successfully." }
  ];

  return (
    <div className="chatbot">
      <h2>Onboarding Assistant</h2>

      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>

      <input placeholder="Type a message..." />
    </div>
  );
};

export default Chatbot;
