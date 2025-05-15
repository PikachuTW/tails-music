import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { IEvent } from './events/event.interface';
import { ICommand } from './commands/command.interface';

@Injectable()
export class DiscordService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DiscordService.name);
  public readonly client: Client;
  public readonly commands: Collection<string, ICommand>;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    this.commands = new Collection<string, ICommand>();
  }

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
    await this.loadCommands();
  }

  async onModuleDestroy() {
    await this.client.destroy();
    this.logger.log('Discord client destroyed');
  }

  private async loadEvents() {
    const eventsFolderPath = path.join(__dirname, 'events');
    const eventFiles = (await fs
      .readdir(eventsFolderPath, { withFileTypes: true }))
      .filter((file) => file.isFile() && file.name.endsWith('.event.js'))
      .map((f) => f.name);

    await Promise.all(
      eventFiles.map(async (file) => {
        const eventName = file.split('.')[0];
        try {
          const eventModule = await import(path.join(eventsFolderPath, file));

          const EventClass = eventModule.default as new (discordService: DiscordService) => IEvent;
          const newEvent = new EventClass(this);

          this.client.on(eventName, (...args: unknown[]) => {
            void newEvent.execute(this.client, ...args);
          });
          this.logger.log(`Successfully loaded event: ${eventName}`);
        } catch (error) {
          this.logger.error(
            `Failed to load event ${eventName} from ${file}: ${error}`,
          );
        }
      }),
    );
  }

  private async loadCommands() {
    const commandsFolderPath = path.join(__dirname, 'commands');
    const commandFiles = (await fs.readdir(
      commandsFolderPath,
      { withFileTypes: true },
    ))
      .filter((file) => file.isFile() && file.name.endsWith('.command.js'))
      .map((f) => f.name);

    await Promise.all(
      commandFiles.map(async (file) => {
        const commandName = file.split('.')[0];
        try {
          const commandModule = await import(path.join(commandsFolderPath, file));
          const CommandClass = commandModule.default as new () => ICommand;
          const newCommand = new CommandClass();

          this.commands.set(commandName, newCommand);
          newCommand.aliases.forEach((alias) => {
            this.commands.set(alias, newCommand);
          });
          this.logger.log(`Successfully loaded command: ${commandName}`);
        } catch (error) {
          this.logger.error(
            `Failed to load command ${commandName} from ${file}: ${error}`,
          );
        }
      }),
    );
  }

  getCommand(commandName: string): ICommand | undefined {
    return this.commands.get(commandName);
  }

  async getUserById(userId: string) {
    if (!this.client) return null;
    try {
      const user = await this.client.users.fetch(userId);
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID ${userId}: {error}`);
      return null;
    }
  }
}
