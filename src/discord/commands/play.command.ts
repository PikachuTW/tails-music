import { Client, Message } from 'discord.js';
import { ICommand } from '../../common/interface/command.interface';
import { Permission } from '../../common/enum/permission.enum';
import { DistubeService } from '../../distube/distube.service';

export default class PlayCommand implements ICommand {
    aliases: string[] = [];
    description: string = 'Play a song';
    permission: Permission = Permission.USER;
    usage: string = 'play <song>';

    constructor(private readonly distubeService: DistubeService) {}

    execute = async (message: Message, args: string[]) => {
        const song = args.join(' ');
        if (!song) {
            await message.reply('Please provide a song to play');
            return;
        }
        // 使用 this.distubeService 來播放歌曲
        // 例如: await this.distubeService.distube.play(message.member.voice.channel, song, { message, textChannel: message.channel });
        await message.reply(`Playing ${song} (準備使用 DistubeService)`);
    }
}