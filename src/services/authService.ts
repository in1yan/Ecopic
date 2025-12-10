import { API_BASE_URL } from '@/config/api';

const API_URL = API_BASE_URL;

export interface User {
    id: number;
    fullName: string;
    email: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        user: User;
    };
}

class AuthService {
    private readonly TOKEN_KEY = 'ecopick_auth_token';
    private readonly USER_KEY = 'ecopick_user';

    // Register new user
    async register(fullName: string, email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
        try {
            if (password !== confirmPassword) {
                return {
                    success: false,
                    message: 'Passwords do not match'
                };
            }

            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                this.setToken(data.data.token);
                this.setUser(data.data.user);
            }

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Network error. Please check if the server is running.'
            };
        }
    }

    // Login user
    async login(email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                this.setToken(data.data.token);
                this.setUser(data.data.user);
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Network error. Please check if the server is running.'
            };
        }
    }

    // Verify token
    async verifyToken(): Promise<boolean> {
        try {
            const token = this.getToken();
            if (!token) return false;

            const response = await fetch(`${API_URL}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                this.setUser(data.data.user);
                return true;
            }

            // Token invalid, clear storage
            this.logout();
            return false;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    }

    // Logout user
    async logout(): Promise<void> {
        try {
            const token = this.getToken();
            if (token) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearStorage();
        }
    }

    // Token management
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // User management
    setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    getUser(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    // Clear all auth data
    clearStorage(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export const authService = new AuthService();
