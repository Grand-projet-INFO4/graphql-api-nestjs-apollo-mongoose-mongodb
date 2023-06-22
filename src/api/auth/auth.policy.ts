import {
  AbilityTuple,
  MongoAbility,
  MongoQuery,
  Subject,
  ForbiddenError,
} from '@casl/ability';
import { AnyObject } from '@casl/ability/dist/types/types';
import { ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';

// Enum of all the general actions that users can perform
export enum UserAction {
  Manage = 'manage', // Manage = Can do all CRUD operations
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// CASL ability type for any generic API resource ability
export type AppAbility<TSubject = Subject, TFields = AnyObject> = MongoAbility<
  AbilityTuple<UserAction, TSubject>,
  MongoQuery<TFields>
>;

// Type of an exception data thrown by a Policy validation
export interface ExceptionOptions {
  message?: string;
  description?: string;
}

// Abstract class that defines the handling of an API resource's policy
export abstract class PolicyDefinition<TEntity = unknown, TSubject = Subject> {
  /**
   * Creates the CASL ability instance for the policy
   *
   * @param user The user whom the policy is applied to
   * @return The CASL ability instance
   */
  abstract createAbilityForUser(user: User): AppAbility<TSubject, TEntity>;

  /**
   * Validates an action based on the CASL ability instance
   *
   * @param ability The CASL ability of the policy
   * @param action The type of the user action
   * @param subject In case the validation requires the resource's instance, then this is the subject
   * @return The validation result: If false or an exception option, then the validation failed
   */
  abstract validateAbility(
    ability: AppAbility<TSubject, TEntity>,
    action: UserAction,
    subject?: TEntity,
  ): void | boolean | ExceptionOptions;

  /**
   * Authorizes the user action after the creation and validation of the user's CASL ability
   *
   * If the user action is not authorized, then it will throw an exception
   *
   * @param user The user whom the policy is applied to
   * @param action The type of the user action
   * @param subject In case the validation requires the resource's instance, then this is the subject
   */
  authorize(user: User, action: UserAction, subject?: TEntity): void {
    const ability = this.createAbilityForUser(user);
    let isSuccess: boolean;
    let exceptionOptions: ExceptionOptions | undefined;
    try {
      const result = this.validateAbility(ability, action, subject);
      if (typeof result === 'boolean') isSuccess = result;
      else if (result) exceptionOptions = result;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException({
          message: 'Unauthorized action',
          description: error.message,
        });
      } else {
        throw error;
      }
    }
    if (typeof isSuccess !== 'undefined' && !isSuccess) {
      throw new ForbiddenException('Unauthorized action');
    }
    if (exceptionOptions) {
      exceptionOptions.message ||= 'Unauthorized action';
      throw new ForbiddenException(exceptionOptions);
    }
  }
}
