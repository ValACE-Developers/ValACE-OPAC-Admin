import { API_BASE_URL, createAuthHeaders } from "./config";

export async function getLaravelLog(auth = {}) {
    try {
        const res = await fetch(`${API_BASE_URL}/logs/laravel`, {
            method: "GET",
            headers: createAuthHeaders(auth.username, auth.password),
        });
        const data = await res.text();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getSuccessInfoLog(auth = {}) {
    try {
        const res = await fetch(`${API_BASE_URL}/logs/info`, {
            method: "GET",
            headers: createAuthHeaders(auth.username, auth.password),
        });
        const data = await res.text();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getErrorsLog(auth = {}) {
    try {
        const res = await fetch(`${API_BASE_URL}/logs/error`, {
            method: "GET",
            headers: createAuthHeaders(auth.username, auth.password),
        });
        const data = await res.text();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Clear log methods
export async function clearLaravelLog(auth = {}) {
    try {
        const res = await fetch(`${API_BASE_URL}/logs/laravel/clear`, {
            method: "POST",
            headers: createAuthHeaders(auth.username, auth.password),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function clearInfoLog(auth = {}) {
    try {
        const res = await fetch(`${API_BASE_URL}/logs/info/clear`, {
            method: "POST",
            headers: createAuthHeaders(auth.username, auth.password),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function clearErrorLog(auth = {}) {
    try {
        const res = await fetch(`${API_BASE_URL}/logs/error/clear`, {
            method: "POST",
            headers: createAuthHeaders(auth.username, auth.password),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function clearAllLogs(auth = {}) {
    try {
        const res = await fetch(`${API_BASE_URL}/logs/all/clear`, {
            method: "POST",
            headers: createAuthHeaders(auth.username, auth.password),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}