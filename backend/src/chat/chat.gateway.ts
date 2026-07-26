import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody('conversationId') conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(conversationId);
    console.log(`Client ${client.id} joined room ${conversationId}`);
    return { status: 'joined' };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { conversationId: string; senderId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.saveMessage(
      data.conversationId,
      data.senderId,
      data.text,
    );

    // Broadcast message to everyone in the room
    this.server.to(data.conversationId).emit('messageReceived', message);
  }

  @SubscribeMessage('typingStatus')
  handleTypingStatus(
    @MessageBody() data: { conversationId: string; userId: string; isTyping: boolean },
  ) {
    this.server.to(data.conversationId).emit('typingReceived', data);
  }
}
