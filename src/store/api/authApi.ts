import { apiSlice } from './apiSlice';

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    _id: string;
    email: string;
    name: string;
    accessToken: string;
    role?: string;
    image?: string;
    isActive?: boolean;
  };
  status: number;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/Admin/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/Admin/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;

