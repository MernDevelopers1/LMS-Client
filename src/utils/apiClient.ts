// API client utility for the frontend to interact with the backend

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type APIRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

class APIClient {
  private buildHeaders(options: APIRequestOptions): Record<string, string> {
    return {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
  }

  async request(
    endpoint: string,
    options: APIRequestOptions = {},
  ): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.buildHeaders(options);

    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || "API request failed");
      (error as any).status = response.status;
      throw error;
    }

    return data;
  }

  // Authentication
  login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  logout() {
    return this.request("/auth/logout", { method: "POST" });
  }

  getCurrentUser() {
    return this.request("/auth/me");
  }
}

export default new APIClient();
