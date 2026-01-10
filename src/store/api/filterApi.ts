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
  }),
});

export const {
  useGetFilterVisibilityQuery,
  useUpdateFilterVisibilityMutation,
} = filterApi;

