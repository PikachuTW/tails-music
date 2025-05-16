import { IEventOptions } from "src/common/interface/event.interface";
import { Events, Message } from "discord.js";
import { ICommand } from "src/common/interface/command.interface";
import { Permission } from "src/common/enum/permission.enum";
import { hasPermission } from "src/common/utils/permission.utils";

export default ({ discordService: { commands, client, logger } }: IEventOptions) => {
    client.on(Events.MessageCreate, async (message: Message) => {
        if (message.author.bot) return;

        const prefix = 'tm!';
        if (!prefix || !message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command: ICommand | undefined = commands.get(commandName);

        if (!command) return;

        const userPermission = Permission.USER;
        const commandPermission = command.permission;
        if (!hasPermission({ currentUserPermission: userPermission, requiredPermission: commandPermission })) {
            await message.reply('你沒有權限執行此指令！');
            return;
        }

        try {
            await command.execute(message, args);
        } catch (error) {
            logger.error(`Error executing command ${commandName}:`, error);
            await message.reply('執行該指令時發生錯誤！');
        }
    });
}