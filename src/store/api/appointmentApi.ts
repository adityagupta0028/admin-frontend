import { apiSlice } from "./apiSlice";

export interface AppointmentCustomer {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
}

export interface Appointment {
  _id: string;
  customerId?: string | AppointmentCustomer | null;
  purpose: string;
  availabilityDate: string;
  startTime: string;
  endTime: string;
  meetingId: string;
  meetingLink?: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface GetAppointmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface AppointmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    appointments: Appointment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  status: number;
}

export const appointmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query<AppointmentsResponse, GetAppointmentsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status && params.status !== "all") queryParams.append("status", params.status);

        const queryString = queryParams.toString();
        return `/Admin/getAppointments${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Appointment"],
    }),
  }),
});

export const { useGetAppointmentsQuery } = appointmentApi;
