import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { EmbeddedCityDocument } from '../schema';

@Resolver('EmbeddedCity')
export class EmbeddedCityResolver {
  @ResolveField('id')
  getId(@Parent() city: EmbeddedCityDocument) {
    return city._id.toString();
  }
}
