import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Child } from './schemas/child.schema';

@Injectable()
export class ChildrenService {
  constructor(@InjectModel(Child.name) private childModel: Model<Child>) {}

  async create(childDto: any): Promise<Child> {
    const child = new this.childModel(childDto);
    return child.save();
  }

  async findByParent(parentId: string): Promise<Child[]> {
    return this.childModel.find({ parentId }).exec();
  }

  async findById(id: string): Promise<Child | null> {
    return this.childModel.findById(id).exec();
  }

  async update(id: string, updateDto: any): Promise<Child | null> {
    const child = await this.childModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!child) throw new NotFoundException('Child profile not found.');
    return child;
  }
}
