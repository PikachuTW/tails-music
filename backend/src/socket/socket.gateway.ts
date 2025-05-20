import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  socket: Socket;
  private readonly logger = new Logger(SocketGateway.name);

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    this.logger.log(client.id);
    client.emit('message', 'Hello world!');
    return 'Hello world!';
  }
}
