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

export class CreateUserWeightDto {
  @ApiProperty({ example: 75.5, description: 'Weight in kilograms' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(20)
  @Max(500)
  @Type(() => Number)
  weight: number;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Date of measurement (YYYY-MM-DD)',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Morning, before breakfast' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}
