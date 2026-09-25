/**
 * @file ChatPage.jsx
 * @description Real-time messaging interface for negotiations between Hirers and Service Providers.
 *
 * Architectural Intent:
 * - WebSocket Integration: Connects to Socket.io backend to receive real-time messages, read receipts, and typing indicators.
 * - State Synchronization: Merges HTTP-fetched initial chat history with live WebSocket events, ensuring zero duplicate messages.
 * - Complex UI Layout: Implements a responsive dual-pane layout (sidebar for conversation list, main pane for active thread).
 * - Component Delegation: Extracts repetitive or complex UI blocks (`ReportModal`, `MessageBubble`) to keep the main component readable.
 * - Safety & Moderation: Integrates in-app reporting of specific messages directly to the admin queue.
 */
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { useToast } from "../contexts/ToastContext.jsx";
import {
  getConversations,
  getChat,
  getChatByRoom,
  reportMessage,
} from "../services/api.js";
import {
  initSocket,
  joinChat,
  sendMessage,
  onNewMessage,
  markChatRead,
  emitTyping,
  onTyping,
  onRead,
} from "../services/socketService.js";
import {
  Search,
  Send,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  Check,
  CheckCheck,
  Flag,
  MoreVertical,
  X,
} from "../components/ui/Icons.jsx";
import { Mic, Square } from "lucide-react";

import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

