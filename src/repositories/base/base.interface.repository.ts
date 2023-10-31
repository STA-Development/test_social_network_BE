import { DeleteResult, FindOptionsWhere, UpdateResult } from 'typeorm';

export interface BaseInterfaceRepository<T> {
  save(data: T | any): Promise<T>;
  create(data: T | any): T[];
  findOneById(id: number): Promise<T>;
  findByCondition(filterCondition: FindOptionsWhere<T>): Promise<T>;
  findWithRelations(relations: any): Promise<T[]>;
  findAll(): Promise<T[]>;
  update(
    condition: FindOptionsWhere<T>,
    updateCriteria: T | any,
  ): Promise<UpdateResult>;
  remove(id: string): Promise<DeleteResult>;
  removeByCondition(condition: FindOptionsWhere<T>): Promise<DeleteResult>;
  exist(id: string | number): Promise<boolean>;
  count(condition: FindOptionsWhere<T>): Promise<number>;
  countAll(): Promise<number>;
}
