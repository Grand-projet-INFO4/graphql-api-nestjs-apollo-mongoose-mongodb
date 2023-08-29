import { Types } from 'mongoose';
import {
  AbilityBuilder,
  InferSubjects,
  createMongoAbility,
} from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { ReqAuthUser } from '../auth/auth';
import { AppAbility, PolicyDefinition, UserAction } from '../auth/auth.policy';
import { Driver, DriverDocument } from './schema';
import { UserRole } from '../user/user.constants';

export type DriverSubject = InferSubjects<typeof Driver | DriverPolicyFilters>;

export type DriverAbilityEntity = DriverDocument | DriverPolicyFilters;

export type DriverPolicyFilters = {
  kind: 'DRIVER_FILTERS';
  cooperativeId?: Types.ObjectId | string;
};

@Injectable()
export class DriverPolicy extends PolicyDefinition<
  DriverSubject,
  DriverAbilityEntity
> {
  createAbilityForUser(authUser: ReqAuthUser) {
    const { build, can, cannot } = new AbilityBuilder<
      AppAbility<DriverSubject, DriverAbilityEntity>
    >(createMongoAbility);

    if (authUser.isAdmin()) can(UserAction.Read, Driver);

    if (authUser.cooperativeRole !== 'none') {
      can<DriverPolicyFilters>(UserAction.Read, Driver);

      switch (authUser.cooperativeRole) {
        case UserRole.Manager: {
          const managedCooperativesIds = authUser.coopManagerAccounts.map(
            (account) => account.cooperative._id.toString(),
          );
          can<DriverPolicyFilters>(UserAction.Read, 'DRIVER_FILTERS', {
            cooperativeId: { $in: managedCooperativesIds },
          });
          cannot(UserAction.Read, Driver, {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            'cooperative._id': { $nin: managedCooperativesIds },
          });
          can(UserAction.Create, Driver);
          can([UserAction.Update, UserAction.Delete], Driver, {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            'cooperative._id': {
              $in: managedCooperativesIds,
            },
          });
          cannot([UserAction.Update, UserAction.Delete], Driver, {
            user: null,
          });
          break;
        }

        case UserRole.Regulator:
        case UserRole.Driver: {
          const coopAccountKey =
            authUser.cooperativeRole === UserRole.Regulator
              ? 'coopRegulatorAccount'
              : 'coopDriverAccount';
          const accountCooperativeId =
            authUser[coopAccountKey].cooperative._id.toString();
          cannot<DriverPolicyFilters>(UserAction.Read, 'DRIVER_FILTERS', {
            cooperativeId: { $not: accountCooperativeId },
          });
          cannot(UserAction.Read, Driver, {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            'cooperative._id': {
              $nin: accountCooperativeId,
            },
          });
          if (authUser.cooperativeRole === UserRole.Driver) {
            const accountId = authUser.coopDriverAccount._id.toString();
            can<DriverDocument>(UserAction.Update, Driver, {
              _id: accountId,
            });
            can<DriverDocument>(UserAction.Delete, Driver, {
              _id: accountId,
              cooperative: null,
            });
          }
          break;
        }
      }
    }

    return build({
      detectSubjectType: (subject) => {
        return '_id' in subject ? Driver : 'DRIVER_FILTERS';
      },
    });
  }

  validateAbility(
    ability: AppAbility<DriverSubject, DriverAbilityEntity>,
    action: UserAction,
    subject: DriverAbilityEntity,
  ): boolean {
    if (ability.can(action, subject)) return true;
    let errorMessage: string;
    switch (action) {
      case UserAction.Read: {
        if ('kind' in subject && 'cooperativeId' in subject) {
          errorMessage = subject?.cooperativeId
            ? 'You are not allowed to access drivers from outside your cooperatives'
            : 'You do not have persmissions to access all drivers. Please provide a cooperative id filter parameter.';
        } else {
          errorMessage =
            subject && '_id' in subject
              ? 'You are not allowed to access this driver'
              : 'You do not have permissions to access drivers';
        }
        break;
      }
      case UserAction.Create:
        errorMessage = 'You are not allowed to create a driver account';
        break;
      case UserAction.Update:
        errorMessage = "You are not allowed to update this driver's data";
        break;
      case UserAction.Delete:
        errorMessage = 'You are not allowed to update this driver account';
        break;
    }
    throw new ForbiddenException(errorMessage);
  }
}
