import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingStatus } from './schemas/booking.schema';
import { Enrollment, EnrollmentStatus } from './schemas/enrollment.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>
  ) {}

  // Bookings Methods
  async createBooking(bookingDto: any): Promise<Booking> {
    const booking = new this.bookingModel(bookingDto);
    return booking.save();
  }

  async findBookingsByParent(parentId: string): Promise<Booking[]> {
    return this.bookingModel.find({ parentId })
      .populate('childId')
      .populate('academyId')
      .populate('programId')
      .exec();
  }

  async findBookingsByAcademy(academyId: string): Promise<Booking[]> {
    return this.bookingModel.find({ academyId })
      .populate('childId')
      .populate('parentId')
      .populate('programId')
      .exec();
  }

  async findAllBookings(): Promise<Booking[]> {
    return this.bookingModel.find()
      .populate('childId')
      .populate('parentId')
      .populate('programId')
      .exec();
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const booking = await this.bookingModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!booking) throw new NotFoundException('Booking visit not found.');
    return booking;
  }

  // Enrollment Methods
  async createEnrollment(enrollmentDto: any): Promise<Enrollment> {
    const enrollment = new this.enrollmentModel(enrollmentDto);
    return enrollment.save();
  }

  async findEnrollmentsByParent(parentId: string): Promise<Enrollment[]> {
    return this.enrollmentModel.find({ parentId })
      .populate('childId')
      .populate('academyId')
      .populate('programId')
      .exec();
  }

  async findEnrollmentsByAcademy(academyId: string): Promise<Enrollment[]> {
    return this.enrollmentModel.find({ academyId })
      .populate('childId')
      .populate('parentId')
      .populate('programId')
      .exec();
  }

  async findAllEnrollments(): Promise<Enrollment[]> {
    return this.enrollmentModel.find()
      .populate('childId')
      .populate('parentId')
      .populate('programId')
      .exec();
  }

  async updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<Enrollment> {
    const enrollment = await this.enrollmentModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!enrollment) throw new NotFoundException('Enrollment application not found.');
    return enrollment;
  }
}
