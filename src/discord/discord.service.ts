import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { ICommand, ICommandOptions } from '../common/interface/command.interface';
import { DisTube } from 'distube';
import { YouTubePlugin } from '@distube/youtube';

@Injectable()
export class DiscordService implements OnModuleInit, OnModuleDestroy {
  public readonly logger = new Logger(DiscordService.name);
  public readonly client: Client;
  public readonly commands: Collection<string, ICommand>;
  public readonly distube: DisTube;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    this.commands = new Collection<string, ICommand>();
    this.distube = new DisTube(this.client, {
      plugins: [
        new YouTubePlugin({
          ytdlOptions: {
          }
        })
      ],
    });
  }

  async onModuleInit() {
    const token = this.configService.get<string>('DISCORD_TOKEN');
    if (!token) {
      throw new Error('DISCORD_TOKEN in env is required');
    }

    try {
      await this.client.login(token);
    } catch (err) {
      this.logger.error(`Logined failed: ${err}`);
      throw err;
    }

    await this.loadCommands();
    await this.loadEvents();
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
          const loadFunction = eventModule.default;

          if (typeof loadFunction === 'function') {
            loadFunction({ discordService: this });
            this.logger.log(`Successfully loaded event: ${eventName}`);
          } else {
            this.logger.error(`Failed to load event ${eventName} from ${file}: Invalid event class or missing execute method.`);
          }
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
          const CommandClass = commandModule.default as new ({ discordService }: ICommandOptions) => ICommand;
          const newCommand = new CommandClass({ discordService: this });

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
