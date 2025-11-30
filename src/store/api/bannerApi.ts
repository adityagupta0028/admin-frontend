import { apiSlice } from './apiSlice';

export interface Banner {
  _id: string;
  homePageBanner1?: string;
  homePageBanner2?: string;
  bannerPage3?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Banner | Banner[];
  status: number;
}

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query<BannerResponse, void>({
      query: () => '/Admin/getAllBanner',
      providesTags: ['Banner'],
    }),
    getBannerById: builder.query<BannerResponse, string>({
      query: (id) => `/Admin/getBannerById/${id}`,
      providesTags: (result, error, id) => [{ type: 'Banner', id }],
    }),
    addBanner: builder.mutation<BannerResponse, FormData>({
      query: (formData) => ({
        url: '/Admin/addBanner',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Banner'],
    }),
    updateBanner: builder.mutation<BannerResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/Admin/updateBanner/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Banner', id }, 'Banner'],
    }),
    deleteBanner: builder.mutation<BannerResponse, string>({
      query: (id) => ({
        url: `/Admin/deleteBanner/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useGetBannerByIdQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;

