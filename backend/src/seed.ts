import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserSchema, UserRole } from './users/schemas/user.schema';
import { AcademySchema } from './academies/schemas/academy.schema';
import { BranchSchema } from './academies/schemas/branch.schema';
import { CourseSchema } from './academies/schemas/course.schema';
import { ReviewSchema } from './academies/schemas/review.schema';
import { BookingSchema, BookingStatus } from './bookings/schemas/booking.schema';
import { ChildSchema } from './users/schemas/child.schema';
import { ParentSchema } from './users/schemas/parent.schema';
import {
  SiteInfoSchema,
  ProgramSchema,
  NewsArticleSchema,
  TestimonialSchema,
} from './site/schemas/site.schema';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kids-oasis';

async function seed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI.substring(0, 30) + '...');
  await mongoose.connect(MONGODB_URI);

  const UserModel = mongoose.model('User', UserSchema, 'users');
  const ParentModel = mongoose.model('Parent', ParentSchema, 'parents');
  const ChildModel = mongoose.model('Child', ChildSchema, 'children');
  const AcademyModel = mongoose.model('Academy', AcademySchema, 'academies');
  const BranchModel = mongoose.model('Branch', BranchSchema, 'branches');
  const CourseModel = mongoose.model('Course', CourseSchema, 'courses');
  const ReviewModel = mongoose.model('Review', ReviewSchema, 'reviews');
  const BookingModel = mongoose.model('Booking', BookingSchema, 'bookings');
  const SiteInfoModel = mongoose.model('SiteInfo', SiteInfoSchema, 'siteinfos');
  const ProgramModel = mongoose.model('Program', ProgramSchema, 'programs');
  const NewsArticleModel = mongoose.model('NewsArticle', NewsArticleSchema, 'newsarticles');
  const TestimonialModel = mongoose.model('Testimonial', TestimonialSchema, 'testimonials');

  console.log('Clearing existing database collections...');
  await UserModel.deleteMany({});
  await ParentModel.deleteMany({});
  await ChildModel.deleteMany({});
  await AcademyModel.deleteMany({});
  await BranchModel.deleteMany({});
  await CourseModel.deleteMany({});
  await ReviewModel.deleteMany({});
  await BookingModel.deleteMany({});
  await SiteInfoModel.deleteMany({});
  await ProgramModel.deleteMany({});
  await NewsArticleModel.deleteMany({});
  await TestimonialModel.deleteMany({});

  console.log('Seeding site info & db.json contents...');
  await SiteInfoModel.create({
    name: 'Kids Oasis',
    phone: '+20 123 456 7890',
    email: 'info@kidsoasis.com',
    address: 'Alexandria, Egypt',
    hero: {
      eyebrow: 'Welcome to Kids Oasis!',
      title: 'Learn & Play!',
      description: 'We work every day to build the foundation for amazing futures, both for the child and for our community.',
      cta: 'Read More',
      image: 'https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop',
    },
    whyEducation: {
      title: 'Why Early Education Matters',
      description: 'Look into the eyes of a young child and see the sparkle and wonder. Develop that promise and watch the adult bloom into someone special.',
      stats: [
        { label: 'Total Groups', value: 15 },
        { label: 'Qualified Teachers', value: 32 },
        { label: 'Years of Experience', value: 10 },
        { label: 'Students Enrolled', value: 255 },
      ],
    },
    offer: {
      title: 'What We Offer',
      description: 'Providing affordable, high-quality early education and childcare services.',
      items: [
        { title: 'Art Classes', description: 'Explore creative painting and sculptures.', icon: 'palette' },
        { title: 'Special Education', description: 'Tailored learning for every unique child.', icon: 'puzzle' },
        { title: 'Activity Rooms', description: 'Interactive environments designed for play.', icon: 'ball' },
        { title: 'Languages', description: 'Multi-lingual immersion programs.', icon: 'bear' },
        { title: 'Healthy Food', description: 'Organic nutritious meals prepared daily.', icon: 'apple' },
      ],
    },
  });

  await ProgramModel.insertMany([
    { title: 'Early Education', description: 'Children will love our exciting activity center classrooms.', theme: 'pink', icon: 'brontosaurus' },
    { title: 'ABC Program', description: 'Children build before they read, learning shapes and letter sounds.', theme: 'sky', icon: 'trex' },
    { title: 'First Steps 4K', description: 'Preparing toddlers for primary school step-by-step.', theme: 'sun', icon: 'triceratops' },
  ]);

  await TestimonialModel.insertMany([
    { quote: 'The best decision we made was enrolling our daughter here — she runs to the door every morning excited for class.', name: 'Kate Brown', role: 'Mom of 2 Girls', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop' },
    { quote: 'Incredible development in social skills and confidence since joining. The teachers genuinely care about every child.', name: 'Tina Roberts', role: 'Mom of a Boy', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
    { quote: 'A warm, safe, and playful environment. We could not have asked for a better early education experience.', name: 'James Coles', role: 'Dad of a Girl', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
  ]);

  await NewsArticleModel.insertMany([
    { title: 'How to Teach a Child to Clean Himself', date: 'September 22, 2024', author: 'Tina White', category: 'Tips', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop' },
    { title: 'Best Indoor Activities for Your Child', date: 'September 22, 2024', author: 'Tina White', category: 'Play', image: 'https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=800&auto=format&fit=crop' },
    { title: 'Five Best Books About Parenting', date: 'September 22, 2024', author: 'Tina White', category: 'Books', image: 'https://images.unsplash.com/photo-1526634332515-d56c5fd16991?q=80&w=800&auto=format&fit=crop' },
  ]);

  console.log('Seeding default users...');
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const parentUser = await UserModel.create({
    firstName: 'Amira',
    lastName: 'Hassan',
    email: 'parent@kidsoasis.com',
    passwordHash,
    role: UserRole.PARENT,
    gender: 'female',
    phoneNumber: '+14155550123',
    address: '123 Market St, San Francisco, CA',
    isVerified: true,
  });

  const parentDoc = await ParentModel.create({
    userId: parentUser._id,
  });

  const childDoc = await ChildModel.create({
    name: 'Emma Thompson',
    birthday: new Date('2019-05-12'),
    gender: 'female',
    parentId: parentUser._id,
    interests: ['STEM', 'Robotics', 'Arts'],
    medicalNotes: 'No known allergies',
  });

  const ownerUser = await UserModel.create({
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'owner@kidsoasis.com',
    passwordHash,
    role: UserRole.ACADEMY_OWNER,
    gender: 'female',
    phoneNumber: '+14155550199',
    address: '456 Hayes St, San Francisco, CA',
    isVerified: true,
  });

  await UserModel.create({
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'teacher@kidsoasis.com',
    passwordHash,
    role: UserRole.PARENT,
    gender: 'female',
    phoneNumber: '+14155550188',
    address: '789 Mission St, San Francisco, CA',
    isVerified: true,
  });

  await UserModel.create({
    firstName: 'Alex',
    lastName: 'Mercer',
    email: 'admin@kidsoasis.com',
    passwordHash,
    role: UserRole.ADMIN,
    gender: 'male',
    phoneNumber: '+14155550100',
    address: '100 California St, San Francisco, CA',
    isVerified: true,
  });

  console.log('Seeding academies & branches...');
  const academiesData = [
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
    {
      name: 'روضة الزهور اللغوية - Blossoms Language Nursery',
      description: 'تطبيق المنهج البريطاني المبكر المدمج باللغة العربية والتأسيس المتميز في القراءة والحساب.',
      logo: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=1200&auto=format&fit=crop',
      rating: 4.7,
      totalReviews: 89,
      curriculum: 'British EYFS',
      languages: ['Arabic', 'English', 'French'],
      activities: ['Phonics', 'Storytelling', 'Ballet', 'Arts'],
      minAgeAllowed: 2,
      maxAgeAllowed: 6,
      city: 'Alexandria',
      governorate: 'Alexandria',
      address: 'جليم، شارع عبد السلام عارف، الإسكندرية',
      price: 1900,
      isVerified: true,
    },
    {
      name: 'أكاديمية النجوم الصغار - Little Stars Academy',
      description: 'مساحة متكاملة تجمع بين التعليم اللغوي المبكر والرياضات الخفيفة والأنشطة النفسية الحركية.',
      logo: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1200&auto=format&fit=crop',
      rating: 4.8,
      totalReviews: 110,
      curriculum: 'Montessori',
      languages: ['Arabic', 'English'],
      activities: ['Music', 'Swimming', 'Karate', 'Painting'],
      minAgeAllowed: 2,
      maxAgeAllowed: 6,
      city: 'Cairo',
      governorate: 'Cairo',
      address: 'القاهرة الجديدة، التجمع الخامس، القاهرة',
      price: 2800,
      isVerified: true,
    },
  ];

  for (const acData of academiesData) {
    const { city, governorate, address, price, ...restData } = acData;
    const academy = await AcademyModel.create({
      ...restData,
      ownerId: ownerUser._id,
    });

    const branch = await BranchModel.create({
      academyId: academy._id,
      name: `${academy.name} - الفرع الرئيسي`,
      address: address || 'الإسكندرية، مصر',
      city: city || 'Alexandria',
      governorate: governorate || 'Alexandria',
      location: {
        type: 'Point',
        coordinates: [29.9553, 31.2156],
      },
      contactNumber: '+20 123 456 7890',
    });

    const course = await CourseModel.create({
      branchId: branch._id,
      categoryId: new mongoose.Types.ObjectId(),
      name: `${academy.name} Program`,
      description: 'برنامج تعليمي وترفيهي شامل للأطفال.',
      price: price || 1800,
      discount: 10,
      availableSeats: 8,
      capacity: 20,
    });

    await ReviewModel.create({
      parentId: parentUser._id,
      academyId: academy._id,
      rating: 5,
      comment: 'أكاديمية ممتازة وطاقم تعليمي محترف للغاية!',
    });

    await BookingModel.create({
      parentId: parentUser._id,
      childId: childDoc._id,
      academyId: academy._id,
      programId: course._id,
      branchId: branch._id.toString(),
      date: new Date(),
      timeSlot: '09:00 AM - 12:00 PM',
      status: BookingStatus.CONFIRMED,
      notes: 'حجز زيارة أولية',
    });
  }

  console.log('Database seeding completed successfully!');
  const finalCount = await AcademyModel.countDocuments();
  console.log('Total Academies in DB:', finalCount);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Database seeding failed:', err);
  process.exit(1);
});
