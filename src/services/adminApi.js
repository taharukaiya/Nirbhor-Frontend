const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const API_BASE = `${API_BASE_URL}/admin`;

async function requestAdmin(endpoint, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (typeof data.error === "string" ? data.error : data.error?.message) ||
      data.message ||
      "An administrative request error occurred";
    const error = new Error(message);
    error.status = response.status;
    error.code = (typeof data.error === "object" && data.error?.code) || "ADMIN_API_ERROR";
    throw error;
  }

  return data;
}

export async function adminLogin(email, password) {
  return requestAdmin("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function adminLogout() {
  return requestAdmin("/auth/logout", {
    method: "POST",
  });
}

export async function getAdminSession() {
  return requestAdmin("/auth/session", {
    method: "GET",
  });
}

export async function getAdminMetrics() {
  return requestAdmin("/metrics", {
    method: "GET",
  });
}

export async function getAdminUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return requestAdmin(`/users${query ? `?${query}` : ""}`, {
    method: "GET",
  });
}

export async function suspendUser(userId) {
  return requestAdmin(`/users/${userId}/suspend`, {
    method: "PATCH",
  });
}

export async function getVerifications(status = "pending") {
  return requestAdmin(`/verifications?status=${status}`, {
    method: "GET",
  });
}

export async function reviewNid(userId, approved, reason = "") {
  return requestAdmin(`/verifications/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ approved, reason }),
  });
}

export async function getDisputes() {
  return requestAdmin("/disputes", {
    method: "GET",
  });
}

export async function getDisputeDetails(disputeId) {
  return requestAdmin(`/disputes/${disputeId}`, {
    method: "GET",
  });
}

export async function resolveDispute(disputeId, decision, resolutionText) {
  return requestAdmin(`/disputes/${disputeId}/resolve`, {
    method: "POST",
    body: JSON.stringify({ decision, resolutionText }),
  });
}

export async function getCategories() {
  return requestAdmin("/categories", {
    method: "GET",
  });
}

export async function createCategory(name, slug) {
  return requestAdmin("/categories", {
    method: "POST",
    body: JSON.stringify({ name, slug }),
  });
}

export async function deleteCategory(id) {
  return requestAdmin(`/categories/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminManagers() {
  return requestAdmin("/managers", {
    method: "GET",
  });
}

export async function createAdminManager(name, email, password, role = "ADMIN", permissions = {}) {
  return requestAdmin("/managers", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role, permissions }),
  });
}

export async function updateAdminPermissions(adminId, permissions) {
  return requestAdmin(`/managers/${adminId}/permissions`, {
    method: "PATCH",
    body: JSON.stringify({ permissions }),
  });
}

export async function revokeAdminManager(adminId) {
  return requestAdmin(`/managers/${adminId}`, {
    method: "DELETE",
  });
}

export async function getAuditLogs(page = 1, limit = 50) {
  return requestAdmin(`/audit-logs?page=${page}&limit=${limit}`, {
    method: "GET",
  });
}
