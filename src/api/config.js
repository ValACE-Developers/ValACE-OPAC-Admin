const apiVersion = "v1";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const apiPort = "8000";

// Ensure API_BASE_URL has proper protocol
const normalizedBaseUrl = apiBaseUrl?.startsWith('http') 
  ? apiBaseUrl 
  : `http://${apiBaseUrl}`;

export const API_BASE_URL = `${normalizedBaseUrl}:${apiPort}/api/${apiVersion}`;
const username = import.meta.env.VITE_USERNAME;
const password = import.meta.env.VITE_PASSWORD;

export function createAuthHeaders() {
  const credentials = btoa(`${username}:${password}`);
  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}
