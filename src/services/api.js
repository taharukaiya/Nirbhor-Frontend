const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(
  /\/$/,
  "",
);

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json", ...options.headers },
    credentials: "include",
    ...options,
  });
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = await response.json();
      message =
        payload.error?.message ||
        payload.error ||
        payload.details?.[0]?.msg ||
        message;
    } catch {
      // Keep the HTTP status when the server does not return JSON.
    }
    throw new Error(message);
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

export async function getJobs(signal) {
  return listFromResponse(await request("/jobs", { signal }), "jobs");
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

export async function googleOAuth(idToken, defaultRole = "HIRER") {
  return request("/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, defaultRole }),
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

export async function createJob(payload) {
  return request("/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getChat(jobId, proposalId) {
  return request(`/chats/${jobId}/${proposalId}`);
}

export async function logout() {
  return request("/auth/logout", { method: "POST" });
}
