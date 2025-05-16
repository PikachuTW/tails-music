import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { DisTube } from 'distube';
import { DiscordService } from '../discord/discord.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class DistubeService {
    public distube: DisTube;
    public discordService: DiscordService;

    constructor(private moduleRef: ModuleRef) {
        this.discordService = this.moduleRef.get(DiscordService, { strict: false });
    }

    async onModuleInit() {
        this.distube = new DisTube(this.discordService.client);
    }
}
