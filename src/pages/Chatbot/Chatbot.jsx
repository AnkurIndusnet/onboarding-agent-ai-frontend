import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../common/api";
import { useChecklist } from "../../context/ChecklistContext";
import "./Chatbot.css";

const CHAT_STATE = {
  LOADING: "LOADING",
  SHOW_CHECKLIST: "SHOW_CHECKLIST",
  NEED_INPUT: "NEED_INPUT",
  ERROR: "ERROR"
};

const Chatbot = () => {
  const navigate = useNavigate();
  const { checklist, setChecklist } = useChecklist();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatState, setChatState] = useState(CHAT_STATE.LOADING);
  const [showErrorModal, setShowErrorModal] = useState(false);

  /* --------------------------------------------------
     1. AUTO FETCH CHECKLIST ON LOAD
  -------------------------------------------------- */
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          "/employee/checklist/fetchCheckList"
        );

        const tasks = res.data || [];

        if (tasks.length > 0) {
          setChecklist(tasks);
          setChatState(CHAT_STATE.SHOW_CHECKLIST);

          setMessages([
            {
              from: "bot",
              text: "Here’s your onboarding checklist. You can proceed anytime.",
              taskList: tasks
            }
          ]);
        } else {
          setChatState(CHAT_STATE.NEED_INPUT);
          setMessages([
            {
              from: "bot",
              text:
                "I need a little information before creating your onboarding checklist.\n\nWhat is your role?"
            }
          ]);
        }
      } catch (err) {
        setChatState(CHAT_STATE.ERROR);
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [setChecklist]);

  /* --------------------------------------------------
     2. HANDLE USER INPUT (ONLY WHEN NEEDED)
  -------------------------------------------------- */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    setMessages(prev => [
      ...prev,
      { from: "user", text: userMessage }
    ]);

    try {
      const res = await api.post(
        "/employee/checklist/generate",
        { message: userMessage }
      );

      const tasks = res.data || [];

      if (tasks.length === 0) {
        setMessages(prev => [
          ...prev,
          {
            from: "bot",
            text:
              "I still need more information to generate your checklist. Please try again."
          }
        ]);
        return;
      }

      setChecklist(tasks);
      setChatState(CHAT_STATE.SHOW_CHECKLIST);

      setMessages(prev => [
        ...prev,
        {
          from: "bot",
          text: "Thanks! I’ve created your onboarding checklist.",
          taskList: tasks
        }
      ]);
    } catch (err) {
      setChatState(CHAT_STATE.ERROR);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     3. RENDER
  -------------------------------------------------- */
  return (
    <div className="chatbot-page">
      <h2>Onboarding Assistant</h2>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.from}`}>
              <div style={{ whiteSpace: "pre-line" }}>
                {m.text}
              </div>

              {/* CHECKLIST VIEW */}
              {m.taskList && (
                <div className="chat-task-list">
                  {m.taskList.map(task => {
                    const status =
                      !!task.status;

                    return (
                      <div
                        key={task.taskId}
                        className="chat-task-row"
                      >
                        <div>
                          <strong>{task.task}</strong>
                          <div className="chat-task-meta">
                            Asked on{" "}
                            {new Date(
                              task.askDateTime
                            ).toLocaleString()}
                          </div>
                        </div>

                        <span
                          className={`chat-task-status ${
                            task.status
                             
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    );
                  })}

                  <div className="chat-global-actions">
                    <button
                      className="primary"
                      onClick={() =>
                        navigate("/checklist")
                      }
                    >
                      Proceed Now
                    </button>

                    <button
                      className="secondary"
                      onClick={() =>
                        navigate("/dashboard")
                      }
                    >
                      Do Later
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* INPUT ONLY WHEN REQUIRED */}
        {chatState === CHAT_STATE.NEED_INPUT && (
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Type your role…"
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "…" : "Send"}
            </button>
          </div>
        )}
      </div>

      {/* ERROR MODAL */}
      {showErrorModal && (
        <div className="modal-backdrop modal-opening">
          <div className="modal modal-opening">
            <h3>Something went wrong</h3>

            <div className="modal-body">
              <p>
                I couldn’t fetch your onboarding checklist
                right now.
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="primary"
                onClick={() => {
                  setShowErrorModal(false);
                  setChatState(
                    CHAT_STATE.LOADING
                  );
                  window.location.reload();
                }}
              >
                Try Again
              </button>

              <button
                className="secondary"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Do Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
