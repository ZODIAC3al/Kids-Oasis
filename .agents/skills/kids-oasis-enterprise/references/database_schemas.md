# Database Schemas & Mongoose Models

This document defines the Mongoose schemas, indexes, and TypeScript types for all 26 collections required by the enterprise edition of **Kids-Oasis**.

---

## 1. Directory of Collections

The database models are designed to represent parent, student, and academy profiles in a structured, relational-like fashion within MongoDB, optimization-indexed for geospatial searches, full-text searches, and quick key lookups.

---

## 2. Core Collections Definitions

### 2.1 Users (`users`)
Holds base accounts for admins, parents, and academy owners.
```typescript
import { Schema, Document, model } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  PARENT = 'parent',
  ACADEMY_OWNER = 'nurseryOwner',
  SERVICE_PROVIDER = 'serviceProvider'
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  gender: 'male' | 'female';
  phoneNumber: string;
  address: string;
  isActive: boolean;
  isVerified: boolean;
  verificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  refreshTokens: string[];
}

export const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.PARENT },
  gender: { type: String, enum: ['male', 'female'], required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  refreshTokens: [{ type: String }]
}, { timestamps: true });

UserSchema.index({ email: 1 });
```

### 2.2 Parents (`parents`)
Child metadata link and billing fields.
```typescript
export interface IParent extends Document {
  userId: Schema.Types.ObjectId;
  savedAcademies: Schema.Types.ObjectId[];
  paymentPreferences?: string;
}

export const ParentSchema = new Schema<IParent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  savedAcademies: [{ type: Schema.Types.ObjectId, ref: 'Academy' }]
});
```

### 2.3 Children (`children`)
Represents kids enrolled in courses or tracked for recommendations.
```typescript
export interface IChild extends Document {
  parentId: Schema.Types.ObjectId;
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  preferences?: string[];
  medicalNotes?: string;
}

export const ChildSchema = new Schema<IChild>({
  parentId: { type: Schema.Types.ObjectId, ref: 'Parent', required: true },
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  preferences: [{ type: String }],
  medicalNotes: String
});
```

### 2.4 Academies (`academies`)
Nursery or academy registration document.
```typescript
export interface IAcademy extends Document {
  ownerId: Schema.Types.ObjectId;
  name: string;
  description: string;
  logo: string;
  rating: number;
  totalReviews: number;
  curriculum: string;
  languages: string[];
  activities: string[];
  minAgeAllowed: number;
  maxAgeAllowed: number;
  isVerified: boolean;
}

export const AcademySchema = new Schema<IAcademy>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  logo: { type: String },
  rating: { type: Number, default: 0, index: true },
  totalReviews: { type: Number, default: 0 },
  curriculum: { type: String, required: true },
  languages: [{ type: String }],
  activities: [{ type: String }],
  minAgeAllowed: { type: Number, required: true },
  maxAgeAllowed: { type: Number, required: true },
  isVerified: { type: Boolean, default: false }
});

AcademySchema.index({ name: 'text', description: 'text' });
```

### 2.5 Branches (`branches`)
Physical locations of academies, indexed for geospatial search queries.
```typescript
export interface IBranch extends Document {
  academyId: Schema.Types.ObjectId;
  name: string;
  address: string;
  city: string;
  governorate: string;
  location: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  contactNumber: string;
}

export const BranchSchema = new Schema<IBranch>({
  academyId: { type: Schema.Types.ObjectId, ref: 'Academy', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  governorate: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  contactNumber: { type: String, required: true }
});

BranchSchema.index({ location: '2dsphere' });
BranchSchema.index({ city: 1, governorate: 1 });
```

### 2.6 Teachers (`teachers`)
Profiles of instructors deployed inside branches.
```typescript
export interface ITeacher extends Document {
  branchId: Schema.Types.ObjectId;
  name: string;
  email: string;
  specialization: string;
  rating: number;
  experienceYears: number;
}

export const TeacherSchema = new Schema<ITeacher>({
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  specialization: { type: String, required: true },
  rating: { type: Number, default: 5 },
  experienceYears: { type: Number, default: 0 }
});
```

### 2.7 Courses (`courses`)
Educational classes offered by the branches.
```typescript
export interface ICourse extends Document {
  branchId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  discount: number;
  availableSeats: number;
  capacity: number;
}

export const CourseSchema = new Schema<ICourse>({
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  availableSeats: { type: Number, required: true },
  capacity: { type: Number, required: true }
});
```

### 2.8 Categories (`categories`)
Filter catalogs for courses (e.g. Arts, STEM, Language, Sports).
```typescript
export interface ICategory extends Document {
  name: string;
  slug: string;
}

export const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }
});
```

### 2.9 Bookings (`bookings`)
Initial reservation requests before final payment approval.
```typescript
export interface IBooking extends Document {
  parentId: Schema.Types.ObjectId;
  childId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: Date;
}

export const BookingSchema = new Schema<IBooking>({
  parentId: { type: Schema.Types.ObjectId, ref: 'Parent', required: true },
  childId: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  bookingDate: { type: Date, default: Date.now }
});
```

### 2.10 Enrollments (`enrollments`)
Active student registration within modules.
```typescript
export interface IEnrollment extends Document {
  childId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'suspended';
}

export const EnrollmentSchema = new Schema<IEnrollment>({
  childId: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed', 'suspended'], default: 'active' }
});
```

