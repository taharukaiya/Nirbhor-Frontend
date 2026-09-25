/**
 * Standard User API Client Layer
 * 
 * Architectural Intent:
 * The central network boundary for all standard user operations (Auth, Jobs, Proposals, Wallet).
 * 
 * Security & Reliability:
 * - Intercepts global 401 Unauthorized errors and transparently invokes `/auth/refresh` 
 *   to rotate tokens in the background, minimizing jarring session drops.
 * - Includes a generic 503 retry wrapper with exponential backoff for cold starts.
 */
const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(
  /\/$/,
  "",
);

// Retry a request on 503 (Service Unavailable) — occurs during backend startup
// before MongoDB has finished connecting. Retries up to 3 times with backoff.
async function requestWithRetry(path, options = {}, retryCount = 0) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  // Retry on 503 (backend starting up / DB not ready)
  if (response.status === 503 && retryCount < 3) {
    const delay = (retryCount + 1) * 1500;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return requestWithRetry(path, options, retryCount + 1);
  }

  return response;
}

async function request(path, options = {}, isRetry = false) {
  const response = await requestWithRetry(path, options);

  if (!response.ok) {
    if (
      response.status === 401 &&
      !isRetry &&
      !path.startsWith("/auth/login") &&
      !path.startsWith("/auth/register") &&
      !path.startsWith("/auth/refresh")
    ) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          return request(path, options, true);
        }
      } catch {
        // Refresh failed, proceed to handle original 401 error
      }
    }

    let message = `Request failed with status ${response.status}`;
    let payload = null;
    try {
      payload = await response.json();
      message =
        payload.error?.message ||
        payload.error ||
        payload.details?.[0]?.msg ||
        message;
    } catch {
      // Keep the HTTP status when the server does not return JSON.
    }
    const error = new Error(message);
    error.status = response.status;
    error.code = payload?.error?.code || payload?.code || null;
    throw error;
  }
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

function listFromResponse(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export async function getServices(signal) {
  return listFromResponse(await request("/services", { signal }), "services");
}

export async function getCategories(signal) {
  return listFromResponse(
    await request("/categories", { signal }),
    "categories",
  );
}

export async function getJobs(signal) {
  return listFromResponse(await request("/jobs", { signal }), "jobs");
}

export async function getAdminJobs(signal) {
  const data = await request("/admin/jobs", { signal });
  return data?.data?.jobs || [];
}

export async function forgotPassword(email) {
  return request("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token, password) {
  return request(`/auth/reset-password/${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
}

export async function forgotPasswordAdmin(email) {
  return request("/admin/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordAdmin(token, password) {
  return request(`/admin/auth/reset-password/${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
}

export async function verifyEmail(token) {
  return request(`/auth/verify-email/${encodeURIComponent(token)}`);
}

export async function submitNid(nidNumber, dateOfBirth) {
  return request("/auth/nid", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nidNumber, dateOfBirth }),
  });
}

export async function getSession(signal) {
  return request("/auth/session", { signal });
}

export async function login(credentials) {
  return request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export async function register(credentials) {
  return request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export async function updateProfile(payload) {
  return request("/auth/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function switchMode(mode) {
  return request("/auth/mode", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode }),
  });
}

export async function uploadAvatar(avatarData) {
  return request("/auth/avatar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ avatar: avatarData }),
  });
}

export async function getServiceProvider(id) {
  return request(`/services/${id}`);
}

export async function applyToJob(jobId, payload) {
  return request(`/jobs/${jobId}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
}

export async function getMyApplications(signal) {
  return request("/jobs/my-applications", { signal });
}

export async function getProviderProposals(signal) {
  return request("/provider/proposals", { signal });
}

export async function createJob(payload) {
  return request("/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getHirerJobs(signal) {
  const payload = await request("/hirer/jobs", { signal });
  return listFromResponse(payload, "jobs");
}

export async function getJobApplicants(jobId, signal) {
  return request(`/hirer/jobs/${encodeURIComponent(jobId)}/applicants`, {
    signal,
  });
}

export async function getConversations() {
  return request("/chats/conversations");
}

export async function initiateChat(payload) {
  return request("/chats/initiate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
}

export async function getChat(jobId, proposalId) {
  return request(`/chats/${jobId}/${proposalId}`);
}

export async function getChatByRoom(chatId) {
  return request(`/chats/room/${chatId}`);
}

export async function logout() {
  return request("/auth/logout", { method: "POST" });
}

export async function changePassword(currentPassword, newPassword) {
  return request("/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function getPublicUser(userId) {
  return request(`/auth/users/${encodeURIComponent(userId)}/public`);
}

export async function deleteJob(jobId) {
  return request(`/jobs/${encodeURIComponent(jobId)}`, { method: "DELETE" });
}

export async function reportMessage(chatId, messageId, reason) {
  return request(
    `/chats/room/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}/report`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    },
  );
}

export async function acceptJobProposal(jobId, proposalId) {
  return request(`/proposals/${encodeURIComponent(proposalId)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "accepted" }),
  });
}

export async function rejectJobProposal(jobId, proposalId) {
  return request(`/proposals/${encodeURIComponent(proposalId)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "rejected" }),
  });
}


export async function initiateJobPayment(jobId) {
  return request(`/payments/${encodeURIComponent(jobId)}/initiate`, {
    method: "POST",
  });
}

export async function submitReview(jobId, payload) {
  return request(`/reviews/jobs/${encodeURIComponent(jobId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateReview(jobId, payload) {
  return request(`/reviews/jobs/${encodeURIComponent(jobId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getJobReviews(jobId, signal) {
  return request(`/reviews/jobs/${encodeURIComponent(jobId)}`, { signal });
}


export async function getNotifications(signal) {
  return request("/notifications", { signal });
}

export async function markNotificationAsRead(id) {
  return request(`/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
  });
}

export async function processWalletPayment(jobId) {
  return request(`/payments/${encodeURIComponent(jobId)}/wallet-pay`, {
    method: "POST",
  });
}

export async function releaseJobPayment(jobId) {
  return request(`/payments/${encodeURIComponent(jobId)}/release`, {
    method: "POST",
  });
}

export async function reportDispute(payload) {
  return request("/disputes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getWalletData(signal) {
  return request("/wallet", { signal });
}

export async function requestWithdrawal(amount, method, accountDetails) {
  return request("/wallet/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, method, accountDetails }),
  });
}

export async function initiateWalletDeposit(amount) {
  return request("/wallet/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
}


export async function getUserReviews(userId, signal) {
  return request(`/reviews/users/${encodeURIComponent(userId)}`, { signal });
}

export async function getTransactions(filterType, signal) {
  const params = filterType !== "ALL" ? new URLSearchParams({ type: filterType }).toString() : "";
  return request(`/transactions/my-transactions${params ? `?${params}` : ""}`, { signal });
}

export async function getAdminTransactions(filterType, signal) {
  const params = filterType !== "ALL" ? new URLSearchParams({ type: filterType }).toString() : "";
  return request(`/transactions/admin/all${params ? `?${params}` : ""}`, { signal });
}

export async function getAdminAnalytics(signal) {
  return request(`/transactions/admin/analytics`, { signal });
}
