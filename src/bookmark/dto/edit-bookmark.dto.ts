import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class EditBookmarkDto {
  @IsOptional()
  @IsNotEmpty()
  link?: string;

  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  stars?: number;
}