### 2.11 Payments (`payments`)
Billing logs connected to bookings.
```typescript
export interface IPayment extends Document {
  parentId: Schema.Types.ObjectId;
  bookingId: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  provider: string; // stripe, paypal, offline
  paymentStatus: 'pending' | 'completed' | 'failed';
  transactionId: string;
}

export const PaymentSchema = new Schema<IPayment>({
  parentId: { type: Schema.Types.ObjectId, ref: 'Parent', required: true },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'EGP' },
  provider: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String, unique: true }
});
```

### 2.12 Reviews (`reviews`)
Customer ratings posted on Academy listings.
```typescript
export interface IReview extends Document {
  parentId: Schema.Types.ObjectId;
  academyId: Schema.Types.ObjectId;
  rating: number;
  comment: string;
}

export const ReviewSchema = new Schema<IReview>({
  parentId: { type: Schema.Types.ObjectId, ref: 'Parent', required: true },
  academyId: { type: Schema.Types.ObjectId, ref: 'Academy', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });
```

### 2.13 Favorites (`favorites`)
Bookmarks of preferred nursery branches.
```typescript
export interface IFavorite extends Document {
  parentId: Schema.Types.ObjectId;
  branchId: Schema.Types.ObjectId;
}

export const FavoriteSchema = new Schema<IFavorite>({
  parentId: { type: Schema.Types.ObjectId, ref: 'Parent', required: true },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true }
});
```

### 2.14 Notifications (`notifications`)
In-app messaging log for real-time broadcasts.
```typescript
export interface INotification extends Document {
  recipientId: Schema.Types.ObjectId;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
}

export const NotificationSchema = new Schema<INotification>({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });
```

### 2.15 Messages (`messages`)
Atomic chat messages inside active conversations.
```typescript
export interface IMessage extends Document {
  conversationId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  text: string;
  isRead: boolean;
}

export const MessageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });
```

### 2.16 Conversations (`conversations`)
Private messaging rooms linking parents and academy managers.
```typescript
export interface IConversation extends Document {
  participants: Schema.Types.ObjectId[];
  lastMessageAt: Date;
}

export const ConversationSchema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessageAt: { type: Date, default: Date.now }
});
```

### 2.17 Events (`events`)
Branch calendars for activities and announcements.
```typescript
export interface IEvent extends Document {
  branchId: Schema.Types.ObjectId;
  title: string;
  description: string;
  eventDate: Date;
}

export const EventSchema = new Schema<IEvent>({
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  eventDate: { type: Date, required: true }
});
```

### 2.18 Attendance (`attendance`)
Registers child presence inside enrolled courses.
```typescript
export interface IAttendance extends Document {
  enrollmentId: Schema.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'excused';
}

export const AttendanceSchema = new Schema<IAttendance>({
  enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'excused'], default: 'present' }
});
```

### 2.19 Blogs (`blogs`)
Platform updates and parenting resource posts.
```typescript
export interface IBlog extends Document {
  authorId: Schema.Types.ObjectId;
  title: string;
  content: string;
  slug: string;
  tags: string[];
}

export const BlogSchema = new Schema<IBlog>({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  tags: [{ type: String }]
}, { timestamps: true });
```

### 2.20 FAQs (`faqs`)
Knowledgebase database items.
```typescript
export interface IFAQ extends Document {
  question: string;
  answer: string;
}

export const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});
```

### 2.21 Reports (`reports`)
Reporting schema for flaggings/violations.
```typescript
export interface IReport extends Document {
  reporterId: Schema.Types.ObjectId;
  targetId: Schema.Types.ObjectId;
  targetModel: 'Academy' | 'Review' | 'User';
  reason: string;
  isResolved: boolean;
}

export const ReportSchema = new Schema<IReport>({
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  targetModel: { type: String, enum: ['Academy', 'Review', 'User'], required: true },
  reason: { type: String, required: true },
  isResolved: { type: Boolean, default: false }
});
```

### 2.22 Support Tickets (`supportTickets`)
Customer tickets reporting app bugs or platform issues.
```typescript
export interface ISupportTicket extends Document {
  userId: Schema.Types.ObjectId;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
}

export const SupportTicketSchema = new Schema<ISupportTicket>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' }
}, { timestamps: true });
```

### 2.23 Coupons (`coupons`)
Promotional campaigns giving discounts.
```typescript
export interface ICoupon extends Document {
  code: string;
  discountAmount: number;
  discountType: 'percentage' | 'flat';
  expiresAt: Date;
  isActive: boolean;
}

export const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountAmount: { type: Number, required: true },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
});
```

### 2.24 Subscriptions (`subscriptions`)
Academy owner payment schedules to list premium features.
```typescript
export interface ISubscription extends Document {
  academyId: Schema.Types.ObjectId;
  planName: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled';
  expiresAt: Date;
}

export const SubscriptionSchema = new Schema<ISubscription>({
  academyId: { type: Schema.Types.ObjectId, ref: 'Academy', required: true },
  planName: { type: String, enum: ['basic', 'premium', 'enterprise'], default: 'basic' },
  status: { type: String, enum: ['active', 'past_due', 'cancelled'], default: 'active' },
  expiresAt: { type: Date, required: true }
});
```

### 2.25 Audit Logs (`auditLogs`)
Immutable records of critical mutations on dashboards.
```typescript
export interface IAuditLog extends Document {
  userId: Schema.Types.ObjectId;
  action: string;
  details: string;
  ipAddress: string;
}

export const AuditLogSchema = new Schema<IAuditLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  ipAddress: { type: String, required: true }
}, { timestamps: true });
```
