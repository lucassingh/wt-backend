import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBmiDto {
  @ApiProperty({ example: '2024-01-15', description: 'Date of measurement (YYYY-MM-DD)' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 175.0, description: 'Height in centimeters' })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(50)
  @Max(300)
  @Type(() => Number)
  heightCm: number;

  @ApiProperty({ example: 75.5, description: 'Weight in kilograms' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(20)
  @Max(500)
  @Type(() => Number)
  weightKg: number;

  @ApiPropertyOptional({ example: 'Post-vacation check' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}
