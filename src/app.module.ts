import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordService } from './discord/discord.service';
import { SocketGateway } from './socket/socket.gateway';
import { UserController } from './user/user.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, DiscordService, SocketGateway],
})
export class AppModule {}
