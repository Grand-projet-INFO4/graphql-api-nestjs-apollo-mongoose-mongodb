
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface User {
    __typename?: 'User';
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    photo?: Nullable<string>;
    email: string;
    phone: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface IQuery {
    __typename?: 'IQuery';
    users(): User[] | Promise<User[]>;
}

export type Void = any;
export type DateTime = any;
type Nullable<T> = T | null;
