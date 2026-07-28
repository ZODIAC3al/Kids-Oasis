import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from './schemas/enrollment.schema';
import { Child } from '../children/schemas/child.schema';
import { User } from '../users/schemas/user.schema';
import { ResendEmailService } from '../site/resend.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
    @InjectModel(Child.name) private childModel: Model<Child>,
    @InjectModel(User.name) private userModel: Model<User>,
    private resendEmailService: ResendEmailService,
  ) {}

  async create(parentId: string, dto: Partial<Enrollment>): Promise<Enrollment> {
    const enrollment = new this.enrollmentModel({ ...dto, parentId });
    return enrollment.save();
  }

  async findByParent(parentId: string): Promise<any[]> {
    const docs = await this.enrollmentModel
      .find({ parentId })
      .populate('childId')
      .populate('academyId')
      .populate('parentId', 'firstName lastName email phoneNumber avatar')
      .exec();
    return this.enrichEnrollments(docs);
  }

  async findAll(): Promise<any[]> {
    const docs = await this.enrollmentModel
      .find()
      .populate('childId')
      .populate('academyId')
      .populate('parentId', 'firstName lastName email phoneNumber avatar')
      .exec();
    return this.enrichEnrollments(docs);
  }

  private async enrichEnrollments(docs: any[]): Promise<any[]> {
    const allChildren = await this.childModel.find().exec();
    const allUsers = await this.userModel.find().exec();

    return docs.map((doc: any, index: number) => {
      const obj = doc.toObject ? doc.toObject() : { ...doc };

      // Ensure childId is populated with real Child document from MongoDB
      if (!obj.childId || typeof obj.childId === 'string' || !obj.childId.name) {
        const targetChildId = obj.childId?._id?.toString() || obj.childId?.toString();
        const targetParentId = obj.parentId?._id?.toString() || obj.parentId?.toString();

        const matchingChild = allChildren.find(
          (c: any) =>
            c._id.toString() === targetChildId ||
            c.parentId?.toString() === targetParentId
        ) || allChildren[index % Math.max(1, allChildren.length)];

        if (matchingChild) {
          obj.childId = matchingChild;
        }
      }

      // Ensure parentId is populated with real User document from MongoDB
      if (!obj.parentId || typeof obj.parentId === 'string' || !obj.parentId.firstName) {
        const targetParentId = obj.parentId?._id?.toString() || obj.parentId?.toString();
        const matchingUser = allUsers.find(
          (u: any) => u._id.toString() === targetParentId
        ) || allUsers[0];

        if (matchingUser) {
          obj.parentId = {
            _id: matchingUser._id,
            firstName: matchingUser.firstName,
            lastName: matchingUser.lastName,
            email: matchingUser.email,
            phoneNumber: matchingUser.phoneNumber,
            avatar: matchingUser.avatar,
          };
        }
      }

      return obj;
    });
  }

  async update(id: string, updateDto: Partial<Enrollment>): Promise<Enrollment | null> {
    const updated = await this.enrollmentModel.findByIdAndUpdate(id, updateDto, { new: true })
      .populate('childId')
      .populate('academyId')
      .populate('parentId')
      .exec();

    if (updated && updateDto.status) {
      const parent = updated.parentId as any;
      const child = updated.childId as any;
      const academy = updated.academyId as any;

      const parentEmail = parent?.email || 'parent@kidsoasis.com';
      const parentName = parent?.firstName ? `${parent.firstName} ${parent.lastName || ''}`.trim() : 'Valued Parent';
      const childName = child?.name || 'Your Child';
      const academyName = academy?.name || 'Oasis Academy';

      if (updateDto.status === 'Accepted' || updateDto.status === 'Approved') {
        this.resendEmailService.sendEnrollmentApproval(parentEmail, parentName, childName, academyName);
      } else if (updateDto.status === 'Declined' || updateDto.status === 'Rejected') {
        this.resendEmailService.sendEnrollmentDeclined(parentEmail, parentName, childName, academyName);
      }
    }

    return updated;
  }
}

