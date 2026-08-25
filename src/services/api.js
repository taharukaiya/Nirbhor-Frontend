const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(
  /\/$/,
  "",
);

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json", ...options.headers },
    ...options,
  });
  if (!response.ok)
    throw new Error(`Request failed with status ${response.status}`);
  return response.json();
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
