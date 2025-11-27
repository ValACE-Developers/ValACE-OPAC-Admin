import { API_BASE_URL, createAuthHeaders } from "./config";

export const ReportService = {
    // GET /api/v1/reports/survey-data
    getSurveyData: async (params = {}, auth = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.location) queryParams.append('location', params.location);
        if (params.date_from) queryParams.append('date_from', params.date_from);
        if (params.date_to) queryParams.append('date_to', params.date_to);
        if (params.page) queryParams.append('page', params.page);
        if (params.per_page) queryParams.append('per_page', params.per_page);
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);

        const url = `${API_BASE_URL}/reports/survey-data${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const res = await fetch(url, {
            method: "GET",
            headers: createAuthHeaders(auth.username, auth.password),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    },

    // GET /api/v1/reports/survey-export
    exportSurveyData: async (params = {}, auth = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.format) queryParams.append('format', params.format);
        if (params.location) queryParams.append('location', params.location);
        if (params.date_from) queryParams.append('date_from', params.date_from);
        if (params.date_to) queryParams.append('date_to', params.date_to);

        const url = `${API_BASE_URL}/reports/survey-export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const res = await fetch(url, {
            method: "GET",
            headers: createAuthHeaders(auth.username, auth.password),
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `HTTP ${res.status}`);
        }
        
        return res; // Return response object for blob handling
    },

    // POST /api/v1/reports/email-survey-data
    emailSurveyData: async (params = {}, auth = {}) => {
        const res = await fetch(`${API_BASE_URL}/reports/email-survey-data`, {
            method: "POST",
            headers: {
                ...createAuthHeaders(auth.username, auth.password),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });
        
        const data = await res.json();
        console.log("EM", data);  
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    },
};