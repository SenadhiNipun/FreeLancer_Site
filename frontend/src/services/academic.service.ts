import { apiClient } from "@/lib/api-client";

export const academicService = {
  getEducationLevels: async () => {
    return apiClient('/api/v1/education-levels');
  },
  
  getAcademicCategories: async () => {
    return apiClient('/api/v1/academic-categories');
  },
  
  getSpecializations: async (categoryId: number) => {
    return apiClient(`/api/v1/academic-categories/${categoryId}/specializations`);
  }
};
