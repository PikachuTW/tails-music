import { Client, Message } from 'discord.js';
import { ICommand } from './command.interface';
import { Permission } from './permission.enum';

export default class PingCommand implements ICommand {
    aliases: string[] = [];
    description: string = 'Get the latency of the bot';
    permission: Permission = Permission.USER;
    usage: string = 'ping';
    execute = async (client: Client, message: Message, args: string[]) => {
        const ping = client.ws.ping;
        await message.reply(`The bot's ping is ${ping}ms`);
    }
}