import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  stars: number;
}
