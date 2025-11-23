import { API_BASE_URL, createAuthHeaders } from "./config";

export async function getStats() {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        method: "GET",
        headers: createAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
}

export async function getVisitorsCount(params) {
    const queryParams = new URLSearchParams(params);
    const res = await fetch(`${API_BASE_URL}/dashboard/visitors-count?${queryParams}`, {
        method: "GET",
        headers: createAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
}

export async function getUsageOverTime(params) {
    const queryParams = new URLSearchParams(params);
    const res = await fetch(`${API_BASE_URL}/dashboard/usage-over-time?${queryParams}`, {
        method: "GET",
        headers: createAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    console.log('data', data);
    return data;
}

export async function getPerCategoryUsage(params) {
    const queryParams = new URLSearchParams(params);
    const res = await fetch(`${API_BASE_URL}/dashboard/per-category-usage?${queryParams}`, {
        method: "GET",
        headers: createAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    console.log('data', data);
    return data;
}

export async function getPerLocationUsage(params) {
    const queryParams = new URLSearchParams(params);
    const res = await fetch(`${API_BASE_URL}/dashboard/per-location-usage?${queryParams}`, {
        method: "GET",
        headers: createAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    console.log('data', data);
    return data;
}