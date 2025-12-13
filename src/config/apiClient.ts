export const apiClient = {
    apiUrl: (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL || "http://localhost:8000",
};

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
};

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const res = await fetch(`${apiClient.apiUrl}${endpoint}`, {  // ✅ fixed URL
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || res.statusText);
    }

    return res.json();
}
