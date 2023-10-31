import {
  CallHandler,
  ExecutionContext,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  Injectable,
  MaxFileSizeValidator,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UploadFileValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;
    const maxFileSizeValidator = new MaxFileSizeValidator({
      maxSize: 10000000,
    });
    if (!maxFileSizeValidator.isValid(file)) {
      throw new HttpException('File is too large', HttpStatus.BAD_REQUEST);
    }
    const fileTypeValidator = new FileTypeValidator({
      fileType: '.(png|jpeg|jpg)',
    });
    if (file && !fileTypeValidator.isValid(file)) {
      throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST);
    }
    return next.handle();
  }
}
