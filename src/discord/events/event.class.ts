export default abstract class Event {
  constructor() {}
  abstract execute(...args: any[]): void | Promise<void>;
}
