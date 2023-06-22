import { User } from '@prisma/client';

export type TokenType = 'ACCESS' | 'REFRESH';

// Payload for an authenticated user's JWT
export interface UserJwtPayload {
  sub: string;
  username: string;
}

// Authentication result after user registration or user login
export interface AuthResult {
  user: User;
  accessToken: string;
  expiresAt: Date; // Access token duration
  refreshToken: string;
}
