import { userAvatarStub, userStub } from '../test/stubs/user.stub';
export const UserService = jest.fn().mockReturnValue({
  //* mockResolvedValue -is used to return promise value
  getUserInfo: jest.fn().mockResolvedValue(userStub()),
  changeUserAvatar: jest.fn().mockResolvedValue(userAvatarStub()),
});
