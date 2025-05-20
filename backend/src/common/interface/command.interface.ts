import { Message } from 'discord.js';
import { Permission } from '../enum/permission.enum';
import { DiscordService } from '../../discord/discord.service';

export interface ICommand {
    aliases: string[];
    description: string;
    permission: Permission;
    usage: string;
    execute: (message: Message, args: string[]) => Promise<void> | void;
}

export interface ICommandOptions {
    discordService: DiscordService;
}
