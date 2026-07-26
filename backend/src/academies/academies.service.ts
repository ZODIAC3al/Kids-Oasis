import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Academy } from './schemas/academy.schema';
import { Branch } from './schemas/branch.schema';
import { Course } from './schemas/course.schema';
import { Review } from './schemas/review.schema';

import { User } from '../users/schemas/user.schema';

@Injectable()
export class AcademiesService {
  constructor(
    @InjectModel(Academy.name) private academyModel: Model<Academy>,
    @InjectModel(Branch.name) private branchModel: Model<Branch>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createAcademy(academyDto: any): Promise<Academy> {
    const academy = new this.academyModel(academyDto);
    return academy.save();
  }

  async createBranch(branchDto: any): Promise<Branch> {
    const branch = new this.branchModel(branchDto);
    return branch.save();
  }

  async createCourse(courseDto: any): Promise<Course> {
    const course = new this.courseModel(courseDto);
    return course.save();
  }

  async findAllAcademies(): Promise<Academy[]> {
    let academies = await this.academyModel.find().exec();
    if (!academies || academies.length === 0) {
      console.log('Academies collection is empty. Auto-seeding default academies into MongoDB...');
      academies = await this.academyModel.insertMany([
        {
          name: 'روضة الواحة النموذجية - Oasis Model Academy',
          description: 'أكاديمية نموذجية تقدم منهج المنتسوري المتكامل مع التركيز على تحفيظ القرآن الكريم واللغات والأنشطة الإبداعية للأطفال.',
          logo: 'https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop',
          rating: 4.9,
          totalReviews: 142,
          curriculum: 'Montessori',
          languages: ['Arabic', 'English', 'French'],
          activities: ['Robotics', 'Quran', 'Painting', 'Outdoor Play'],
          minAgeAllowed: 2,
          maxAgeAllowed: 5,
          city: 'Alexandria',
          governorate: 'Alexandria',
          address: 'سموحة، طريق الحرية، الإسكندرية',
          price: 1800,
          isVerified: true,
        },
        {
          name: 'أكاديمية الفرسان الصغيرة - Little Knights Academy',
          description: 'أكاديمية ترفيهية وتعليمية تركز على تنمية مهارات التفكير المنطقي والبرمجة والأنشطة الرياضية واللغة الإنجليزية.',
          logo: 'https://images.unsplash.com/photo-1526634332515-d56c5fd16991?q=80&w=1200&auto=format&fit=crop',
          rating: 4.8,
          totalReviews: 98,
          curriculum: 'STEM',
          languages: ['Arabic', 'English'],
          activities: ['Robotics', 'Gymnastics', 'Coding', 'Music'],
          minAgeAllowed: 3,
          maxAgeAllowed: 7,
          city: 'Alexandria',
          governorate: 'Alexandria',
          address: 'رشدي، شارع سوريا، الإسكندرية',
          price: 2200,
          isVerified: true,
        },
        {
          name: 'حضانة البراعم المبدعة - Creative Shoots Preschool',
          description: 'بيئة آمنة ومحفزة للطفل تعتمد على الاستكشاف واللعب الحر والفنون وتطوير السلوك الإيجابي واللغات متعددة.',
          logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop',
          rating: 5.0,
          totalReviews: 215,
          curriculum: 'Reggio Emilia',
          languages: ['Arabic', 'English', 'German'],
          activities: ['Art', 'Cooking', 'Gardening', 'Swimming'],
          minAgeAllowed: 1,
          maxAgeAllowed: 4,
          city: 'Cairo',
          governorate: 'Cairo',
          address: 'المعادي، شارع 9، القاهرة',
          price: 2500,
          isVerified: true,
        },
        {
          name: 'أكاديمية علماء المستقبل - Future Scientists Academy',
          description: 'مركز متخصص لتنمية الذكاء العلمي والابتكار المبكر والتجارب التفاعلية ورعاية الموهوبين.',
          logo: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop',
          rating: 4.9,
          totalReviews: 180,
          curriculum: 'STEM',
          languages: ['Arabic', 'English'],
          activities: ['STEM', 'Robotics', 'Chess', 'Drama'],
          minAgeAllowed: 3,
          maxAgeAllowed: 8,
          city: 'Giza',
          governorate: 'Giza',
          address: 'الشيخ زايد، الحي الثاني، الجيزة',
          price: 3000,
          isVerified: true,
        },
      ]);
    }
    return academies;
  }

  async findAcademyById(id: string): Promise<any> {
    let academy: any = null;
    if (Types.ObjectId.isValid(id)) {
      academy = await this.academyModel.findById(id).lean().exec();
    }
    if (!academy) {
      const academies = await this.academyModel.find().lean().exec();
      if (academies.length > 0) academy = academies[0];
    }
    if (!academy) throw new NotFoundException('Academy not found.');

    // Fetch all reviews from Review collection for this academy & populate parent user profile
    const dbReviews = await this.reviewModel
      .find({ academyId: academy._id })
      .populate('parentId', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .exec();

    const formattedReviews = dbReviews.map((r: any) => {
      const parent = r.parentId as any;
      const name = parent && (parent.firstName || parent.lastName)
        ? `${parent.firstName || ''} ${parent.lastName || ''}`.trim()
        : 'Parent User';
      return {
        _id: r._id,
        userName: name,
        userAvatar: parent?.avatar || '',
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '',
      };
    });

    if (formattedReviews.length > 0) {
      academy.reviews = formattedReviews;
    } else if (!academy.reviews) {
      academy.reviews = [];
    }

    return academy;
  }

  async findBranchesByAcademy(academyId: string): Promise<Branch[]> {
    if (!Types.ObjectId.isValid(academyId)) return [];
    return this.branchModel.find({ academyId }).exec();
  }

  async smartSearch(searchDto: any): Promise<Branch[]> {
    const query: any = {};
    if (searchDto.city) query.city = searchDto.city;
    if (searchDto.governorate) query.governorate = searchDto.governorate;

    if (searchDto.latitude && searchDto.longitude) {
      query.location = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(searchDto.longitude), parseFloat(searchDto.latitude)],
          },
          $maxDistance: searchDto.maxDistance || 10000, // Default 10km
        },
      };
    }

    return this.branchModel.find(query).populate('academyId').exec();
  }

  async recommend(childAge: number, budget: number, parentPrefs: string[]): Promise<any[]> {
    // 1. Filter academies based on child age bounds
    const academies = await this.academyModel.find({
      minAgeAllowed: { $lte: childAge },
      maxAgeAllowed: { $gte: childAge },
    }).exec();

    const academyIds = academies.map((ac) => ac._id);

    // 2. Fetch branches for these academies
    const branches = await this.branchModel.find({
      academyId: { $in: academyIds },
    }).populate('academyId').exec();

    // 3. For each branch, get courses, aggregate price & score matches
    const recommendations = [];
    for (const branch of branches) {
      const courses = await this.courseModel.find({ branchId: branch._id }).exec();
      const avgPrice = courses.reduce((acc, c) => acc + c.price, 0) / (courses.length || 1);

      if (budget && avgPrice > budget) continue; // Skip if it exceeds parent budget limit

      const academy = branch.academyId as unknown as Academy;
      let score = academy.rating * 2; // Base rating score (up to 10)

      // Preferences score boost
      if (parentPrefs && parentPrefs.length > 0) {
        const matches = academy.activities.filter((act) => parentPrefs.includes(act));
        score += matches.length * 1.5;
      }

      recommendations.push({
        branch,
        averageCoursePrice: avgPrice,
        score,
      });
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  async addReview(parentId: string, academyId: string, rating: number, comment: string): Promise<Review> {
    const targetAcademy = await this.findAcademyById(academyId);
    const realAcademyId = targetAcademy._id.toString();

    const review = new this.reviewModel({ parentId, academyId: realAcademyId, rating, comment });
    await review.save();

    // Fetch parent profile for name & avatar
    let userName = "Parent User";
    let userAvatar = "";
    if (Types.ObjectId.isValid(parentId)) {
      const user = await this.userModel.findById(parentId).exec();
      if (user) {
        userName = `${user.firstName} ${user.lastName}`.trim() || user.email;
        userAvatar = user.avatar || "";
      }
    }

    // Update aggregate ratings and push to academy.reviews array
    const reviews = await this.reviewModel.find({ academyId: realAcademyId }).exec();
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

    const reviewItem = {
      userName,
      userAvatar,
      rating,
      comment,
      createdAt: new Date(),
    };

    await this.academyModel.findByIdAndUpdate(realAcademyId, {
      rating: parseFloat(avgRating.toFixed(2)),
      totalReviews,
      $push: { reviews: reviewItem },
    }).exec();

    return review;
  }

  async verifyAcademy(id: string, isVerified: boolean): Promise<Academy> {
    const academy = await this.academyModel.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    ).exec();
    if (!academy) throw new NotFoundException('Academy not found.');
    return academy;
  }

  async findAcademiesByOwner(ownerId: string): Promise<Academy[]> {
    const academies = await this.academyModel.find({ ownerId }).exec();
    if (academies.length === 0) {
      // Return all academies if specific owner has none, or user is an owner
      return this.findAllAcademies();
    }
    return academies;
  }

  async updateAcademy(id: string, updateDto: any): Promise<Academy> {
    const academy = await this.academyModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!academy) throw new NotFoundException('Academy not found.');
    return academy;
  }
}
