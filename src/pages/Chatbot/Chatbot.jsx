import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../common/api";
import { TASK_ROUTE_MAP } from "../../common/taskRoutes";
import "./Chatbot.css";
import { useChecklist } from "../../context/ChecklistContext";

const Chatbot = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I’ll help you complete your onboarding." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { setChecklist } = useChecklist();

  /**
   * Pick next actionable task:
   * 1. submissionDateTime === null
   * 2. HIGH priority first
   * 3. Oldest askDateTime first
   */
  const pickNextTask = (tasks) => {
    return tasks
      .filter(t => !t.submissionDateTime)
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority === "HIGH" ? -1 : 1;
        }
        return new Date(a.askDateTime) - new Date(b.askDateTime);
      })[0];
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");

    setMessages(prev => [...prev, { from: "user", text: userMessage }]);
    setLoading(true);

    try {
      /**
       * Backend generates checklist (idempotent)
       */
      const res = await api.post("/employee/checklist/generate", {
        message: userMessage
      });

      const tasks = res.data;
      setChecklist(tasks);

      if (!Array.isArray(tasks) || tasks.length === 0) {
        setMessages(prev => [
          ...prev,
          { from: "bot", text: "I couldn’t find any tasks for you right now." }
        ]);
        return;
      }

      const nextTask = pickNextTask(tasks);

      if (!nextTask) {
        setMessages(prev => [
          ...prev,
          { from: "bot", text: "🎉 You’ve completed all onboarding tasks!" }
        ]);
        return;
      }

      setMessages(prev => [
        ...prev,
        {
          from: "bot",
          text: `Your next task is:\n\n"${nextTask.task}"`,
          actions: [
            {
              label: "Do now",
              action: "GO",
              route: TASK_ROUTE_MAP[nextTask.type],
              taskId: nextTask.taskId
            },
            {
              label: "Do later",
              action: "LATER",
              taskId: nextTask.taskId
            }
          ]
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          from: "bot",
          text: "❌ Something went wrong while fetching your checklist."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (action.action === "GO") {
      navigate(action.route, {
        state: { taskId: action.taskId }
      });
    }

    if (action.action === "LATER") {
      await api.post(`/employee/checklist/${action.taskId}/defer`);

      setMessages(prev => [
        ...prev,
        { from: "bot", text: "👍 No problem. We’ll come back to it later." }
      ]);
    }
  };

  return (
    <div className="chatbot-page">
      <h2>Onboarding Assistant</h2>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.from}`}>
              <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>

              {m.actions && (
                <div className="chat-actions">
                  {m.actions.map((a, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(a)}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask what to do next…"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
