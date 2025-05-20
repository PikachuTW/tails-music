import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [DiscordModule],
  controllers: [UserController],
})
export class UserModule {} 