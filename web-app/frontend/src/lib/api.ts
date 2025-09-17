const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
  email: string;
  subscriptions: string[];
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface SubscriptionOption {
  id: string;
  name: string;
  description: string;
}

export interface SubscriptionsResponse {
  success: boolean;
  subscriptions: string[];
}

export interface OptionsResponse {
  success: boolean;
  options: SubscriptionOption[];
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async signIn(email: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    // Store token in localStorage
    this.token = response.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token);
    }

    return response;
  }

  async verifyToken(): Promise<{ success: boolean; user: User }> {
    const response = await this.request<{ success: boolean; user: User }>('/auth/verify');
    return response;
  }

  // Subscription methods
  async getSubscriptions(): Promise<string[]> {
    const response = await this.request<SubscriptionsResponse>('/subscriptions');
    return response.subscriptions;
  }

  async updateSubscriptions(subscriptions: string[]): Promise<string[]> {
    const response = await this.request<SubscriptionsResponse>('/subscriptions', {
      method: 'PUT',
      body: JSON.stringify({ subscriptions }),
    });
    return response.subscriptions;
  }

  async getSubscriptionOptions(): Promise<SubscriptionOption[]> {
    const response = await this.request<OptionsResponse>('/subscriptions/options');
    return response.options;
  }

  // Utility methods
  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();