/* ── Helpers ──────────────────────────────────────────────── */

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const REPORT_REASONS = [
  { value: "harassment", label: "Harassment or abuse" },
  { value: "inappropriate_language", label: "Inappropriate language" },
  { value: "attempted_circumvention", label: "Attempted contact circumvention" },
  { value: "scam", label: "Scam or fraud" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Other" },
];

/* ── ReadReceipt indicator ────────────────────────────────── */

function ReadReceipt({ isMe, readAt }) {
  if (!isMe) return null;
  if (readAt) {
    return <CheckCheck className="h-3 w-3 text-blue-200" />;
  }
  return <Check className="h-3 w-3 text-blue-200/60" />;
}

/* ── ReportModal ──────────────────────────────────────────── */

function ReportModal({ chatId, message, onClose }) {
  const { showSuccess, showError } = useToast();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!reason) return;
    setSubmitting(true);
    try {
      await reportMessage(chatId, message._id, reason);
      showSuccess("Report submitted. Our team will review it.");
      onClose();
    } catch (err) {
      showError(err.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-red-500" />
            <h2 className="text-base font-bold text-[#011F50]">Report Message</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-3">
          <p className="mb-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 italic line-clamp-3">
            "{message.body}"
          </p>

          <form onSubmit={handleSubmit}>
            <p className="mb-2 text-sm font-semibold text-slate-700">Why are you reporting this?</p>
            <div className="space-y-2">
              {REPORT_REASONS.map((r) => (
                <label key={r.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input
                    type="radio"
                    name="report-reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="h-4 w-4 accent-[#0066FF]"
                  />
                  <span className="text-sm text-slate-700">{r.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reason || submitting}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {submitting ? "Reporting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── MessageBubble ────────────────────────────────────────── */

function formatChatTimestamp(dateString) {
  const date = new Date(dateString || Date.now());
  const now = new Date();
  const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return timeString;
  }

  const dateStringFormatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${dateStringFormatted}, ${timeString}`;
}

function MessageBubble({ msg, isMe, activeChatId, onReport }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className={`group flex items-end gap-1.5 ${isMe ? "justify-end" : "justify-start"}`}>
      {/* Report button — only for peer messages */}
      {!isMe && (
        <div className="relative shrink-0 opacity-0 transition group-hover:opacity-100" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            aria-label="Message options"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>

          {menuOpen && (
            <div className="absolute bottom-full left-0 mb-1 min-w-[130px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onReport(msg);
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Flag className="h-3.5 w-3.5" />
                Report message
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-2.5 shadow-sm ${
          isMe
            ? "bg-[#0084FF] text-white rounded-[20px] rounded-br-[4px]"
            : "bg-[#E4E6EB] text-black rounded-[20px] rounded-bl-[4px]"
        }`}
      >
        <p className="text-[15px] leading-snug whitespace-pre-wrap">{msg.body}</p>
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
            isMe ? "text-blue-100/90" : "text-slate-500"
          }`}
        >
          <span>{formatChatTimestamp(msg.createdAt)}</span>
          <ReadReceipt isMe={isMe} readAt={msg.readAt} />
        </div>
      </div>
    </div>
  );
}

/* ── ChatPage ─────────────────────────────────────────────── */

function ChatPage() {
  useDocumentTitle("Chat");
  const { jobId, proposalId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const chatIdFromQuery = searchParams.get("chatId");

  const { currentUser } = useAuth();
  const { showError } = useToast();

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Profile quick-view


  // Report modal state
  const [reportingMessage, setReportingMessage] = useState(null);

  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);



  // Initialize socket on mount
  useEffect(() => {
    initSocket();
  }, []);

  // Fetch conversations list
  const loadConversationsList = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const res = await getConversations();
      const list = res.conversations || [];
      setConversations(list);

      if (chatIdFromQuery) {
        setActiveChatId(chatIdFromQuery);
      } else if (jobId && proposalId) {
        const found = list.find(
          (c) => c.jobId === jobId && c.proposalId === proposalId,
        );
        if (found) setActiveChatId(found.id || found.chatId);
      } else if (list.length > 0 && !activeChatId) {
        setActiveChatId(list[0].id || list[0].chatId);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      showError("Unable to load chat conversations.");
    } finally {
      setLoadingConversations(false);
    }
  }, [chatIdFromQuery, jobId, proposalId]); // eslint-disable-line

  useEffect(() => {
    loadConversationsList();
  }, [loadConversationsList]);

  // Load active chat room & join socket
  useEffect(() => {
    if (!activeChatId) {
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    const currentConv = conversations.find(
      (c) => (c.id || c.chatId) === activeChatId,
    );
    if (currentConv) {
      setActiveConversation(currentConv);
    }

    setLoadingMessages(true);

    const fetchChatData = async () => {
      try {
        let chatData;
        if (currentConv?.jobId && currentConv?.proposalId) {
          chatData = await getChat(currentConv.jobId, currentConv.proposalId);
        } else {
          chatData = await getChatByRoom(activeChatId);
        }

        const msgs = chatData?.messages || chatData?.data?.messages || [];
        setMessages(msgs);

        // Join socket room
        await joinChat(
          currentConv?.jobId,
          currentConv?.proposalId,
          currentConv?.participant?.id,
          activeChatId,
        );

        // Mark as read (HTTP + socket)
        markChatRead(activeChatId).catch(() => {});

        // Clear unread badge in sidebar
        setConversations((prev) =>
          prev.map((conv) =>
            (conv.id || conv.chatId) === activeChatId
              ? { ...conv, unreadCount: 0 }
              : conv,
          ),
        );
      } catch (err) {
        console.error("Error loading chat messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchChatData();
  }, [activeChatId, conversations.length]); // eslint-disable-line

  // Listen for socket events
  useEffect(() => {
    const unsubMessage = onNewMessage((msg) => {
      const msgChatId = msg.chatId || msg.chat;

      // Only append message if it belongs to the currently active chat
      if (msgChatId === activeChatId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m._id && m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        markChatRead(activeChatId);
      }

      // Update conversations lastMessage in list
      setConversations((prev) =>
        prev.map((conv) => {
          if ((conv.id || conv.chatId) === msgChatId) {
            return {
              ...conv,
              lastMessage: {
                body: msg.body,
                senderId: msg.sender?._id || msg.sender,
                createdAt: msg.createdAt,
              },
              updatedAt: msg.createdAt,
              unreadCount: msgChatId === activeChatId ? 0 : (conv.unreadCount || 0) + 1,
            };
          }
          return conv;
        }).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      );
    });

    const unsubTyping = onTyping(({ userId, isTyping }) => {
      if (userId !== currentUser?.id) {
        setIsPeerTyping(isTyping);
        if (isTyping) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsPeerTyping(false), 4000);
        }
      }
    });

    // Read receipts — when peer reads our messages, update readAt
    const unsubRead = onRead(({ chatId, readAt }) => {
      if (chatId === activeChatId) {
        setMessages((prev) =>
          prev.map((m) => {
            const msgSenderId = String(
              (m.sender && typeof m.sender === "object" ? m.sender._id : m.sender) ?? ""
            );
            if (msgSenderId === String(currentUser?.id ?? "") && !m.readAt) {
              return { ...m, readAt };
            }
            return m;
          }),
        );
      }
    });

    return () => {
      unsubMessage();
      unsubTyping();
      unsubRead();
    };
  }, [activeChatId, currentUser]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isPeerTyping]);

  const handleSelectConversation = (conv) => {
    const id = conv.id || conv.chatId;
    setActiveChatId(id);
    setSearchParams({ chatId: id });
    setMobileShowChat(true);
    setIsPeerTyping(false);
  };

  const handleTypingInput = (e) => {
    setMessageText(e.target.value);
    if (!activeChatId) return;

    emitTyping(activeChatId, true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(activeChatId, false);
    }, 1200);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChatId || sending) return;

    const text = messageText.trim();
    setMessageText("");
    setSending(true);
    emitTyping(activeChatId, false);

    try {
      await sendMessage(activeChatId, text);
    } catch (err) {
      showError(err.message || "Failed to send message");
      setMessageText(text); // restore on error
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.participant?.name?.toLowerCase().includes(q) ||
        c.jobTitle?.toLowerCase().includes(q) ||
        c.participant?.category?.toLowerCase().includes(q),
    );
  }, [conversations, searchQuery]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 pb-6 px-4 md:px-6 relative overflow-hidden flex flex-col">
      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute left-0 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[30rem] w-[30rem] translate-x-1/3 translate-y-1/3 rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-7xl overflow-hidden rounded-3xl border border-white/50 bg-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl relative z-10">
      {/* ── Sidebar / Conversations List ── */}
      <aside
        className={`flex w-full flex-col border-r border-slate-100/50 bg-white/40 md:w-80 lg:w-96 ${
          mobileShowChat ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Sidebar Header */}
        <div className="border-b border-slate-100 p-4">
          <h1 className="text-xl font-bold text-[#011F50]">Messages</h1>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loadingConversations ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-medium">No conversations found</p>
              <p className="text-xs text-slate-400 mt-1">
                Start a chat from a service provider profile or job proposal.
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const id = conv.id || conv.chatId;
              const isActive = id === activeChatId;
              const p = conv.participant || {};

              return (
                <div
                  key={id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`flex cursor-pointer items-start gap-3 p-4 transition ${
                    isActive
                      ? "bg-primary/5 border-l-4 border-l-[#0066FF]"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {/* Avatar */}
                  <Link
                    to={`/user/${p.id || p._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 group"
                  >
                    {p.avatar ? (
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-[#0066FF] transition-all"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#011F50] group-hover:bg-[#0066FF] transition-all text-sm font-bold text-white shadow-sm">
                        {p.initials || getInitials(p.name)}
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-sm font-bold text-[#011F50]">
                        {p.name}
                      </h3>
                      {conv.updatedAt && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    <p className="truncate text-xs font-semibold text-primary">
                      {conv.jobTitle}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {conv.lastMessage?.body || "Started a conversation"}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Main Chat Thread Window ── */}
      <main
        className={`flex flex-1 flex-col bg-slate-100 ${
          mobileShowChat ? "flex" : "hidden md:flex"
        }`}
      >
        {activeConversation ? (
          <>
            {/* Top Bar Header */}
            <div className="flex z-10 items-center justify-between border-b border-slate-100/50 bg-white/40 px-6 py-3 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileShowChat(false)}
                  className="mr-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 md:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                {/* Clickable avatar/name — opens participant profile */}
                <Link
                  to={`/user/${activeConversation.participant?.id}`}
                  className="flex items-center gap-3 rounded-xl p-1 -ml-1 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-label={`View ${activeConversation.participant?.name || "participant"}'s profile`}
                >
                  {activeConversation.participant?.avatar ? (
                    <img
                      src={activeConversation.participant.avatar}
                      alt={activeConversation.participant.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#011F50] text-xs font-bold text-white">
                      {activeConversation.participant?.initials ||
                        getInitials(activeConversation.participant?.name)}
                    </div>
                  )}

                  <div className="text-left">
                    <h2 className="text-base font-bold text-[#011F50] group-hover:text-[#0066FF] transition-colors">
                      {activeConversation.participant?.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {activeConversation.jobTitle}
                    </p>
                  </div>
                </Link>
              </div>

              {/* NID Verified badge on header */}
              {activeConversation.participant?.nidVerified && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  <CheckCircle className="h-3 w-3" /> NID Verified
                </span>
              )}
            </div>

            {/* Messages Thread Window */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-3 scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 space-y-1"
            >
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Loading chat history...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                  <MessageSquare className="h-12 w-12 text-slate-300 mb-2" />
                  <p className="text-sm font-medium">No messages in this chat yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Send a message below to start chatting!
                  </p>
                </div>
              ) : (
                (() => {
                  let lastDate = null;
                  return messages.map((msg, idx) => {
                    if (!msg) return null;
                    
                    const senderId = String(
                      (msg.sender && typeof msg.sender === "object"
                        ? msg.sender._id
                        : msg.sender) ?? ""
                    );
                    const isMe = senderId === String(currentUser?.id ?? "");
                    
                    const msgDate = new Date(msg.createdAt).toLocaleDateString();
                    const showDateDivider = msgDate !== lastDate;
                    lastDate = msgDate;

                    return (
                      <div key={msg._id || idx} className="space-y-4">
                        {showDateDivider && (
                          <div className="flex justify-center my-4">
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                              {msgDate === new Date().toLocaleDateString() ? "Today" : msgDate}
                            </span>
                          </div>
                        )}
                        <MessageBubble
                          msg={msg}
                          isMe={isMe}
                          activeChatId={activeChatId}
                          onReport={setReportingMessage}
                        />
                      </div>
                    );
                  });
                })()
              )}

              {/* Typing indicator */}
              {isPeerTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm animate-pulse">
                    {activeConversation.participant?.name || "User"} is typing…
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="z-10 border-t border-slate-200/60 bg-white/80 p-4 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={handleTypingInput}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                  disabled={sending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-3 sm:px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,102,255,0.25)] transition-all duration-300 hover:bg-[#0052cc] hover:shadow-[0_12px_24px_rgba(0,102,255,0.35)] hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="h-16 w-16 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-[#011F50]">Your Conversations</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Select a conversation from the sidebar or start a new chat with a
              service provider or hirer.
            </p>
          </div>
        )}
      </main>


      {/* Report Message Modal */}
      {reportingMessage && (
        <ReportModal
          chatId={activeChatId}
          message={reportingMessage}
          onClose={() => setReportingMessage(null)}
        />
      )}
      </div>
    </div>
  );
}

export default ChatPage;
