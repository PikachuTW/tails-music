import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './discord/discord.module';
import { UserModule } from './user/user.module';
import { DistubeModule } from './distube/distube.module';

@Module({
  imports: [UserModule, DiscordModule, DistubeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
