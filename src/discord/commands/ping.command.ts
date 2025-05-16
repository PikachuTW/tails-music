import { Client, Message } from 'discord.js';
import { ICommand } from '../../common/interface/command.interface';
import { Permission } from '../../common/enum/permission.enum';
import { DistubeService } from 'src/distube/distube.service';
export default class PingCommand implements ICommand {
    constructor(private readonly client: Client) {}
    aliases: string[] = [];
    description: string = 'Get the latency of the bot';
    permission: Permission = Permission.USER;
    usage: string = 'ping';
    execute = async (message: Message, args: string[]) => {
        const ping = this.client.ws.ping;
        await message.reply(`The bot's ping is ${ping}ms`);
    }
}