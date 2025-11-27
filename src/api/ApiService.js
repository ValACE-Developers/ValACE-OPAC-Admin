import * as ExternalBookDataService from "./ExternalBookDataService";
import * as AuthService from "./AuthService";
import * as ResourceService from "./ResourceService";
import * as LogService from "./LogService";
import * as DashboardService from "./DashboardService";
import { ReportService } from "./ReportService";
// External Resource Management service
import { API_BASE_URL, createAuthHeaders } from "./config";

export const ExternalResourceService = {
    fetchAllChunked: async (debug = false, auth = {}) => {
        const res = await fetch(
            `${API_BASE_URL}/external-resources/fetch-all`,
            {
                method: "POST",
                headers: {
                    ...createAuthHeaders(auth.username, auth.password),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ debug }),
            }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    },
    fetchSpecific: async (api_resource_id, debug = false, auth = {}) => {
        const res = await fetch(
            `${API_BASE_URL}/external-resources/fetch-specific`,
            {
                method: "POST",
                headers: {
                    ...createAuthHeaders(auth.username, auth.password),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ api_resource_id, debug }),
            }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    },
    fetchSync: async (api_resource_id, debug = false, auth = {}) => {
        const res = await fetch(
            `${API_BASE_URL}/external-resources/fetch-sync`,
            {
                method: "POST",
                headers: {
                    ...createAuthHeaders(auth.username, auth.password),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ api_resource_id, debug }),
            }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    },
};

export const TestService = {
    ping: async (auth = {}) => {
        const res = await fetch(`${API_BASE_URL}/test/sync-books`, {
            method: "GET",
            headers: createAuthHeaders(auth.username, auth.password),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    },
};

export const ApiService = {
    ExternalBookDataService,
    AuthService,
    ResourceService,
    ExternalResourceService,
    DashboardService,
    TestService,
    LogService,
    ReportService,
};

export default ApiService;
