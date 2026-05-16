const API_URL = 'http://localhost:8080';

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('bs-token');
  }
  return null;
}

function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bs-token', token);
  }
}

function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bs-token');
  }
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

export const authApi = {
  login: async (email: string, password: string) => {
    const data = await request<{ token: string; email: string; nombre: string; rol: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return {
      id: email,
      name: data.nombre,
      email: data.email,
      role: data.rol.toLowerCase() === 'admin' ? 'admin' : 'user',
      password: '',
      addresses: [],
      wishlist: [],
      enrollments: [],
      orders: [],
      notificationPreferences: { emailMarketing: true, orderUpdates: true, courseUpdates: true, newCourses: false },
      createdAt: new Date().toISOString(),
    };
  },

  register: async (data: { name: string; email: string; password: string }) => {
    const result = await request<{ token: string; email: string; nombre: string; rol: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre: data.name, email: data.email, password: data.password }),
    });
    setToken(result.token);
    return {
      id: result.email,
      name: result.nombre,
      email: result.email,
      role: result.rol.toLowerCase() === 'admin' ? 'admin' : 'user',
      password: '',
      addresses: [],
      wishlist: [],
      enrollments: [],
      orders: [],
      notificationPreferences: { emailMarketing: true, orderUpdates: true, courseUpdates: true, newCourses: false },
      createdAt: new Date().toISOString(),
    };
  },

  logout: async () => {
    clearToken();
  },

  getMe: async () => {
    const data = await request<{
      id: number;
      email: string;
      nombre: string;
      apellido: string;
      telefono: string;
      rol: string;
      activo: boolean;
      enrollments: Array<{
        courseId: number;
        courseTitle: string;
        completedLessons: number[];
        progress: number;
        currentLessonId: number | null;
        lastAccessedAt: string | null;
        enrolledAt: string | null;
        completed: boolean;
        completedAt: string | null;
        certificateUnlocked: boolean;
      }>;
    }>('/api/auth/me');
    return {
      id: String(data.id),
      name: data.nombre,
      email: data.email,
      role: data.rol.toLowerCase() === 'admin' ? 'admin' : 'user',
      password: '',
      addresses: [],
      wishlist: [],
      enrollments: (data.enrollments || []).map((e: any) => ({
        courseId: String(e.courseId),
        courseTitle: e.courseTitle,
        completedLessons: e.completedLessons || [],
        progress: e.progress || 0,
        currentLessonId: e.currentLessonId ? String(e.currentLessonId) : undefined,
        lastAccessedAt: e.lastAccessedAt,
        enrolledAt: e.enrolledAt,
        completed: e.completed || false,
        completedAt: e.completedAt,
        certificateUnlocked: e.certificateUnlocked || false,
      })),
      orders: [],
      notificationPreferences: { emailMarketing: true, orderUpdates: true, courseUpdates: true, newCourses: false },
      createdAt: new Date().toISOString(),
    };
  },
};