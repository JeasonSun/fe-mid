import { IsNotEmpty } from 'class-validator';
export class GetUserNameDto {
  @IsNotEmpty()
  readonly id: number;
}

export class ResUserInfo {
  readonly id: number;
  readonly name: string;
}
