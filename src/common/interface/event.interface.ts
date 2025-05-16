import { Client } from 'discord.js';
import { DistubeService } from 'src/distube/distube.service';

export interface IEvent {
  execute(...args: any[]): void | Promise<void>;
}

export interface IEventOptions {
  client: Client;
  distubeService: DistubeService;
}
