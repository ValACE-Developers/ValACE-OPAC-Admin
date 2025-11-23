import { API_BASE_URL } from "./config";

export async function loginAdmin(credentials) {
    try {
        const { identifier, password } = credentials || {};

        if (!(identifier && password)) {
            throw new Error("Invalid credentials");
        }

        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ identifier, password }),
        });

        const responseData = await res.json();

        if (!res.ok) {
            throw new Error(responseData.message || "Login failed");
        }

        return responseData;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export async function logoutAdmin() {
    try {
        const token = localStorage.getItem("adminToken");

        if (token) {
            const res = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token }),
            });

            if (!res.ok) {
                console.warn(
                    "Logout request failed, but continuing with local logout"
                );
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Error logging out:", error);
        // Continue with local logout even if API call fails
        return { success: true };
    }
}

export async function verifyToken(token) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
        });

        const responseData = await res.json();

        if (!res.ok) {
            throw new Error(
                responseData.message || "Token verification failed"
            );
        }

        return responseData;
    } catch (error) {
        console.error("Error verifying token:", error);
        throw error;
    }
}

export async function getUserRoles() {
    try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(`${API_BASE_URL}/auth/roles`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const responseData = await res.json();

        if (!res.ok) {
            throw new Error(responseData.message || "Failed to fetch roles");
        }

        return responseData;
    } catch (error) {
        console.error("Error fetching user roles:", error);
        throw error;
    }
}
