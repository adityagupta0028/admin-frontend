import { apiSlice } from './apiSlice';

export interface SubCategory {
  _id: string;
  categoryId: string | {
    _id: string;
    title: string;
    categoryName: string;
  };
  title: string;
  subCategoryName: string;
  image?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubCategoryRequest {
  categoryId: string;
  title: string;
  subCategoryName: string;
  image?: string;
}

export interface UpdateSubCategoryRequest {
  categoryId?: string;
  title?: string;
  subCategoryName?: string;
  image?: string;
}

export interface SubCategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SubCategory | SubCategory[];
  status: number;
}

export const subCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategories: builder.query<SubCategoryResponse, { categoryId?: string } | void>({
      query: (params) => {
        const queryParams = params?.categoryId ? `?categoryId=${params.categoryId}` : '';
        return `/Admin/getSubCategories${queryParams}`;
      },
      providesTags: ['SubCategory'],
    }),
    getSubCategoryDetail: builder.query<SubCategoryResponse, string>({
      query: (id) => `/Admin/getSubCategoryDetail/${id}`,
      providesTags: (result, error, id) => [{ type: 'SubCategory', id }],
    }),
    createSubCategory: builder.mutation<SubCategoryResponse, FormData>({
      query: (formData) => ({
        url: '/Admin/createSubCategory',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['SubCategory'],
    }),
    updateSubCategory: builder.mutation<SubCategoryResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/Admin/updateSubCategory/${id}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SubCategory', id }, 'SubCategory'],
    }),
    deleteSubCategory: builder.mutation<SubCategoryResponse, string>({
      query: (id) => ({
        url: `/Admin/deleteSubCategory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubCategory'],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useGetSubCategoryDetailQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;


