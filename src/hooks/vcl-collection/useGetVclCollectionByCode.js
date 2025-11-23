import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, createAuthHeaders } from "../../api/config";

async function fetchVclCollectionByCode({ filters }) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/collection/filter-collection?${query}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...createAuthHeaders(),
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
}

export const useGetVclCollectionByCode = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: ["vclResourceCollection", filters],
        queryFn: async () => {
            const data = await fetchVclCollectionByCode({ filters });
            return data;
        },
        ...options,
    });
};
