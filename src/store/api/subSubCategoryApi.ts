import { apiSlice } from './apiSlice';

export interface SubSubCategory {
  _id: string;
  subCategoryId: string | {
    _id: string;
    title: string;
    subCategoryName: string;
  };
  title: string;
  subSubCategoryName: string;
  image?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubSubCategoryRequest {
  subCategoryId: string;
  title: string;
  subSubCategoryName: string;
  image?: string;
}

export interface UpdateSubSubCategoryRequest {
  subCategoryId?: string;
  title?: string;
  subSubCategoryName?: string;
  image?: string;
}

export interface SubSubCategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SubSubCategory | SubSubCategory[];
  status: number;
}

export const subSubCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubSubCategories: builder.query<SubSubCategoryResponse, { subCategoryId?: string } | void>({
      query: (params) => {
        const queryParams = params?.subCategoryId ? `?subCategoryId=${params.subCategoryId}` : '';
        return `/Admin/getSubSubCategories${queryParams}`;
      },
      providesTags: ['SubSubCategory'],
    }),
    getSubSubCategoryDetail: builder.query<SubSubCategoryResponse, string>({
      query: (id) => `/Admin/getSubSubCategoryDetail/${id}`,
      providesTags: (result, error, id) => [{ type: 'SubSubCategory', id }],
    }),
    createSubSubCategory: builder.mutation<SubSubCategoryResponse, FormData>({
      query: (formData) => ({
        url: '/Admin/createSubSubCategory',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['SubSubCategory'],
    }),
    updateSubSubCategory: builder.mutation<SubSubCategoryResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/Admin/updateSubSubCategory/${id}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SubSubCategory', id }, 'SubSubCategory'],
    }),
    deleteSubSubCategory: builder.mutation<SubSubCategoryResponse, string>({
      query: (id) => ({
        url: `/Admin/deleteSubSubCategory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubSubCategory'],
    }),
  }),
});

export const {
  useGetSubSubCategoriesQuery,
  useGetSubSubCategoryDetailQuery,
  useCreateSubSubCategoryMutation,
  useUpdateSubSubCategoryMutation,
  useDeleteSubSubCategoryMutation,
} = subSubCategoryApi;

