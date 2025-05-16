import { Client } from 'discord.js';
import { Logger } from '@nestjs/common';
import { IEvent } from '../../common/interface/event.interface';

export default class ReadyEvent implements IEvent {
  private readonly logger = new Logger(ReadyEvent.name);

  execute(client: Client) {
    this.logger.log(`Logged in as ${client.user?.tag}`);
  }
}
