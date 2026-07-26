import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Child, ChildSchema } from './schemas/child.schema';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }])],
  providers: [ChildrenService],
  controllers: [ChildrenController],
  exports: [ChildrenService],
})
export class ChildrenModule {}
