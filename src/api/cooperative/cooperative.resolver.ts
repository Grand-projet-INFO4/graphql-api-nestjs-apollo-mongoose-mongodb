import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CooperativeService } from './cooperative.service';
import { CooperativeDocument } from './schema';

@Resolver('Cooperative')
export class CooperativeResolver {
  constructor(private cooperativeService: CooperativeService) {}

  @Query('cooperative')
  async getCooperative(@Args('identifier') identifier: string) {
    return this.cooperativeService.getOne(identifier);
  }

  @ResolveField('id')
  getId(@Parent() cooperative: CooperativeDocument) {
    return cooperative?.id ?? cooperative._id.toString();
  }

  /**
   * The profile photo should resolve to the full URL path of the cooperative's profile photo
   */
  @ResolveField('profilePhoto')
  getProfilePhoto(@Parent() cooperative: CooperativeDocument): string | null {
    return cooperative.profilePhoto
      ? this.cooperativeService.getCooperativePhotoURL(cooperative.profilePhoto)
      : null;
  }

  /**
   * The transparent photo should resolve to the full URL path of the cooperative's transparent photo
   */
  @ResolveField('transparentLogo')
  getTransparentLogo(
    @Parent() cooperative: CooperativeDocument,
  ): string | null {
    return cooperative.transparentLogo
      ? this.cooperativeService.getCooperativePhotoURL(
          cooperative.transparentLogo,
        )
      : null;
  }

  /**
   * The cover photo should resolve to the full URL path of the cooperative's cover photo
   */
  @ResolveField('coverPhoto')
  getCoverPhoto(@Parent() cooperative: CooperativeDocument): string | null {
    return cooperative.coverPhoto
      ? this.cooperativeService.getCooperativePhotoURL(cooperative.coverPhoto)
      : null;
  }
}
