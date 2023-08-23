import { Region } from '../region/schema';
import { User, UserDocument } from '../user/schema';

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

// Auth user from the request
export type ReqAuthUser = UserDocument;

// Sanitized auth user document
// The authenticated user data after a get the authenticated user request
// Basically, all `_id` fields are replaced with `id`
export type SanitizedAuthUser = Omit<User, 'password' | '_id' | 'city'> & {
  id: string;
  city?: Omit<City, '_id' | 'region'> & {
    id: string;
    region: Omit<Region, '_id'> & { id: string };
  };
};
