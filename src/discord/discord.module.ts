import { Module, forwardRef } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DistubeModule } from 'src/distube/distube.module';

@Module({
    providers: [DiscordService],
    exports: [DiscordService],
})
export class DiscordModule { } 