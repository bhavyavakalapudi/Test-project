export interface AuthToken {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export const AUTH_TOKEN_KEY = "auth_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
