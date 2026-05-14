import type {
  Product, Course, User, FAQItem, Review, Notification, QAItem, Order,
  Address, Enrollment, ProductFilters, CourseFilters, CartItem, NotificationPreferences
} from '../types';
import {
  products, courses, users, faqs, reviews, coupons, notifications, qas, orders
} from '../data/mocks';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let mockProducts = [...products];
let mockCourses = [...courses];
let mockUsers = [...users];
let mockFaqs = [...faqs];
let mockReviews = [...reviews];
let mockCoupons = [...coupons];
let mockNotifications = [...notifications];
let mockQAs = [...qas];
let mockOrders = [...orders];
let nextId = 1000;

const generateId = () => `mock-${++nextId}`;

export const api = {
  // Products
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    await delay(); // TODO: reemplazar por fetch real
    let result = [...mockProducts];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)));
    }
    if (filters?.categories?.length) {
      result = result.filter((p) => filters.categories!.includes(p.category));
    }
    if (filters?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters?.inStock) {
      result = result.filter((p) => p.stock > 0);
    }
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc': result.sort((a, b) => a.price - b.price); break;
        case 'price-desc': result.sort((a, b) => b.price - a.price); break;
        case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
        case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      }
    }
    return result;
  },

  getProductBySlug: async (slug: string): Promise<Product | undefined> => {
    await delay(); // TODO: reemplazar por fetch real
    return mockProducts.find((p) => p.slug === slug);
  },

  createProduct: async (product: Omit<Product, 'id' | 'slug' | 'createdAt'>): Promise<Product> => {
    await delay(800); // TODO: reemplazar por fetch real
    const newProduct: Product = {
      ...product,
      id: generateId(),
      slug: product.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    await delay(800); // TODO: reemplazar por fetch real
    const idx = mockProducts.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Producto no encontrado');
    mockProducts[idx] = { ...mockProducts[idx], ...data };
    return mockProducts[idx];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(600); // TODO: reemplazar por fetch real
    mockProducts = mockProducts.filter((p) => p.id !== id);
  },

  // Courses
  getCourses: async (filters?: CourseFilters): Promise<Course[]> => {
    await delay(); // TODO: reemplazar por fetch real
    let result = [...mockCourses];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q)));
    }
    if (filters?.levels?.length) {
      result = result.filter((c) => filters.levels!.includes(c.level));
    }
    if (filters?.modalities?.length) {
      result = result.filter((c) => filters.modalities!.includes(c.modality));
    }
    if (filters?.minPrice !== undefined) {
      result = result.filter((c) => c.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter((c) => c.price <= filters.maxPrice!);
    }
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc': result.sort((a, b) => a.price - b.price); break;
        case 'price-desc': result.sort((a, b) => b.price - a.price); break;
        case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
        case 'rating': result.sort((a, b) => b.rating - a.rating); break;
        case 'popularity': result.sort((a, b) => b.enrolledCount - a.enrolledCount); break;
      }
    }
    return result;
  },

  getCourseBySlug: async (slug: string): Promise<Course | undefined> => {
    await delay(); // TODO: reemplazar por fetch real
    return mockCourses.find((c) => c.slug === slug);
  },

  createCourse: async (course: Omit<Course, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
    await delay(800); // TODO: reemplazar por fetch real
    const newCourse: Course = {
      ...course,
      id: generateId(),
      slug: course.title.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCourses.push(newCourse);
    return newCourse;
  },

  updateCourse: async (id: string, data: Partial<Course>): Promise<Course> => {
    await delay(800); // TODO: reemplazar por fetch real
    const idx = mockCourses.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Curso no encontrado');
    mockCourses[idx] = { ...mockCourses[idx], ...data, updatedAt: new Date().toISOString() };
    return mockCourses[idx];
  },

  deleteCourse: async (id: string): Promise<void> => {
    await delay(600); // TODO: reemplazar por fetch real
    mockCourses = mockCourses.filter((c) => c.id !== id);
  },

  getCourseProgress: async (courseId: string, userId: string): Promise<Enrollment | undefined> => {
    await delay(); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.id === userId);
    return user?.enrollments.find((e) => e.courseId === courseId);
  },

  updateLessonProgress: async (courseId: string, userId: string, lessonId: string, completed: boolean): Promise<Enrollment> => {
    await delay(600); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');
    const enrollment = user.enrollments.find((e) => e.courseId === courseId);
    if (!enrollment) throw new Error('No estás inscripto en este curso');
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) throw new Error('Curso no encontrado');
    const allLessons = course.topics.flatMap((t) => t.lessons);
    if (completed && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    } else if (!completed) {
      enrollment.completedLessons = enrollment.completedLessons.filter((id) => id !== lessonId);
    }
    enrollment.progress = Math.round((enrollment.completedLessons.length / allLessons.length) * 100);
    enrollment.currentLessonId = lessonId;
    enrollment.lastAccessedAt = new Date().toISOString();
    if (enrollment.progress >= 80 && !enrollment.completedAt) {
      enrollment.completedAt = new Date().toISOString();
      enrollment.certificateUnlocked = true;
    }
    return enrollment;
  },

  submitQuiz: async (courseId: string, userId: string, quizId: string, answers: Record<string, string | string[]>): Promise<{ score: number; passed: boolean }> => {
    await delay(800); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');
    const enrollment = user.enrollments.find((e) => e.courseId === courseId);
    if (!enrollment) throw new Error('No estás inscripto en este curso');
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) throw new Error('Curso no encontrado');
    const quiz = course.topics.flatMap((t) => t.lessons).find((l) => l.quiz?.id === quizId)?.quiz;
    if (!quiz) throw new Error('Quiz no encontrado');
    let score = 0;
    quiz.questions.forEach((q) => {
      const answer = answers[q.id];
      if (Array.isArray(q.correctAnswer)) {
        if (Array.isArray(answer) && answer.every((a) => q.correctAnswer.includes(a))) score += q.points;
      } else {
        if (answer === q.correctAnswer) score += q.points;
      }
    });
    const passed = score >= quiz.passingScore;
    enrollment.quizAttempts.push({ quizId, score, answers, attemptedAt: new Date().toISOString(), passed });
    return { score, passed };
  },

  submitAssignment: async (courseId: string, userId: string, assignmentId: string, fileName: string): Promise<void> => {
    await delay(800); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');
    const enrollment = user.enrollments.find((e) => e.courseId === courseId);
    if (!enrollment) throw new Error('No estás inscripto en este curso');
    enrollment.assignmentSubmissions.push({ assignmentId, fileName, submittedAt: new Date().toISOString(), status: 'pending' });
  },

  addNote: async (courseId: string, userId: string, lessonId: string, content: string, timestamp: number): Promise<void> => {
    await delay(400); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');
    const enrollment = user.enrollments.find((e) => e.courseId === courseId);
    if (!enrollment) throw new Error('No estás inscripto en este curso');
    enrollment.notes.push({ id: generateId(), lessonId, content, timestamp, createdAt: new Date().toISOString() });
  },

  getNotes: async (courseId: string, userId: string): Promise<import('../types').Note[]> => {
    await delay(); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.id === userId);
    return user?.enrollments.find((e) => e.courseId === courseId)?.notes ?? [];
  },

  // Auth
  login: async (email: string, password: string): Promise<User> => {
    await delay(800); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Credenciales incorrectas');
    return { ...user, password: '' };
  },

  register: async (data: { name: string; email: string; password: string }): Promise<User> => {
    await delay(1000); // TODO: reemplazar por fetch real
    if (mockUsers.some((u) => u.email === data.email)) throw new Error('El email ya está registrado');
    const newUser: User = {
      id: generateId(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
      addresses: [],
      wishlist: [],
      enrollments: [],
      orders: [],
      notificationPreferences: { emailMarketing: true, orderUpdates: true, courseUpdates: true, newCourses: false },
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return { ...newUser, password: '' };
  },

  logout: async (): Promise<void> => {
    await delay(200); // TODO: reemplazar por fetch real
  },

  getCurrentUser: async (userId: string): Promise<User | undefined> => {
    await delay(); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.id === userId);
    return user ? { ...user, password: '' } : undefined;
  },

  recoverPassword: async (email: string): Promise<void> => {
    await delay(800); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.email === email);
    if (!user) throw new Error('No existe una cuenta con ese email');
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await delay(800); // TODO: reemplazar por fetch real
    const idx = mockUsers.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('Usuario no encontrado');
    mockUsers[idx] = { ...mockUsers[idx], ...data };
    return { ...mockUsers[idx], password: '' };
  },

  // Cart & Orders
  createOrder: async (userId: string, items: CartItem[], shippingAddress?: Address, coupon?: string): Promise<Order> => {
    await delay(1000); // TODO: reemplazar por fetch real
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = items.some((i) => !i.isDigital) ? 1500 : 0;
    let discount = 0;
    if (coupon) {
      const cp = mockCoupons.find((c) => c.code === coupon);
      if (cp && cp.active && cp.discountType === 'percentage') {
        discount = Math.round(subtotal * (cp.discountValue / 100));
      }
    }
    const order: Order = {
      id: generateId(),
      orderNumber: `BS-${String(mockOrders.length + 1).padStart(3, '0')}`,
      userId,
      items,
      subtotal,
      discount,
      shipping,
      total: subtotal + shipping - discount,
      coupon,
      status: 'pending',
      paymentMethod: 'mercadopago',
      paymentStatus: 'pending',
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockOrders.push(order);
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      user.orders.push(order.id);
      items.forEach((item) => {
        if (item.type === 'course') {
          const course = mockCourses.find((c) => c.id === item.itemId);
          if (course && !user.enrollments.find((e) => e.courseId === item.itemId)) {
            const firstLesson = course.topics[0]?.lessons[0]?.id;
            user.enrollments.push({
              courseId: item.itemId,
              userId,
              enrolledAt: new Date().toISOString(),
              lastAccessedAt: new Date().toISOString(),
              completedLessons: [],
              currentLessonId: firstLesson,
              quizAttempts: [],
              assignmentSubmissions: [],
              notes: [],
              progress: 0,
              certificateUnlocked: false,
            });
          }
        }
      });
    }
    return order;
  },

  getMyOrders: async (userId: string): Promise<Order[]> => {
    await delay(); // TODO: reemplazar por fetch real
    return mockOrders.filter((o) => o.userId === userId);
  },

  getOrderById: async (orderId: string): Promise<Order | undefined> => {
    await delay(); // TODO: reemplazar por fetch real
    return mockOrders.find((o) => o.id === orderId);
  },

  getAllOrders: async (): Promise<Order[]> => {
    await delay(); // TODO: reemplazar por fetch real
    return [...mockOrders];
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    await delay(600); // TODO: reemplazar por fetch real
    const idx = mockOrders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Orden no encontrada');
    mockOrders[idx] = { ...mockOrders[idx], status, updatedAt: new Date().toISOString() };
    return mockOrders[idx];
  },

  validateCoupon: async (code: string): Promise<{ valid: boolean; discount: number; message?: string }> => {
    await delay(400); // TODO: reemplazar por fetch real
    const coupon = mockCoupons.find((c) => c.code === code);
    if (!coupon) return { valid: false, discount: 0, message: 'Cupón no encontrado' };
    if (!coupon.active) return { valid: false, discount: 0, message: 'Cupón inactivo' };
    if (new Date(coupon.validUntil) < new Date()) return { valid: false, discount: 0, message: 'Cupón vencido' };
    if (coupon.usedCount >= coupon.maxUses) return { valid: false, discount: 0, message: 'Cupón agotado' };
    const discount = coupon.discountType === 'percentage' ? coupon.discountValue : coupon.discountValue;
    return { valid: true, discount };
  },

  // Wishlist
  toggleWishlist: async (userId: string, itemId: string): Promise<string[]> => {
    await delay(400); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');
    if (user.wishlist.includes(itemId)) {
      user.wishlist = user.wishlist.filter((id) => id !== itemId);
    } else {
      user.wishlist.push(itemId);
    }
    return user.wishlist;
  },

  getWishlist: async (userId: string): Promise<string[]> => {
    await delay(); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.id === userId);
    return user?.wishlist ?? [];
  },

  // Reviews & Q&A
  getReviews: async (targetId: string): Promise<Review[]> => {
    await delay(); // TODO: reemplazar por fetch real
    return mockReviews.filter((r) => r.userId === targetId || r.id.startsWith(targetId));
  },

  createReview: async (review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    await delay(600); // TODO: reemplazar por fetch real
    const newReview: Review = { ...review, id: generateId(), createdAt: new Date().toISOString() };
    mockReviews.push(newReview);
    return newReview;
  },

  getQAs: async (courseId: string): Promise<QAItem[]> => {
    await delay(); // TODO: reemplazar por fetch real
    return mockQAs.filter((qa) => qa.courseId === courseId);
  },

  createQuestion: async (data: Omit<QAItem, 'id' | 'answers' | 'createdAt'>): Promise<QAItem> => {
    await delay(600); // TODO: reemplazar por fetch real
    const newQA: QAItem = { ...data, id: generateId(), answers: [], createdAt: new Date().toISOString() };
    mockQAs.push(newQA);
    return newQA;
  },

  answerQuestion: async (qaId: string, answer: QAItem['answers'][0]): Promise<QAItem> => {
    await delay(600); // TODO: reemplazar por fetch real
    const qa = mockQAs.find((q) => q.id === qaId);
    if (!qa) throw new Error('Pregunta no encontrada');
    qa.answers.push(answer);
    return qa;
  },

  // Notifications
  getNotifications: async (userId: string): Promise<Notification[]> => {
    await delay(); // TODO: reemplazar por fetch real
    return mockNotifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await delay(200); // TODO: reemplazar por fetch real
    const n = mockNotifications.find((x) => x.id === notificationId);
    if (n) n.read = true;
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    await delay(400); // TODO: reemplazar por fetch real
    mockNotifications.forEach((n) => { if (n.userId === userId) n.read = true; });
  },

  updateNotificationPreferences: async (userId: string, prefs: NotificationPreferences): Promise<void> => {
    await delay(400); // TODO: reemplazar por fetch real
    const user = mockUsers.find((u) => u.id === userId);
    if (user) user.notificationPreferences = prefs;
  },

  // FAQs
  getFAQs: async (): Promise<FAQItem[]> => {
    await delay(); // TODO: reemplazar por fetch real
    return [...mockFaqs];
  },

  // Admin stats
  getAdminStats: async (): Promise<{ totalSales: number; newStudents: number; activeCourses: number; productsSold: number }> => {
    await delay(); // TODO: reemplazar por fetch real
    const totalSales = mockOrders.reduce((sum, o) => sum + o.total, 0);
    const newStudents = mockUsers.reduce((sum, u) => sum + u.enrollments.length, 0);
    return { totalSales, newStudents, activeCourses: mockCourses.length, productsSold: mockOrders.reduce((sum, o) => sum + o.items.filter((i) => i.type === 'product').reduce((s, i) => s + i.quantity, 0), 0) };
  },

  getRecentActivity: async (): Promise<{ id: string; type: string; message: string; createdAt: string }[]> => {
    await delay(); // TODO: reemplazar por fetch real
    return mockOrders.slice(-5).map((o) => ({
      id: o.id,
      type: 'order',
      message: `Nueva orden ${o.orderNumber} por $${o.total}`,
      createdAt: o.createdAt,
    }));
  },

  getTopCourses: async (): Promise<{ courseId: string; title: string; sales: number; students: number }[]> => {
    await delay(); // TODO: reemplazar por fetch real
    return mockCourses.map((c) => ({
      courseId: c.id,
      title: c.title,
      sales: c.enrolledCount * c.price,
      students: c.enrolledCount,
    })).sort((a, b) => b.sales - a.sales).slice(0, 5);
  },
};
