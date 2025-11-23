import { API_BASE_URL, createAuthHeaders } from "./config";

/**
 * Sync all endpoints under a specific API resource
 * @param {number} resourceId - API resource ID
 * @param {Object} auth - Authentication credentials
 * @returns {Promise<Object>} Sync operation result
 */
export async function syncResource(resourceId, auth = {}) {
    const res = await fetch(`${API_BASE_URL}/sync/resources/${resourceId}`, {
        method: "POST",
        headers: {
            ...createAuthHeaders(auth.username, auth.password),
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! status: ${res.status}`);
    return data;
}

/**
 * Sync a single API endpoint
 * @param {number} endpointId - API endpoint ID
 * @param {Object} auth - Authentication credentials
 * @returns {Promise<Object>} Sync operation result
 */
export async function syncEndpoint(endpointId, auth = {}) {
    const res = await fetch(`${API_BASE_URL}/sync/endpoints/${endpointId}`, {
        method: "POST",
        headers: {
            ...createAuthHeaders(auth.username, auth.password),
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! status: ${res.status}`);
    return data;
}

/**
 * Get sync status for a specific endpoint
 * @param {number} endpointId - API endpoint ID
 * @param {Object} auth - Authentication credentials
 * @returns {Promise<Object>} Endpoint status information
 */
export async function getEndpointStatus(endpointId, auth = {}) {
    const res = await fetch(`${API_BASE_URL}/sync/endpoints/${endpointId}/status`, {
        method: "GET",
        headers: createAuthHeaders(auth.username, auth.password),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! status: ${res.status}`);
    return data;
}

/**
 * Get sync status for all endpoints under a resource
 * @param {number} resourceId - API resource ID
 * @param {Object} auth - Authentication credentials
 * @returns {Promise<Object>} Resource status information
 */
export async function getResourceStatus(resourceId, auth = {}) {
    const res = await fetch(`${API_BASE_URL}/sync/resources/${resourceId}/status`, {
        method: "GET",
        headers: createAuthHeaders(auth.username, auth.password),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! status: ${res.status}`);
    return data;
}