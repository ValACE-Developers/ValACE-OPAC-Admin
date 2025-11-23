import { API_BASE_URL, createAuthHeaders } from "./config";

export async function getActiveApiResources(params = {}, auth = {}) {
    // Convert parameters to proper format for the API
    const apiParams = {};

    if (params.type) {
        apiParams.type = params.type; // Backend accepts API/REDIRECT
    }

    if (params.status) {
        apiParams.status = params.status; // Backend accepts ACTIVE/INACTIVE
    }

    if (params.per_page) {
        apiParams.per_page = params.per_page;
    }

    if (params.page) {
        apiParams.page = params.page;
    }

    const queryString = new URLSearchParams(apiParams).toString();
    const url = queryString
        ? `${API_BASE_URL}/resources?${queryString}`
        : `${API_BASE_URL}/resources`;

    const res = await fetch(url, {
        method: "GET",
        headers: createAuthHeaders(auth.username, auth.password),
    });

    const responseData = await res.json();

    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }

    return responseData;
}

export async function getResourceById(id, auth = {}) {
    const url = `${API_BASE_URL}/resources/${id}`;
    const res = await fetch(url, {
        method: "GET",
        headers: createAuthHeaders(auth.username, auth.password),
    });
    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}

export async function createResource(payload, auth = {}) {
    const url = `${API_BASE_URL}/resources`;

    const isFormData = payload instanceof FormData;

    const headers = createAuthHeaders(auth.username, auth.password);
    if (isFormData) {
        // Let the browser set multipart/form-data with boundary
        delete headers["Content-Type"];
    } else {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
        method: "POST",
        headers,
        body: isFormData ? payload : JSON.stringify(payload),
    });

    const responseText = await res.text();
    let responseData;
    try {
        responseData = JSON.parse(responseText);
    } catch {
        responseData = { raw: responseText };
    }

    if (!res.ok) {
        throw new Error(
            responseData?.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}

export async function updateResource(id, payload, auth = {}) {
    const url = `${API_BASE_URL}/resources/${id}`;
    
    const isFormData = payload instanceof FormData;
    
    const headers = createAuthHeaders(auth.username, auth.password);
    if (isFormData) {
        // Let the browser set multipart/form-data with boundary
        delete headers["Content-Type"];
    } else {
        headers["Content-Type"] = "application/json";
    }
    
    const res = await fetch(url, {
        method: "PUT",
        headers,
        body: isFormData ? payload : JSON.stringify(payload),
    });
    
    const responseText = await res.text();
    let responseData;
    try {
        responseData = JSON.parse(responseText);
    } catch {
        responseData = { raw: responseText };
    }
    
    if (!res.ok) {
        throw new Error(
            responseData?.message || `HTTP error! status: ${res.status} - ${res.statusText}`
        );
    }
    return responseData;
}

export async function deleteResource(id, auth = {}) {
    const url = `${API_BASE_URL}/resources/${id}`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: createAuthHeaders(auth.username, auth.password),
    });
    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}

export async function deleteMultipleResources(ids = [], auth = {}) {
    const url = `${API_BASE_URL}/resources/multiple`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            ...createAuthHeaders(auth.username, auth.password),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
    });
    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}

export async function softDeleteResource(id, auth = {}) {
    const url = `${API_BASE_URL}/resources/${id}/soft`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: createAuthHeaders(auth.username, auth.password),
    });
    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}

export async function restoreResource(id, auth = {}) {
    const url = `${API_BASE_URL}/resources/${id}/restore`;
    const res = await fetch(url, {
        method: "POST",
        headers: createAuthHeaders(auth.username, auth.password),
    });
    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}

export async function forceDeleteResource(id, auth = {}) {
    const url = `${API_BASE_URL}/resources/${id}/force`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: createAuthHeaders(auth.username, auth.password),
    });
    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}

export async function updateResourceStatus(id, status, auth = {}) {
    const url = `${API_BASE_URL}/resources/${id}/status`;
    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            ...createAuthHeaders(auth.username, auth.password),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });
    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}

export async function updateApiConfig(id, payload, auth = {}) {
    const url = `${API_BASE_URL}/resources/${id}/api-config`;
    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            ...createAuthHeaders(auth.username, auth.password),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}

export async function updateEndpoints(id, payload, auth = {}) {
    const url = `${API_BASE_URL}/resources/${id}/endpoints`;
    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            ...createAuthHeaders(auth.username, auth.password),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}

export async function updateRedirect(id, payload, auth = {}) {
    const url = `${API_BASE_URL}/resources/${id}/redirect`;
    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            ...createAuthHeaders(auth.username, auth.password),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }
    return responseData;
}