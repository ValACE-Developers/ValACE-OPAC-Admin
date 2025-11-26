export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const username = import.meta.env.VITE_USERNAME;
const password = import.meta.env.VITE_PASSWORD;

export function createAuthHeaders(authUsername, authPassword) {
  const u = authUsername || username;
  const p = authPassword || password;
                                                                                                          
  const credentials = btoa(`${u}:${p}`);
  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}