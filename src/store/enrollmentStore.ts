import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Enrollment } from '../types';

interface EnrollmentState {
  enrollments: Enrollment[];
  setEnrollments: (enrollments: Enrollment[]) => void;
  updateEnrollment: (courseId: string, data: Partial<Enrollment>) => void;
  addEnrollment: (enrollment: Enrollment) => void;
  syncWithBackend: () => Promise<void>;
}

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set, get) => ({
      enrollments: [],
      setEnrollments: (enrollments) => set({ enrollments }),
      updateEnrollment: (courseId, data) => {
        const { enrollments } = get();
        set({
          enrollments: enrollments.map((e) =>
            e.courseId === courseId ? { ...e, ...data } : e
          ),
        });
      },
      addEnrollment: (enrollment) => {
        const { enrollments } = get();
        if (!enrollments.find((e) => e.courseId === enrollment.courseId)) {
          set({ enrollments: [...enrollments, enrollment] });
        }
      },
      syncWithBackend: async () => {
        try {
          const { api } = await import('../services/api');
          const backendEnrollments = await api.getMyEnrollments();
          set({ enrollments: backendEnrollments as any });
        } catch {
        }
      },
    }),
    { name: 'bs-enrollment-storage' }
  )
);
