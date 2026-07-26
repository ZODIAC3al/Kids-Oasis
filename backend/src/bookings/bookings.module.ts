import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Enrollment, EnrollmentSchema } from './schemas/enrollment.schema';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Enrollment.name, schema: EnrollmentSchema }
    ])
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService, MongooseModule],
})
export class BookingsModule {}
