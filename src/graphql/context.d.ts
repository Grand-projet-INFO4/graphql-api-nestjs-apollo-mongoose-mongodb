import { DataloaderService } from 'src/dataloader/dataloader.service';

const getLoaders = DataloaderService.prototype.getLoaders;

/**
 * The application's GraphQL context type
 */
export interface AppGqlContext {
  // The request object (Automatically injected by NestJS)
  req: Request;

  // The dataloaders
  loaders: ReturnType<typeof getLoaders>;
}
