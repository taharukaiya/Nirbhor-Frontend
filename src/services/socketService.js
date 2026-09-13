import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "";

let socket = null;

export function initSocket() {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Join a chat room for a job/proposal, chatId, or direct user
 */
export function joinChat(jobId, proposalId, targetUserId, chatId) {
  const s = getSocket();
  if (!s) return Promise.reject(new Error("Socket not initialized"));

  return new Promise((resolve, reject) => {
    s.emit("chat:join", { jobId, proposalId, targetUserId, chatId }, (response) => {
      if (response && response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response || {});
      }
    });
  });
}

/**
 * Send a chat message
 */
export function sendMessage(chatId, body) {
  const s = getSocket();
  if (!s) return Promise.reject(new Error("Socket not initialized"));

  return new Promise((resolve, reject) => {
    s.emit("chat:message", { chatId, body }, (response) => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response.message);
      }
    });
  });
}

/**
 * Emit typing indicator
 */
export function emitTyping(chatId, isTyping) {
  const s = getSocket();
  if (!s) return;
  s.emit("chat:typing", { chatId, isTyping });
}

/**
 * Mark chat as read
 */
export function markChatRead(chatId) {
  const s = getSocket();
  if (!s) return Promise.reject(new Error("Socket not initialized"));

  return new Promise((resolve, reject) => {
    s.emit("chat:read", { chatId }, (response) => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Listen for new messages
 */
export function onNewMessage(callback) {
  const s = getSocket();
  if (!s) return () => {};

  s.on("chat:message", callback);
  return () => s.off("chat:message", callback);
}

/**
 * Listen for typing indicators
 */
export function onTyping(callback) {
  const s = getSocket();
  if (!s) return () => {};

  s.on("chat:typing", callback);
  return () => s.off("chat:typing", callback);
}

/**
 * Listen for read receipts
 */
export function onRead(callback) {
  const s = getSocket();
  if (!s) return () => {};

  s.on("chat:read", callback);
  return () => s.off("chat:read", callback);
}

/**
 * Listen for new notifications
 */
export function onNewNotification(callback) {
  const s = getSocket();
  if (!s) return () => {};

  s.on("notification:new", callback);
  return () => s.off("notification:new", callback);
}
