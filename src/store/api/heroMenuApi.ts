import { apiSlice } from './apiSlice';

export interface HeroMenuVariable {
  settingConfigurations?: string[];
  shankConfigurations?: string[];
  holdingMethods?: string[];
  bandProfileShapes?: string[];
  bandWidthCategories?: string[];
  bandFits?: string[];
  shankTreatments?: string[];
  styles?: string[];
  settingFeatures?: string[];
  motifThemes?: string[];
  ornamentDetails?: string[];
}

export interface HeroMenuHeader {
  title: string;
  variables: HeroMenuVariable;
  blogs?: HeroMenuBlog[];
}

export interface HeroMenuColumn {
  columnIndex: number;
  headers: HeroMenuHeader[];
}

export interface HeroMenuBlog {
  title: string;
  link: string;
}

export interface HeroMenu {
  _id: string;
  categoryId: string | {
    _id: string;
    title: string;
    categoryName: string;
  };
  columns: HeroMenuColumn[];
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroMenuResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: HeroMenu | HeroMenu[];
  status: number;
}

export interface CreateHeroMenuRequest {
  categoryId: string;
  columns: HeroMenuColumn[];
}

export interface UpdateHeroMenuRequest {
  categoryId?: string;
  columns?: HeroMenuColumn[];
}

export const heroMenuApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroMenus: builder.query<HeroMenuResponse, void>({
      query: () => '/Admin/getHeroMenus',
      providesTags: ['HeroMenu'],
    }),
    getHeroMenuByCategory: builder.query<HeroMenuResponse, string>({
      query: (categoryId) => `/Admin/getHeroMenuByCategory/${categoryId}`,
      providesTags: (result, error, categoryId) => [{ type: 'HeroMenu', id: categoryId }],
      // Don't use cached data when category changes
      keepUnusedDataFor: 0,
    }),
    getHeroMenuDetail: builder.query<HeroMenuResponse, string>({
      query: (id) => `/Admin/getHeroMenuDetail/${id}`,
      providesTags: (result, error, id) => [{ type: 'HeroMenu', id }],
    }),
    createHeroMenu: builder.mutation<HeroMenuResponse, CreateHeroMenuRequest>({
      query: (body) => ({
        url: '/Admin/createHeroMenu',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HeroMenu'],
    }),
    updateHeroMenu: builder.mutation<HeroMenuResponse, { id: string; data: UpdateHeroMenuRequest }>({
      query: ({ id, data }) => ({
        url: `/Admin/updateHeroMenu/${id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'HeroMenu', id }, 'HeroMenu'],
    }),
    deleteHeroMenu: builder.mutation<HeroMenuResponse, string>({
      query: (id) => ({
        url: `/Admin/deleteHeroMenu/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HeroMenu'],
    }),
  }),
});

export const {
  useGetHeroMenusQuery,
  useGetHeroMenuByCategoryQuery,
  useGetHeroMenuDetailQuery,
  useCreateHeroMenuMutation,
  useUpdateHeroMenuMutation,
  useDeleteHeroMenuMutation,
} = heroMenuApi;

