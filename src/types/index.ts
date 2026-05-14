export type UserRole = 'user' | 'admin';

export type ProductCategory = 'personalizados' | 'sublimables' | 'fiestas' | 'carteleria' | 'archivos-digitales';

export type LessonType = 'video' | 'text' | 'quiz' | 'assignment' | 'file';

export type CourseLevel = 'principiante' | 'intermedio' | 'avanzado';
export type CourseModality = 'online' | 'presencial' | 'hibrido';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export type NotificationType = 'order' | 'course' | 'announcement' | 'system';

export type FAQCategory = 'envios' | 'pagos' | 'cursos' | 'devoluciones' | 'personalizados';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: ProductCategory;
  tags: string[];
  stock: number;
  isDigital: boolean;
  downloadUrl?: string;
  featured: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  expertise: string[];
  coursesCount: number;
  studentsCount: number;
  rating: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration?: string;
  videoUrl?: string;
  content?: string;
  quiz?: Quiz;
  assignment?: Assignment;
  files?: { name: string; url: string }[];
  isPreview: boolean;
  order: number;
}

export interface Topic {
  id: string;
  title: string;
  summary?: string;
  lessons: Lesson[];
  order: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  maxAttempts?: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  totalPoints: number;
  passingPoints: number;
  maxFileSize: number;
  allowedFileTypes: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  whatYouWillLearn: string[];
  requirements: string[];
  instructor: Instructor;
  price: number;
  comparePrice?: number;
  coverImage: string;
  videoPreviewUrl?: string;
  level: CourseLevel;
  duration: string;
  modality: CourseModality;
  language: string;
  certificate: boolean;
  topics: Topic[];
  includes: string[];
  tags: string[];
  rating: number;
  reviewsCount: number;
  enrolledCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  quizId: string;
  score: number;
  answers: Record<string, string | string[]>;
  attemptedAt: string;
  passed: boolean;
}

export interface AssignmentSubmission {
  assignmentId: string;
  fileName: string;
  submittedAt: string;
  status: 'pending' | 'graded';
  grade?: number;
  feedback?: string;
}

export interface Note {
  id: string;
  lessonId: string;
  content: string;
  timestamp: number;
  createdAt: string;
}

export interface Enrollment {
  courseId: string;
  userId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessons: string[];
  currentLessonId?: string;
  quizAttempts: QuizAttempt[];
  assignmentSubmissions: AssignmentSubmission[];
  notes: Note[];
  progress: number;
  completedAt?: string;
  certificateUnlocked: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  province: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export interface NotificationPreferences {
  emailMarketing: boolean;
  orderUpdates: boolean;
  courseUpdates: boolean;
  newCourses: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  bio?: string;
  addresses: Address[];
  wishlist: string[];
  enrollments: Enrollment[];
  orders: string[];
  notificationPreferences: NotificationPreferences;
  createdAt: string;
}

export interface CartItem {
  id: string;
  type: 'product' | 'course';
  itemId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  isDigital: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon?: string;
  status: OrderStatus;
  paymentMethod: 'mercadopago';
  paymentStatus: PaymentStatus;
  shippingAddress?: Address;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: string;
  maxUses: number;
  usedCount: number;
  minPurchase?: number;
  active: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  order: number;
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface QAItem {
  id: string;
  courseId: string;
  lessonId?: string;
  userId: string;
  userName: string;
  question: string;
  answers: {
    userId: string;
    userName: string;
    isInstructor: boolean;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export type ProductFilters = {
  search?: string;
  categories?: ProductCategory[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'rating';
};

export type CourseFilters = {
  search?: string;
  levels?: CourseLevel[];
  modalities?: CourseModality[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'popularity';
};
