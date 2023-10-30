import {
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from '../dto/user.dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../decorators/user.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { UploadFileValidationInterceptor } from '../../intercepters/UploadFileValidation.interceptor';

@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('Verify')
  create(@User() user: UserDto): Promise<UserDto> {
    return this.userService.getUserInfo(user);
  }
  @Patch('changeAvatar')
  @UseInterceptors(FileInterceptor('file'), UploadFileValidationInterceptor)
  changeAvatar(
    @UploadedFile()
    file: Express.Multer.File,
    @User()
    user: UserDto,
  ) {
    return this.userService.changeUserAvatar(file, user.uId, user.picture);
  }
}
