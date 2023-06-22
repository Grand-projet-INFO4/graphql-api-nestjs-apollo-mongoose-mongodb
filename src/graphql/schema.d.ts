
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface SignupInput {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    passwordConfirmation: string;
}

export interface IQuery {
    __typename?: 'IQuery';
    me(): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface IMutation {
    __typename?: 'IMutation';
    signup(payload: SignupInput): AuthResult | Promise<AuthResult>;
    signin(email: string, password: string): AuthResult | Promise<AuthResult>;
    refreshToken(): AccessToken | Promise<AccessToken>;
    signout(): Nullable<Void> | Promise<Nullable<Void>>;
    unregister(): Nullable<Void> | Promise<Nullable<Void>>;
}

export interface AuthResult {
    __typename?: 'AuthResult';
    user: User;
    accessToken: string;
    expiresAt: DateTime;
    refreshToken: string;
}

export interface AccessToken {
    __typename?: 'AccessToken';
    accessToken: string;
    expiresAt: DateTime;
}

export interface User {
    __typename?: 'User';
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    photo?: Nullable<string>;
    email: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export type Void = any;
export type DateTime = any;
type Nullable<T> = T | null;
