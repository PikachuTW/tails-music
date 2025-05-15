import { Client, Message } from 'discord.js';
import { Permission } from './permission.enum';

export interface ICommand {
    aliases: string[];
    description: string;
    permission: Permission;
    usage: string;
    execute: (client: Client, message: Message, args: string[]) => Promise<void> | void;
}