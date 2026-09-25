import {IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, MaxLength } from 'class-validator';

export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @IsOptional()
    description!: string;

    @IsNumber()
    @IsNotEmpty()
    capacity!: number;

    @IsNumber()
    @IsNotEmpty()
    price_per_night!: number;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    image_url!: string;

    @IsBoolean()
    @IsOptional()
    is_active!: boolean;
}
