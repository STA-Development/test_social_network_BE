import { BaseInterfaceRepository } from '../../repositories/base/base.interface.repository';
import { Comments } from '../entities/Comments.entity';

export interface CommentsRepositoryInterface
  extends BaseInterfaceRepository<Comments> {}
