import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('create-intent')
  @ApiOperation({ summary: 'Create Stripe PaymentIntent for academy tuition' })
  async createPaymentIntent(@Request() req: any, @Body() dto: { amount: number; academyId: string; enrollmentId?: string; currency?: string }) {
    const parentId = req.user.userId || req.user._id || req.user.id;
    return this.paymentsService.createPaymentIntent(parentId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('confirm')
  @ApiOperation({ summary: 'Confirm Stripe Payment and update Enrollment status in MongoDB' })
  async confirmPayment(@Request() req: any, @Body() dto: { enrollmentId: string; academyId: string; amount: number; paymentIntentId: string; paymentMethod?: string }) {
    const parentId = req.user.userId || req.user._id || req.user.id;
    return this.paymentsService.confirmPayment(parentId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('history')
  @ApiOperation({ summary: 'Get payment transaction history for logged-in parent' })
  async getPaymentHistory(@Request() req: any) {
    const parentId = req.user.userId || req.user._id || req.user.id;
    return this.paymentsService.getPaymentHistory(parentId);
  }
}
