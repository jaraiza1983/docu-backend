import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  target: string;

  @IsOptional()
  @IsString()
  conclusion?: string;

  @IsNumber()
  statusId: number;

  @IsNumber()
  areaId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  priority?: number;
} 