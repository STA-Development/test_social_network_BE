import { UserDto } from '../../dto/user.dto/user.dto';

export const userStub = async (): Promise<UserDto> => {
  return {
    name: 'Alexandr',
    email: 'underAlexandr@gmail.com',
    picture:
      'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png',
    uId: 'Lbjfa761r4N2LZtuNbthcm4lu2c2',
  };
};
export const userAvatarStub = async (): Promise<{
  uId: string;
  picture: string;
}> => {
  return {
    uId: 'Lbjfa761r4N2LZtuNbthcm4lu2c2',
    picture:
      'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png',
  };
};
