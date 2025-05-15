import { Client } from 'discord.js';

export interface IEvent {
  execute(...args: any[]): void | Promise<void>;
}