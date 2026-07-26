import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Child } from './schemas/child.schema';

@Injectable()
export class ChildrenService {
  constructor(@InjectModel(Child.name) private childModel: Model<Child>) {}

  async create(parentId: string, childDto: Partial<Child>): Promise<Child> {
    const child = new this.childModel({ ...childDto, parentId });
    return child.save();
  }

  async findByParent(parentId: string): Promise<Child[]> {
    return this.childModel.find({ parentId }).exec();
  }

  async findAll(): Promise<Child[]> {
    return this.childModel.find().exec();
  }

  async findById(id: string): Promise<Child | null> {
    return this.childModel.findById(id).exec();
  }

  async update(id: string, parentId: string, updateDto: Partial<Child>): Promise<Child | null> {
    return this.childModel.findOneAndUpdate({ _id: id, parentId }, updateDto, { new: true }).exec();
  }

  async delete(id: string, parentId: string): Promise<boolean> {
    const result = await this.childModel.deleteOne({ _id: id, parentId }).exec();
    return result.deletedCount > 0;
  }
}
