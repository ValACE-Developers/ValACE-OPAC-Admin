import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, createAuthHeaders } from "../../api/config";

async function fetchVclCollection() {
	const res = await fetch(`${API_BASE_URL}/collection/all-filtered`, {
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

export const useGetVclCollection = (filters = {}, options = {}) => {
	return useQuery({
		queryKey: ["vclResources", filters],
		queryFn: async () => {
			const data = await fetchVclCollection();
			return data;
		},
		...options,
	});
};
