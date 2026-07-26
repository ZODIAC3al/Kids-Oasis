import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversation')
  async createConversation(@Req() req, @Body('participantId') participantId: string) {
    return this.chatService.createConversation([req.user.userId, participantId]);
  }

  @Get('conversations')
  async getConversations(@Req() req) {
    return this.chatService.findConversations(req.user.userId);
  }

  @Get('messages/:conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }
}
