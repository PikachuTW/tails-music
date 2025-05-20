import { Events } from 'discord.js';
import { IEventOptions } from '../../common/interface/event.interface';

export default ({ discordService: { client, logger } }: IEventOptions) => {
  client.on(Events.ClientReady, (client) => {
    logger.log(`Logged in as ${client.user?.tag}`);
  });
}
