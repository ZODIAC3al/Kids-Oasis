import { Controller, Post, Get, Body, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingStatus } from './schemas/booking.schema';
import { EnrollmentStatus } from './schemas/enrollment.schema';

@Controller()
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Bookings visits endpoints
  @Post('bookings')
  async createBooking(@Req() req, @Body() body: any) {
    return this.bookingsService.createBooking({
      ...body,
      parentId: req.user.userId,
    });
  }

  @Get('bookings')
  async getBookings(@Req() req) {
    const role = (req.user.role || '').toLowerCase();
    const userId = req.user.userId;
    if (role === 'nurseryowner' || role === 'academyowner' || role === 'academy_owner' || role === 'owner') {
      return this.bookingsService.findBookingsByAcademy(userId);
    } else if (role === 'admin' || role === 'super_admin' || role === 'teacher' || role === 'support') {
      return this.bookingsService.findAllBookings();
    }
    return this.bookingsService.findBookingsByParent(userId);
  }

  @Patch('bookings/:id/status')
  async updateBookingStatus(@Param('id') id: string, @Body('status') status: BookingStatus) {
    return this.bookingsService.updateBookingStatus(id, status);
  }

  // Program enrollments endpoints
  @Post('enrollments')
  async createEnrollment(@Req() req, @Body() body: any) {
    return this.bookingsService.createEnrollment({
      ...body,
      parentId: req.user.userId,
    });
  }

  @Get('enrollments')
  async getEnrollments(@Req() req) {
    const role = (req.user.role || '').toLowerCase();
    const userId = req.user.userId;
    if (role === 'nurseryowner' || role === 'academyowner' || role === 'academy_owner' || role === 'owner') {
      return this.bookingsService.findEnrollmentsByAcademy(userId);
    } else if (role === 'admin' || role === 'super_admin' || role === 'teacher' || role === 'support') {
      return this.bookingsService.findAllEnrollments();
    }
    return this.bookingsService.findEnrollmentsByParent(userId);
  }

  @Patch('enrollments/:id/status')
  async updateEnrollmentStatus(@Param('id') id: string, @Body('status') status: EnrollmentStatus) {
    return this.bookingsService.updateEnrollmentStatus(id, status);
  }
}
