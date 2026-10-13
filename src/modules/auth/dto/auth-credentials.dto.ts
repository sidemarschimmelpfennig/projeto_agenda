import { IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

export class AuthCredentialsDto {
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Palavra-passe é obrigatória' })
  @MinLength(6, { message: 'A palavra-passe deve ter pelo menos 6 caracteres' })
  password: string;
}
