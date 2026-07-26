import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userDto: Partial<User>): Promise<User> {
    const user = new this.userModel(userDto);
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOne(query: any): Promise<User | null> {
    return this.userModel.findOne(query).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateDto: any): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async incrementFailedAttempts(user: User): Promise<void> {
    const updates: Partial<User> = { failedLoginAttempts: user.failedLoginAttempts + 1 };
    if (updates.failedLoginAttempts >= 5) {
      updates.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
    }
    await this.userModel.findByIdAndUpdate(user.id, updates).exec();
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      failedLoginAttempts: 0,
      $unset: { lockUntil: 1 }
    }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({}, '-password').exec();
  }

  async countByRole(role: UserRole): Promise<number> {
    return this.userModel.countDocuments({ role }).exec();
  }
}
