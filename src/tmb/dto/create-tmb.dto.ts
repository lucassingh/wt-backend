import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateTmbDto {
  @ApiProperty({ example: '2024-01-15', description: 'Date of measurement (YYYY-MM-DD)' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: ['M', 'F'], example: 'M', description: 'Biological gender' })
  @IsIn(['M', 'F'])
  gender: 'M' | 'F';

  @ApiProperty({ example: 30, description: 'Age in years' })
  @IsInt()
  @Min(10)
  @Max(120)
  @Type(() => Number)
  age: number;

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

  @ApiProperty({
    example: 1.55,
    description: 'Activity coefficient — 1.2 | 1.375 | 1.55 | 1.725 | 1.9',
  })
  @IsIn([1.2, 1.375, 1.55, 1.725, 1.9])
  @Type(() => Number)
  activityCoefficient: number;

  @ApiProperty({ enum: ['loss', 'maintain', 'gain'], example: 'loss', description: 'Caloric goal' })
  @IsIn(['loss', 'maintain', 'gain'])
  goal: 'loss' | 'maintain' | 'gain';

  @ApiPropertyOptional({
    enum: ['normal', 'moderate', 'aggressive'],
    example: 'normal',
    description: 'Required when goal is loss or gain',
  })
  @ValidateIf((o) => o.goal !== 'maintain')
  @IsIn(['normal', 'moderate', 'aggressive'])
  goalAggressiveness?: 'normal' | 'moderate' | 'aggressive';

  @ApiPropertyOptional({ example: 'Post-vacation baseline' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}
