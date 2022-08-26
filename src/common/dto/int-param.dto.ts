import { IsNumber } from 'class-validator';

export class IntParamDto {
  @IsNumber()
  id: number;
}
