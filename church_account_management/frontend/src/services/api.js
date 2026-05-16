const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const buildUrl = (endpoint, query = {}) => {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .forEach(([key, value]) => url.searchParams.set(key, value));

  return url.toString();
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const request = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body,
    headers = {},
    query,
    signal,
    credentials = "include"
  } = options;

  const url = buildUrl(endpoint, query);
  const startedAt = performance.now();
  const config = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers
    },
    credentials,
    signal
  };

  if (body !== undefined && body !== null) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);

    if (body instanceof FormData) {
      delete config.headers["Content-Type"];
    }
  }

  console.info("[api:request]", method, url, body ?? "");

  try {
    const response = await fetch(url, config);
    const data = await parseResponse(response);
    const duration = Math.round(performance.now() - startedAt);

    console.info("[api:response]", method, url, response.status, `${duration}ms`);

    if (!response.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error("[api:error]", method, url, error);
    throw error;
  }
};

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: "DELETE" })
};

export { API_BASE_URL };
