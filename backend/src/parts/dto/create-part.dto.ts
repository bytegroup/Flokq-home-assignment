import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0.01)
  price: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  stock: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
