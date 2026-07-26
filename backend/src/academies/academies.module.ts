import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Academy, AcademySchema } from './schemas/academy.schema';
import { Branch, BranchSchema } from './schemas/branch.schema';
import { Course, CourseSchema } from './schemas/course.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { AcademiesService } from './academies.service';
import { AcademiesController } from './academies.controller';

import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Academy.name, schema: AcademySchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AcademiesService],
  controllers: [AcademiesController],
  exports: [AcademiesService],
})
export class AcademiesModule {}
