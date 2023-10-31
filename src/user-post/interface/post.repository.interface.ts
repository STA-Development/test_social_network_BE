import { BaseInterfaceRepository } from '../../repositories/base/base.interface.repository';
import { Posts } from '../entities/Post.entity';

export interface PostRepositoryInterface
  extends BaseInterfaceRepository<Posts> {}
