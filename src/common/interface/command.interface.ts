import { Client, Message } from 'discord.js';
import { Permission } from '../enum/permission.enum';
import { DistubeService } from 'src/distube/distube.service';
export interface ICommand {
    aliases: string[];
    description: string;
    permission: Permission;
    usage: string;
    execute: (message: Message, args: string[]) => Promise<void> | void;
}

export interface ICommandOptions {
    client: Client;
    distubeService: DistubeService;
}
