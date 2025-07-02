import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  target?: string;

  @IsOptional()
  @IsString()
  conclusion?: string;

  @IsOptional()
  @IsNumber()
  statusId?: number;

  @IsOptional()
  @IsNumber()
  areaId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  priority?: number;
} 