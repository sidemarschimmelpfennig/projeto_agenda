import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateContactDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    userId: number;
}
