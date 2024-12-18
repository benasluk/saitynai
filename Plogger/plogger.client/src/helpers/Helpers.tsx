export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const accessToken = localStorage.getItem("authToken");

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken??"none"}`,
    };
    options.credentials = "include"

    try {
        const response = await fetch(url, options);
        if (response.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${newToken}`,
                };
                return fetch(url, options);
            } else {
                localStorage.removeItem("authToken");
                window.location.href = "/login";
            }
        }

        return response;
    } catch (error) {
        console.error("API request failed:", error);
        throw error;
    }
};

export const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const response = await fetch("https://localhost:7076/api/accessToken", {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            const newToken = data.accessToken;

            localStorage.setItem("authToken", newToken);

            return newToken;
        } else {
            console.error("Failed to refresh token:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error during token refresh:", error);
        return null;
    }
};