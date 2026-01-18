import { apiSlice } from './apiSlice';

export interface FilterVisibility {
  _id: string;
  filterKey: string;
  filterName: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FilterVisibilityResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: FilterVisibility[];
  status: number;
}

export interface UpdateFilterVisibilityRequest {
  filters: Array<{
    filterKey: string;
    isVisible: boolean;
  }>;
}

export interface MenuFilterSetting {
  _id: string;
  menuName: string;
  menuItem: string;
  item: string;
  itemKey: string;
  items: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuFilterSettingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MenuFilterSetting[];
  status: number;
}

export interface SaveMenuFilterSettingsRequest {
  menuName: string;
  menuItem: string;
  filters: Array<{
    item: string;
    itemKey: string;
    items: string[];
  }>;
}

export interface GetMenuFilterSettingsParams {
  menuName: string;
  menuItem: string;
}

export const filterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFilterVisibility: builder.query<FilterVisibilityResponse, void>({
      query: () => '/Admin/getFilterVisibility',
      providesTags: ['Filter'],
    }),
    updateFilterVisibility: builder.mutation<FilterVisibilityResponse, UpdateFilterVisibilityRequest>({
      query: (body) => ({
        url: '/Admin/updateFilterVisibility',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Filter'],
    }),
    saveMenuFilterSettings: builder.mutation<MenuFilterSettingsResponse, SaveMenuFilterSettingsRequest>({
      query: (body) => ({
        url: '/Admin/saveMenuFilterSettings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Filter'],
    }),
    getMenuFilterSettings: builder.query<MenuFilterSettingsResponse, GetMenuFilterSettingsParams>({
      query: (params) => ({
        url: '/Admin/getMenuFilterSettings',
        params: {
          menuName: params.menuName,
          menuItem: params.menuItem,
        },
      }),
      providesTags: ['Filter'],
    }),
  }),
});

export const {
  useGetFilterVisibilityQuery,
  useUpdateFilterVisibilityMutation,
  useSaveMenuFilterSettingsMutation,
  useGetMenuFilterSettingsQuery,
} = filterApi;

