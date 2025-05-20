import { Client, Message } from 'discord.js';
import { ICommand, ICommandOptions } from '../../common/interface/command.interface';
import { Permission } from '../../common/enum/permission.enum';
import { AuthService } from '../../auth/auth.service';

export default class LoginCommand implements ICommand {
    private readonly client: Client;

    constructor(
        { discordService: { client } }: ICommandOptions,
        private readonly authService: AuthService
    ) {
        this.client = client;
    }
    aliases: string[] = [];
    description: string = 'Login to the bot';
    permission: Permission = Permission.USER;
    usage: string = 'login';
    execute = async (message: Message, args: string[]) => {
        const code = args[0];
        if (!code) {
            await message.reply('Please provide a code');
            return;
        }
        const codeData = this.authService.codes.get(parseInt(code));
        if (!codeData) {
            await message.reply('Invalid code');
            return;
        }
        if (codeData.expiresAt < Date.now()) {
            await message.reply('Code expired');
            return;
        }
        codeData.session.discordid = message.author.id;
        await message.reply('Login successful');
    }
}