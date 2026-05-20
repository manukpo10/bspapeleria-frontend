import type {
  Product, Course, User, Order, CartItem, Address,
  ProductFilters, CourseFilters
} from '../types';

const API_URL = 'https://bspapeleria-backend.onrender.com';

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('bs-token');
  }
  return null;
}

async function authRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Error ${response.status}`);
  }

  return response.json();
}

function mapBackendProduct(data: any): Product {
  return {
    id: String(data.id),
    slug: data.slug,
    name: data.nombre,
    description: data.descripcion || '',
    shortDescription: data.descripcionCorta || '',
    price: data.precio,
    comparePrice: data.precioComparacion,
    images: data.imagenes || [],
    category: data.categoria?.replace(/_/g, '-') ?? '',
    tags: data.tags || [],
    stock: data.stock || 0,
    isDigital: data.esDigital || false,
    downloadUrl: data.urlDescarga,
    featured: data.destacado || false,
    rating: data.rating || 0,
    reviewsCount: data.reviewsCount || 0,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

function mapBackendCourse(data: any): Course {
  return {
    id: String(data.id),
    slug: data.slug,
    title: data.titulo,
    description: data.descripcion || '',
    shortDescription: data.descripcion || '',
    whatYouWillLearn: [],
    requirements: [],
    instructor: {
      id: '',
      name: data.instructor || 'Instructor',
      avatar: data.instructorAvatar || 'https://ui-avatars.com/api/?name=Instructor&background=e8d5f0&color=6b5b95',
      bio: '',
      expertise: [],
      coursesCount: 0,
      studentsCount: data.estudiantesCount || 0,
      rating: data.rating || 0,
    },
    price: data.precio,
    comparePrice: data.precioComparacion,
    coverImage: data.imagenUrl || '',
    videoPreviewUrl: data.urlVideoIntro,
    level: data.nivel || 'principiante',
    duration: data.duracionHoras ? `${data.duracionHoras}h` : '',
    modality: data.modalidad === 'video' ? 'online' : data.modalidad === 'texto' ? 'presencial' : 'hibrido',
    language: 'es',
    certificate: true,
    topics: (data.modulos || []).map((m: any) => ({
      id: String(m.id),
      title: m.titulo,
      summary: m.descripcion || '',
      lessons: (m.lecciones || []).map((l: any) => ({
        id: String(l.id),
        title: l.titulo,
        type: l.urlVideo ? 'video' : 'text' as const,
        duration: l.duracionMinutos ? `${l.duracionMinutos}min` : undefined,
        videoUrl: l.urlVideo,
        content: l.contenido,
        isPreview: l.esPreview || false,
        order: l.orden,
        files: l.urlMaterial ? [{ name: decodeURIComponent(l.urlMaterial.split('/').pop() || 'Material'), url: l.urlMaterial }] : undefined,
      })),
      order: m.orden || 0,
    })),
    includes: [],
    tags: data.tags || [],
    courseMaterials: (data.materialUrls || []).map((url: string) => ({
      name: decodeURIComponent(url.split('/').pop() || '') || 'Material',
      url,
    })),
    rating: data.rating || 0,
    reviewsCount: 0,
    enrolledCount: data.estudiantesCount || 0,
    featured: data.destacado || false,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.createdAt || new Date().toISOString(),
  };
}

function mapBackendOrder(data: any): Order {
  return {
    id: String(data.id),
    orderNumber: data.numeroOrden,
    userId: '',
    items: (data.detalles || []).map((d: any) => ({
      id: String(d.id),
      type: d.tipoItem === 'PRODUCTO' ? 'product' : 'course',
      itemId: d.itemId,
      name: d.nombre || '',
      image: d.imagenUrl || '',
      price: d.precioUnitario || 0,
      quantity: d.cantidad || 1,
      isDigital: d.tipoItem === 'CURSO',
    })),
    subtotal: data.subtotal || 0,
    discount: data.descuento || 0,
    shipping: data.costoEnvio || 0,
    total: data.total || 0,
    coupon: '',
    status: mapOrderStatus(data.estado),
    paymentMethod: 'mercadopago',
    paymentStatus: mapPaymentStatus(data.estadoPago),
    shippingAddress: data.direccionEnvio ? {
      id: '',
      fullName: '',
      street: data.direccionEnvio.calle || '',
      city: data.direccionEnvio.ciudad || '',
      province: data.direccionEnvio.provincia || '',
      zipCode: data.direccionEnvio.codigoPostal || '',
      phone: data.direccionEnvio.telefono || '',
      isDefault: false,
    } : undefined,
    trackingNumber: '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.createdAt || new Date().toISOString(),
  };
}

function mapOrderStatus(backendStatus: string): 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' {
  const statusMap: Record<string, Order['status']> = {
    PENDIENTE: 'pending',
    CONFIRMADA: 'paid',
    ENVIADA: 'shipped',
    ENTREGADA: 'delivered',
    CANCELADA: 'cancelled',
  };
  return statusMap[backendStatus] || 'pending';
}

function mapPaymentStatus(backendStatus: string): 'pending' | 'approved' | 'rejected' {
  const statusMap: Record<string, Order['paymentStatus']> = {
    PENDIENTE: 'pending',
    APROBADO: 'approved',
    RECHAZADO: 'rejected',
    REEMBOLSADO: 'rejected',
  };
  return statusMap[backendStatus] || 'pending';
}

export const api = {
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.categories?.length) params.set('categories', filters.categories.map(c => c.replace(/-/g, '_')).join(','));
    if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    params.set('page', '0');
    params.set('size', '50');

    const data = await authRequest<{ content: any[] }>(`/api/productos?${params.toString()}`);
    return data.content.map(mapBackendProduct);
  },

  getProductBySlug: async (slug: string): Promise<Product | undefined> => {
    const data = await authRequest<any>(`/api/productos/${slug}`);
    return mapBackendProduct(data);
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const data = await authRequest<any>(`/api/productos/id/${id}`);
    return mapBackendProduct(data);
  },

  createProduct: async (product: Omit<Product, 'id' | 'slug' | 'createdAt'>): Promise<Product> => {
    const payload = {
      nombre: product.name,
      descripcion: product.description,
      descripcionCorta: product.shortDescription,
      precio: product.price,
      precioComparacion: product.comparePrice,
      imagenes: product.images,
      categoria: product.category?.replace(/-/g, '_') ?? '',
      tags: product.tags,
      stock: product.stock,
      esDigital: product.isDigital,
      urlDescarga: product.downloadUrl,
      destacado: product.featured,
    };
    return authRequest<any>('/api/productos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(mapBackendProduct);
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const payload = {
      nombre: data.name,
      descripcion: data.description,
      descripcionCorta: data.shortDescription,
      precio: data.price,
      precioComparacion: data.comparePrice,
      imagenes: data.images,
      categoria: data.category?.replace(/-/g, '_') ?? '',
      tags: data.tags,
      stock: data.stock,
      esDigital: data.isDigital,
      urlDescarga: data.downloadUrl,
      destacado: data.featured,
    };
    return authRequest<any>(`/api/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }).then(mapBackendProduct);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await authRequest<void>(`/api/productos/${id}`, { method: 'DELETE' });
  },

  getCourses: async (filters?: CourseFilters): Promise<Course[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.levels?.length) params.set('nivel', filters.levels.join(','));
    if (filters?.modalities?.length) params.set('modalidad', filters.modalities.join(','));
    if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    params.set('page', '0');
    params.set('size', '50');

    const data = await authRequest<{ content: any[] }>(`/api/cursos?${params.toString()}`);
    return data.content.map(mapBackendCourse);
  },

  getCourseBySlug: async (slug: string): Promise<Course | undefined> => {
    const data = await authRequest<any>(`/api/cursos/${slug}`);
    return mapBackendCourse(data);
  },

  getCourseById: async (id: string): Promise<Course | undefined> => {
    const data = await authRequest<any>(`/api/cursos/id/${id}`);
    return mapBackendCourse(data);
  },

  createCourse: async (course: Omit<Course, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
    const payload = {
      titulo: course.title,
      descripcion: course.description,
      imagenUrl: course.coverImage,
      precio: course.price,
      precioComparacion: course.comparePrice,
      nivel: course.level,
      modalidad: course.modality === 'online' ? 'video' : course.modality === 'presencial' ? 'texto' : 'mixto',
      instructor: typeof course.instructor === 'object' ? course.instructor.name : '',
      duracionHoras: course.duration ? parseInt(course.duration) : null,
      urlVideoIntro: course.videoPreviewUrl,
      tags: course.tags,
      materialUrls: course.courseMaterials?.map((m) => m.url) || [],
      modulos: (course.topics || []).map((topic, ti) => ({
        titulo: topic.title,
        descripcion: topic.summary || '',
        orden: ti,
        lecciones: (topic.lessons || []).map((lesson, li) => ({
          titulo: lesson.title,
          contenido: lesson.content || '',
          urlVideo: lesson.videoUrl || undefined,
          urlMaterial: undefined,
          orden: li,
          duracionMinutos: lesson.duration ? parseInt(lesson.duration) : 0,
          esPreview: lesson.isPreview || false,
        })),
      })),
    };
    return authRequest<any>('/api/cursos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(mapBackendCourse);
  },

  updateCourse: async (id: string, data: Partial<Course>): Promise<Course> => {
    const payload = {
      titulo: data.title,
      descripcion: data.description,
      imagenUrl: data.coverImage,
      precio: data.price,
      precioComparacion: data.comparePrice,
      nivel: data.level,
      modalidad: data.modality === 'online' ? 'video' : data.modality === 'presencial' ? 'texto' : 'mixto',
      instructor: typeof data.instructor === 'object' ? data.instructor.name : '',
      duracionHoras: data.duration ? parseInt(data.duration) : null,
      urlVideoIntro: data.videoPreviewUrl,
      tags: data.tags,
      materialUrls: data.courseMaterials?.map((m: { url: string }) => m.url) || [],
      modulos: (data.topics || []).map((topic, ti) => ({
        titulo: topic.title,
        descripcion: topic.summary || '',
        orden: ti,
        lecciones: (topic.lessons || []).map((lesson, li) => ({
          titulo: lesson.title,
          contenido: lesson.content || '',
          urlVideo: lesson.videoUrl || undefined,
          urlMaterial: undefined,
          orden: li,
          duracionMinutos: lesson.duration ? parseInt(lesson.duration) : 0,
          esPreview: lesson.isPreview || false,
        })),
      })),
    };
    return authRequest<any>(`/api/cursos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }).then(mapBackendCourse);
  },

  deleteCourse: async (id: string): Promise<void> => {
    await authRequest<void>(`/api/cursos/${id}`, { method: 'DELETE' });
  },

  getCourseProgress: async (courseId: string): Promise<any> => {
    const data = await authRequest<any>(`/api/progreso/${courseId}`);
    return {
      courseId: String(data.cursoId),
      enrolledAt: data.fechaInscripcion,
      lastAccessedAt: data.ultimaActividad,
      completedLessons: data.leccionesCompletadas || [],
      currentLessonId: data.leccionActualId ? String(data.leccionActualId) : undefined,
      progress: data.porcentajeProgreso || 0,
      completedAt: data.fechaCompletado,
      certificateUnlocked: data.certificadoDesbloqueado || false,
    };
  },

  enrollInCourse: async (courseId: string): Promise<any> => {
    const data = await authRequest<any>(`/api/progreso/${courseId}/inscribirse`, { method: 'POST' });
    return data;
  },

  markLessonComplete: async (courseId: string, lessonId: string): Promise<any> => {
    const data = await authRequest<any>(`/api/progreso/${courseId}/leccion/${lessonId}`, { method: 'PUT' });
    return {
      courseId: String(data.cursoId),
      completedLessons: data.leccionesCompletadas || [],
      progress: data.porcentajeProgreso || 0,
      currentLessonId: data.leccionActualId ? String(data.leccionActualId) : undefined,
      lastAccessedAt: data.ultimaActividad,
      enrolledAt: data.fechaInscripcion,
      completed: data.completado || false,
      completedAt: data.fechaCompletado,
      certificateUnlocked: data.certificadoDesbloqueado || false,
    };
  },

  updateLessonProgress: async (courseId: string, userId: string, lessonId: string, completed: boolean): Promise<any> => {
    const data = await authRequest<any>(`/api/progreso/${courseId}/leccion/${lessonId}`, { method: 'PUT' });
    return {
      courseId: String(data.cursoId),
      completedLessons: data.leccionesCompletadas || [],
      progress: data.porcentajeProgreso || 0,
      currentLessonId: data.leccionActualId ? String(data.leccionActualId) : undefined,
      lastAccessedAt: data.ultimaActividad,
      enrolledAt: data.fechaInscripcion,
      completed: data.completado || false,
      completedAt: data.fechaCompletado,
      certificateUnlocked: data.certificadoDesbloqueado || false,
    };
  },

  getMyProgresos: async (): Promise<any[]> => {
    const data = await authRequest<any[]>('/api/progreso');
    return data;
  },

  login: async (email: string, password: string): Promise<User> => {
    const data = await authRequest<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('bs-token', data.token);
    return {
      id: String(data.userId || data.id),
      name: data.nombre || email.split('@')[0],
      email: data.email,
      password: '',
      role: data.rol === 'ADMIN' ? 'admin' : 'user',
      addresses: [],
      wishlist: [],
      enrollments: [],
      orders: [],
      notificationPreferences: { emailMarketing: true, orderUpdates: true, courseUpdates: true, newCourses: false },
      createdAt: new Date().toISOString(),
    };
  },

  register: async (data: { name: string; email: string; password: string }): Promise<User> => {
    const result = await authRequest<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre: data.name, email: data.email, password: data.password }),
    });
    localStorage.setItem('bs-token', result.token);
    return {
      id: String(result.userId || result.id),
      name: data.name,
      email: data.email,
      password: '',
      role: 'user',
      addresses: [],
      wishlist: [],
      enrollments: [],
      orders: [],
      notificationPreferences: { emailMarketing: true, orderUpdates: true, courseUpdates: true, newCourses: false },
      createdAt: new Date().toISOString(),
    };
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('bs-token');
  },

  getCurrentUser: async (): Promise<User | undefined> => {
    const data = await authRequest<any>('/api/auth/me');
    return {
      id: String(data.id),
      name: data.nombre || data.email?.split('@')[0] || 'Usuario',
      email: data.email,
      password: '',
      role: data.rol === 'ADMIN' ? 'admin' : 'user',
      phone: data.telefono,
      addresses: [],
      wishlist: [],
      enrollments: [],
      orders: [],
      notificationPreferences: { emailMarketing: true, orderUpdates: true, courseUpdates: true, newCourses: false },
      createdAt: data.fechaCreacion || new Date().toISOString(),
    };
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const result = await authRequest<any>(`/api/usuarios/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return result;
  },

  createOrder: async (items: CartItem[], shippingAddress?: Address, coupon?: string): Promise<Order> => {
    const payload = {
      items: items.map(item => ({
        tipo: item.type === 'product' ? 'PRODUCTO' : 'CURSO',
        itemId: item.itemId,
        cantidad: item.quantity,
        nombre: item.name,
        imagenUrl: item.image,
        precioUnitario: item.price,
      })),
      codigoCupon: coupon,
      metodoPago: 'MERCADO_PAGO',
      direccionEnvio: shippingAddress ? {
        calle: shippingAddress.street,
        numero: '',
        ciudad: shippingAddress.city,
        provincia: shippingAddress.province,
        codigoPostal: shippingAddress.zipCode,
        telefono: shippingAddress.phone,
      } : undefined,
    };
    const data = await authRequest<any>('/api/ordenes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapBackendOrder(data);
  },

  getMyOrders: async (): Promise<Order[]> => {
    const data = await authRequest<{ content: any[] }>('/api/ordenes?page=0&size=50');
    return data.content.map(mapBackendOrder);
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    const data = await authRequest<any>(`/api/ordenes/${id}`);
    return mapBackendOrder(data);
  },

  getAllOrders: async (): Promise<Order[]> => {
    const data = await authRequest<{ content: any[] }>('/api/ordenes/admin?page=0&size=100');
    return data.content.map(mapBackendOrder);
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const data = await authRequest<any>(`/api/ordenes/${id}/estado?estado=${status}`, { method: 'PUT' });
    return mapBackendOrder(data);
  },

  getCart: async (): Promise<CartItem[]> => {
    const data = await authRequest<any>('/api/carrito');
    return (data.items || []).map((item: any) => ({
      id: String(item.id),
      type: item.tipoItem === 'PRODUCTO' ? 'product' : 'course',
      itemId: item.itemId,
      name: item.nombre || '',
      image: item.imagenUrl || '',
      price: item.precioUnitario || 0,
      quantity: item.cantidad || 1,
      isDigital: item.tipoItem === 'CURSO',
    }));
  },

  addToCart: async (type: 'product' | 'course', itemId: string, quantity: number): Promise<void> => {
    await authRequest('/api/carrito/items', {
      method: 'POST',
      body: JSON.stringify({ tipo: type.toUpperCase(), itemId, cantidad: quantity }),
    });
  },

  updateCartItem: async (type: 'product' | 'course', itemId: string, quantity: number): Promise<void> => {
    await authRequest('/api/carrito/items', {
      method: 'PUT',
      body: JSON.stringify({ tipo: type.toUpperCase(), itemId, cantidad: quantity }),
    });
  },

  removeFromCart: async (type: 'product' | 'course', itemId: string): Promise<void> => {
    await authRequest(`/api/carrito/items/${type.toUpperCase()}/${itemId}`, { method: 'DELETE' });
  },

  clearCart: async (): Promise<void> => {
    await authRequest('/api/carrito', { method: 'DELETE' });
  },

  validateCoupon: async (code: string, montoTotal: number = 0): Promise<{ valid: boolean; discount: number; message?: string }> => {
    try {
      const data = await authRequest<any>(`/api/cupones/validar?codigo=${code}&montoTotal=${montoTotal}`);
      const discount = data.tipoDescuento === 'PORCENTAJE'
        ? montoTotal * (data.valorDescuento / 100)
        : data.valorDescuento;
      return { valid: true, discount, message: 'Cupón válido' };
    } catch (e: any) {
      return { valid: false, discount: 0, message: e.message };
    }
  },

  getAllCoupons: async (): Promise<any[]> => {
    const data = await authRequest<{ content: any[] }>('/api/cupones?page=0&size=100');
    return data.content.map((c: any) => ({
      id: String(c.id),
      code: c.codigo,
      discountType: c.tipoDescuento === 'PORCENTAJE' ? 'percentage' : 'fixed',
      discountValue: c.valorDescuento,
      validUntil: c.fechaVencimiento,
      maxUses: c.maxUsos,
      usedCount: c.usosCount,
      active: c.activo,
    }));
  },

  createCoupon: async (coupon: any): Promise<any> => {
    const payload = {
      codigo: coupon.code,
      tipoDescuento: coupon.discountType === 'percentage' ? 'PORCENTAJE' : 'MONTO_FIJO',
      valorDescuento: coupon.discountValue,
      maxUsos: coupon.maxUses,
    };
    return authRequest('/api/cupones', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await authRequest(`/api/cupones/${id}`, { method: 'DELETE' });
  },

  getReviews: async (productId: string): Promise<any[]> => {
    const data = await authRequest<{ content: any[] }>(`/api/valoraciones?entidadTipo=PRODUCTO&entidadId=${productId}&page=0&size=50`);
    return (data.content || []).map((r: any) => ({
      id: String(r.id),
      userId: String(r.usuarioId),
      userName: r.nombreUsuario || 'Usuario',
      userAvatar: '',
      rating: r.calificacion,
      comment: r.comentario || '',
      createdAt: r.createdAt,
    }));
  },

  createReview: async (productId: string, rating: number, comment: string): Promise<any> => {
    const data = await authRequest<any>('/api/valoraciones', {
      method: 'POST',
      body: JSON.stringify({
        entidadTipo: 'PRODUCTO',
        entidadId: parseInt(productId),
        calificacion: rating,
        comentario: comment,
      }),
    });
    return {
      id: String(data.id),
      userId: String(data.usuarioId),
      userName: data.nombreUsuario || 'Usuario',
      rating: data.calificacion,
      comment: data.comentario || '',
      createdAt: data.createdAt,
    };
  },

  createMercadoPagoPreference: async (items: any[], payerEmail: string, ordenId: string): Promise<{ preferenceId: string; initPoint: string; sandboxInitPoint: string }> => {
    return authRequest('/api/pagos/mercado-pago/crear', {
      method: 'POST',
      body: JSON.stringify({
        items: items.map(item => ({
          title: item.name || item.title,
          description: '',
          pictureUrl: item.image || '',
          quantity: item.quantity || 1,
          unitPrice: item.price,
          currencyId: 'ARS',
        })),
        payerEmail,
        ordenId,
      }),
    });
  },

  getAdminStats: async (): Promise<{ totalSales: number; newStudents: number; activeCourses: number; productsSold: number }> => {
    return authRequest('/api/admin/stats');
  },

  getAllUsers: async (): Promise<any[]> => {
    const data = await authRequest<{ content: any[] }>('/api/admin/usuarios?page=0&size=100');
    return data.content.map((u: any) => ({
      id: String(u.id),
      name: u.nombre,
      email: u.email,
      role: u.rol === 'ADMIN' ? 'admin' : 'user',
      active: u.activo,
      createdAt: u.fechaCreacion,
    }));
  },

  updateUserRole: async (userId: string, role: 'admin' | 'user'): Promise<void> => {
    await authRequest(`/api/admin/usuarios/${userId}/rol?rol=${role}`, { method: 'PUT' });
  },

  getMyEnrollments: async (): Promise<any[]> => {
    const data = await authRequest<any[]>('/api/progreso');
    return data.map((p: any) => ({
      courseId: String(p.cursoId),
      courseTitle: p.tituloCurso,
      completedLessons: p.leccionesCompletadas || [],
      progress: p.porcentajeProgreso || 0,
      currentLessonId: p.leccionActualId ? String(p.leccionActualId) : undefined,
      lastAccessedAt: p.ultimaActividad,
      enrolledAt: p.fechaInscripcion,
      completed: p.completado || false,
      completedAt: p.fechaCompletado,
      certificateUnlocked: p.certificadoDesbloqueado || false,
    }));
  },
};