import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Child, ChildSchema } from './schemas/child.schema';
import { UsersService } from './users.service';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Child.name, schema: ChildSchema }
    ])
  ],
  providers: [UsersService, ChildrenService],
  controllers: [ChildrenController],
  exports: [UsersService, ChildrenService, MongooseModule]
})
export class UsersModule {}
