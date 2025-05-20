import { IsNumberString } from 'class-validator';

export class DiscordIdDto {
  @IsNumberString()
  public readonly id: string;
}
