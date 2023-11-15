import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { Test } from '@nestjs/testing';
import { userStub } from './stubs/user.stub';
import { FirebaseApp } from '../../Firebase/firebase.service';

jest.mock('../service/user.service');
describe('UserService', () => {
  let service: UserService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, FirebaseApp],
    }).compile();
    service = moduleRef.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getUserInfo', () => {
    it('should create user if not exist', async () => {
      jest.spyOn(service, 'getUserInfo').mockResolvedValue(userStub());
      const result = service.getUserInfo(await userStub());
      expect(result).toEqual(await userStub());
    });
  });
});
