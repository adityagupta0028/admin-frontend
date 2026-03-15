import { apiSlice } from "./apiSlice";

export interface CustomRingRequest {
  _id: string;
  inspirationImages: string[];
  inspirationUrl?: string;
  designRequirements: string;
  metalPreference: string;
  fullName: string;
  email: string;
  phone?: string;
  status: "New" | "In Review" | "Contacted" | "Completed" | "Closed";
  customerId?: {
    _id: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetCustomRingRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CustomRingRequestsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    requests: CustomRingRequest[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  status: number;
}

export const customRingRequestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomRingRequests: builder.query<CustomRingRequestsResponse, GetCustomRingRequestsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status && params.status !== "all") queryParams.append("status", params.status);

        const queryString = queryParams.toString();
        return `/Admin/getCustomRingRequests${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["CustomRingRequest"],
    }),
  }),
});

export const { useGetCustomRingRequestsQuery } = customRingRequestApi;
