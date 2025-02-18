import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';


export class UpdatePasswordDto {

  @ApiProperty({ example: 'newSecurePassword123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
