import { Injectable } from '@nestjs/common';
import { DisTube } from 'distube';
import { DiscordService } from 'src/discord/discord.service';

@Injectable()
export class DistubeService {
    private readonly distube: DisTube;

    constructor(private readonly discordService: DiscordService) {
        this.distube = new DisTube(discordService.client);
    }
}
