import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Enrollment, EnrollmentSchema } from '../enrollments/schemas/enrollment.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ResendEmailService } from '../site/resend.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [PaymentsService, ResendEmailService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
