import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { getChat } from "../services/api.js";
import {
  initSocket,
  joinChat,
  sendMessage,
  onNewMessage,
  markChatRead,
  emitTyping,
} from "../services/socketService.js";

function ChatPage() {
  const { jobId, proposalId } = useParams();
  const { currentUser } = useAuth();
  const { showError } = useToast();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket and load chat
  useEffect(() => {
    const socket = initSocket();
    setLoading(true);

    Promise.all([getChat(jobId, proposalId), joinChat(jobId, proposalId)])
      .then(([chatData, joinData]) => {
        setChat(joinData.chatId ? { id: joinData.chatId } : null);
        if (chatData?.messages) {
          setMessages(chatData.messages);
        }
        if (joinData.chatId) {
          markChatRead(joinData.chatId).catch(() => {});
        }
      })
      .catch((error) => {
        showError(error.message || "Failed to load chat");
      })
      .finally(() => setLoading(false));

    return () => {};
  }, [jobId, proposalId]);

  // Listen for new messages
  useEffect(() => {
    if (!chat) return;

    const unsubscribe = onNewMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsubscribe();
  }, [chat]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing
  const handleTyping = () => {
    if (!chat) return;
    emitTyping(chat.id, true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(chat.id, false);
    }, 1000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chat || sending) return;

    setSending(true);
    try {
      await sendMessage(chat.id, message);
      setMessage("");
    } catch (error) {
      showError(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0066FF]" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-700">
            Chat not available
          </h2>
          <p className="text-sm text-slate-500">Unable to load conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex min-h-96 items-center justify-center text-slate-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender?._id === currentUser?.id ||
                  msg.sender === currentUser?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.sender?._id === currentUser?.id ||
                    msg.sender === currentUser?.id
                      ? "bg-[#0066FF] text-white"
                      : "bg-slate-200 text-slate-900"
                  }`}
                >
                  <p className="text-sm">{msg.body}</p>
                  <p
                    className={`text-xs ${
                      msg.sender?._id === currentUser?.id ||
                      msg.sender === currentUser?.id
                        ? "text-blue-100"
                        : "text-slate-500"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t border-slate-200 bg-white p-4"
      >
        <div className="mx-auto max-w-2xl flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="rounded-lg bg-[#0066FF] px-6 py-2 font-medium text-white transition hover:bg-[#011F50] disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatPage;
