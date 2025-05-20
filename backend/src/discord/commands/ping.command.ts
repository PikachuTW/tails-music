import { Client, Message } from 'discord.js';
import { ICommand, ICommandOptions } from '../../common/interface/command.interface';
import { Permission } from '../../common/enum/permission.enum';
import { DisTube } from 'distube';

export default class PingCommand implements ICommand {
    private readonly client: Client;
    private readonly distube: DisTube;

    constructor({ discordService: { client, distube } }: ICommandOptions) {
        this.client = client;
        this.distube = distube; 
    }
    aliases: string[] = [];
    description: string = 'Get the latency of the bot';
    permission: Permission = Permission.USER;
    usage: string = 'ping';
    execute = async (message: Message, args: string[]) => {
        const ping = this.client.ws.ping;
        await message.reply(`The bot's ping is ${ping}ms`);
    }
}