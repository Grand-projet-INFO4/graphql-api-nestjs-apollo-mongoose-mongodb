import { SanitizedDocument } from 'src/common/types/mongo-id';
import { Region } from '../region/schema';
import { User, UserDocument } from '../user/schema';
import { ReplaceFields } from 'src/common/types/utils';
import {
  CooperativeAdmin,
  CooperativeAdminDocument,
} from '../cooperative-admin/schema';
import { UserRole } from '../user/user.constants';
import { Driver, DriverDocument } from '../driver/schema';
import { Cooperative } from '../cooperative/schema';

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

// Shape of the auth user data considering the cooperative admin account fields differences based the role
type AuthUserShape<TUser, TCooperativeAdmin, TCooperativeDriver> = TUser &
  (
    | { cooperativeRole: 'none' } // For typescript intellicense to work correctly
    | {
        cooperativeRole: UserRole.Manager;
        coopManagerAccounts: TCooperativeAdmin[];
      }
    | {
        cooperativeRole: UserRole.Regulator;
        coopRegulatorAccount: TCooperativeAdmin;
      }
    | {
        cooperativeRole: UserRole.Driver;
        coopDriverAccount: TCooperativeDriver;
      }
  );

// Auth user from the request
export type ReqAuthUser = AuthUserShape<
  UserDocument,
  CooperativeAdminDocument,
  DriverDocument
>;

// Sanitized auth user data
// The auth user data consists of the user data itself plus cooperative admins accounts data
// The authenticated user data after a get the authenticated user request
// Basically, all `_id` fields are replaced with `id`
export type SanitizedUser = SanitizedDocument<
  ReplaceFields<
    Omit<User, 'password' | 'isAdmin'>,
    {
      city?: SanitizedDocument<
        ReplaceFields<
          City,
          {
            region: SanitizedDocument<Region>;
          }
        >
      >;
    }
  >
>;
export type SanitizedAuthUserCooperative = SanitizedDocument<
  Pick<Cooperative, 'coopName' | 'slug' | 'profilePhoto' | 'zone'>
>;
export type SanitizedCooperativeAdmin = SanitizedDocument<
  ReplaceFields<
    CooperativeAdmin,
    {
      cooperative: SanitizedAuthUserCooperative;
    }
  >
>;
export type SanitizedCooperativeDriver = SanitizedDocument<
  ReplaceFields<
    Driver,
    {
      cooperative: SanitizedAuthUserCooperative;
    }
  >
>;
export type SanitizedAuthUser = AuthUserShape<
  SanitizedUser,
  SanitizedCooperativeAdmin,
  SanitizedCooperativeDriver
>;
