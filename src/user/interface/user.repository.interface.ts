import { BaseInterfaceRepository } from '../../repositories/base/base.interface.repository';
import { User } from '../entities/user.entity';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<User> {}
