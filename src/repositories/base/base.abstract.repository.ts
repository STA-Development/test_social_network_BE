import { BaseInterfaceRepository } from './base.interface.repository';
import {
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';

export abstract class BaseAbstractRepository<T>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }
  save(data: T | any): Promise<T> {
    return this.entity.save(data);
  }
  create(data: T | any): T[] {
    return this.entity.create(data);
  }
  findOneById(id: number): Promise<T> {
    return this.entity.findOne(id as FindOneOptions<T>);
  }
  findByCondition(filterCondition: FindOptionsWhere<T>): Promise<T> {
    return this.entity.findOne({ where: filterCondition });
  }
  findWithRelations(relations: any): Promise<T[]> {
    return this.entity.find(relations);
  }
  findAll(): Promise<T[]> {
    return this.entity.find();
  }
  update(
    condition: FindOptionsWhere<T>,
    updateCriteria: any,
  ): Promise<UpdateResult> {
    return this.entity.update(condition, updateCriteria);
  }
  remove(id: string): Promise<DeleteResult> {
    return this.entity.delete(id);
  }
  removeByCondition(condition: FindOptionsWhere<T>): Promise<DeleteResult> {
    return this.entity.delete(condition);
  }
  exist(option: any): Promise<boolean> {
    return this.entity.exist(option);
  }
  count(condition: FindOptionsWhere<T>): Promise<number> {
    return this.entity.count({ where: condition });
  }
  countAll(): Promise<number> {
    return this.entity.count();
  }
}
