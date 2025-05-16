import { Module, forwardRef } from '@nestjs/common';
import { DistubeService } from './distube.service';
import { DiscordModule } from '../discord/discord.module';

@Module({
  providers: [DistubeService],
  exports: [DistubeService],
})
export class DistubeModule {}
