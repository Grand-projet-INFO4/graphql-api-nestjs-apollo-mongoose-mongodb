export type TokenType = 'ACCESS' | 'REFRESH';

// Payload for an authenticated user's JWT
export interface UserJwtPayload {
  sub: string;
}

// Authentication result after user registration or user login
export interface AuthResult {
  access_token: string;
  expires_at: Date; // Access token expiry date-time
  refresh_token: string;
}

// Access token data
export interface AccessToken {
  access_token: string;
  expires_at: Date; // Expiry date-time
}
