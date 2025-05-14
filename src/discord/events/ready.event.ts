import { Client } from 'discord.js';
import Event from './event.class';
import { Logger } from '@nestjs/common';

export default class ReadyEvent extends Event {
  private readonly logger = new Logger(ReadyEvent.name);

  execute(client: Client) {
    this.logger.log(`Logged in as ${client.user?.tag}`);
  }
}
