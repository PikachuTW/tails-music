import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';
import * as path from 'node:path';
import * as fs from 'node:fs';
import Event from './events/event.class';

@Injectable()
export class DiscordService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DiscordService.name);
  private client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  async onModuleInit() {
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      throw new Error('DISCORD_TOKEN in env is required');
    }

    try {
      await this.client.login(token);
    } catch (err) {
      this.logger.error(`Logined failed: ${err}`);
      throw err;
    }

    await this.loadEvents();
  }

  async onModuleDestroy() {
    await this.client.destroy();
    this.logger.log('Discord client destroyed');
  }

  private async loadEvents() {
    const eventsFolderPath = path.join(__dirname, 'events');
    const eventFiles = fs
      .readdirSync(eventsFolderPath, { withFileTypes: true })
      .filter((file) => file.isFile() && file.name.endsWith('.event.js'))
      .map((f) => f.name);
    await Promise.all(
      eventFiles.map(async (file) => {
        const event = (await import(path.join(eventsFolderPath, file))) as {
          default: new () => Event;
        };
        const newEvent = new event.default();
        this.client.on(file.split('.')[0], (...args: unknown[]) => {
          void newEvent.execute(this.client, ...args);
        });
      }),
    );
  }

  async getUserById(userId: string) {
    if (!this.client) return null;
    try {
      const user = await this.client.users.fetch(userId);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${userId}\n${error}`);
      return null;
    }
  }
}
