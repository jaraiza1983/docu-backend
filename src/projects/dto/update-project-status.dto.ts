import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class UpdateProjectStatusDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  priority?: number;
} 