import { API_BASE_URL, createAuthHeaders } from "./config";

export async function getExternalBookData(params = {}, auth = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString
        ? `${API_BASE_URL}/books/data?${queryString}`
        : `${API_BASE_URL}/books/data`;

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

export async function searchBooks(params = {}, auth = {}) {
    // Map frontend parameters to backend search parameters
    const searchParams = {};

    // Map search criteria
    if (params.keyword) {
        // Determine which field to search based on filterType
        const filterType = params.filter_type || "NONE";
        switch (filterType) {
            case "SEARCH_BY_TITLE":
                searchParams.title = params.keyword;
                break;
            case "SEARCH_BY_AUTHOR":
                searchParams.authors = params.keyword;
                break;
            case "SEARCH_BY_SUBJECT":
                searchParams.subject = params.keyword;
                break;
            case "SEARCH_BY_ISBN":
                searchParams.isbn = params.keyword;
                break;
            case "SEARCH_BY_ISSN":
                searchParams.issn = params.keyword;
                break;
            default:
                // Use full-text search when no specific field filter is selected
                searchParams.keyword = params.keyword;
                break;
        }
    }

    // Map pagination
    if (params.page) searchParams.page = params.page;
    if (params.per_page) searchParams.per_page = params.per_page;

    // Map debug parameter
    if (params.debug) searchParams.debug = params.debug;

    // Map API resource ID filter
    if (params.api_resource_id) {
        searchParams.api_resource_id = params.api_resource_id;
    }

    const queryString = new URLSearchParams(searchParams).toString();
    console.log("query string", queryString);
    const url = queryString
        ? `${API_BASE_URL}/books/search?${queryString}`
        : `${API_BASE_URL}/books/search`;

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

    console.log("responseData of searchBooks", responseData);
    return responseData;
}

export async function fetchBooksForFeaturedSelection(params = {}, auth = {}) {
    // Map frontend parameters to backend parameters
    const searchParams = {};

    // Map pagination
    if (params.page) searchParams.page = params.page;
    if (params.per_page) searchParams.per_page = params.per_page;

    // Map debug parameter
    if (params.debug) searchParams.debug = params.debug;

    // Map API resource ID filter
    if (params.api_resource_id) {
        searchParams.api_resource_id = params.api_resource_id;
    }

    if (params.search) {
        searchParams.search = params.search;
    }

    const queryString = new URLSearchParams(searchParams).toString();
    console.log("Featured selection query string:", queryString);
    const url = queryString
        ? `${API_BASE_URL}/books/featured/selection?${queryString}`
        : `${API_BASE_URL}/books/featured/selection`;

    const res = await fetch(url, {
        method: "GET",
        headers: createAuthHeaders(auth.username, auth.password),
    });

    const responseData = await res.json();
    console.log("Selection", responseData);

    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }

    return responseData;
}

export async function getCuratedFeaturedBooks(params = {}, auth = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString
        ? `${API_BASE_URL}/books/featured/curated?${queryString}`
        : `${API_BASE_URL}/books/featured/curated`;

    const res = await fetch(url, {
        method: "GET",
        headers: createAuthHeaders(auth.username, auth.password),
    });

    const responseData = await res.json();
    console.log("Featured books response:", responseData);

    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }

    return responseData;
}

export async function storeCuratedFeaturedBooks(
    featuredBooksData,
    params = {},
    auth = {}
) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString
        ? `${API_BASE_URL}/books/featured/store?${queryString}`
        : `${API_BASE_URL}/books/featured/store`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            ...createAuthHeaders(auth.username, auth.password),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(featuredBooksData),
    });

    const responseData = await res.json();

    if (!res.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${res.status}`
        );
    }

    return responseData;
}

export async function deleteFeaturedBook(id, auth = {}) {
    const url = `${API_BASE_URL}/books/featured/delete/${id}`;

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
