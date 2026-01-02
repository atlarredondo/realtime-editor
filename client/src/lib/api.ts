// Redirects to login if the request was not successfully made
export const api = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
    });

    if (response.status === 401) {
        window.location.href = '/login'; // Redirect on session expiry
    }

    return response;
};