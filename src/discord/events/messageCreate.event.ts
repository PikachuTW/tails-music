import { IEvent } from '../../common/interface/event.interface';
import { Client, Message } from 'discord.js';
import { DiscordService } from '../discord.service';
import { Permission } from '../../common/enum/permission.enum';
import { hasPermission } from '../../common/utils/permission.utils';

export default class MessageCreateEvent implements IEvent {
    constructor(private readonly discordService: DiscordService) { }

    execute = async (client: Client, message: Message) => {
        if (message.author.bot) return;

        const prefix = 'tm!';
        if (!prefix || !message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command = this.discordService.getCommand(commandName);

        if (!command) return;

        const userPermission = Permission.USER;
        const commandPermission = command.permission;
        if (!hasPermission(userPermission, commandPermission)) {
            await message.reply('你沒有權限執行此指令！');
            return;
        }

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            await message.reply('執行該指令時發生錯誤！');
        }
    }
};
