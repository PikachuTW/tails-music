import { BaseGuildTextChannel, Client, Message, TextChannel } from 'discord.js';
import { ICommand, ICommandOptions } from '../../common/interface/command.interface';
import { Permission } from '../../common/enum/permission.enum';
import { DisTube } from 'distube';

export default class PlayCommand implements ICommand {
    private readonly client: Client;
    private readonly distube: DisTube;

    constructor({ discordService: { client, distube } }: ICommandOptions) {
        this.client = client;
        this.distube = distube;
    }
    aliases: string[] = [];
    description: string = 'Play a song';
    permission: Permission = Permission.USER;
    usage: string = 'play <song>';

    execute = async (message: Message, args: string[]) => {
        const song = args.join(' ');
        if (!song) {
            await message.reply('Please provide a song to play');
            return;
        }
        if (!message.member?.voice.channel) {
            await message.reply('You are not in a voice channel');
            return;
        }
        await message.reply(`Playing ${song}`);
        try {
            if (!(message.channel instanceof BaseGuildTextChannel)) {
                await message.reply('This channel is not a text channel');
                return;
            }
            await this.distube.play(message.member.voice.channel, song, { message, textChannel: message.channel });
        } catch (error) {
            await message.reply(`Error playing ${song}: ${error}`);
        }
    }
}