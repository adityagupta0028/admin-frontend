import { apiSlice } from './apiSlice';

export interface Category {
  _id: string;
  title: string;
  categoryName: string;
  image?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  title: string;
  categoryName: string;
  image?: string;
}

export interface UpdateCategoryRequest {
  title?: string;
  categoryName?: string;
  image?: string;
}

export interface CategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category | Category[];
  status: number;
}

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResponse, void>({
      query: () => '/Admin/getCategories',
      providesTags: ['Category'],
    }),
    getCategoryDetail: builder.query<CategoryResponse, string>({
      query: (id) => `/Admin/getCategoryDetail/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    createCategory: builder.mutation<CategoryResponse, FormData>({
      query: (formData) => ({
        url: '/Admin/createCategory',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<CategoryResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/Admin/updateCategory/${id}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),
    deleteCategory: builder.mutation<CategoryResponse, string>({
      query: (id) => ({
        url: `/Admin/deleteCategory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryDetailQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;


