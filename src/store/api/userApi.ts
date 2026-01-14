import { apiSlice } from './apiSlice';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone_number?: string;
  image?: string;
  isActive: boolean;
  role?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface UsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  status: number;
}

export interface UserResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
  status: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface AddUserParams {
  name: string;
  email: string;
  phone_number?: string;
  password?: string;
  isActive?: boolean;
  image?: string;
}

export interface UpdateUserParams {
  id: string;
  name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
  isActive?: boolean;
  image?: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, GetUsersParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status) queryParams.append('status', params.status);
        
        const queryString = queryParams.toString();
        return `/Admin/getUsers${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['User'],
    }),
    getUserById: builder.query<UserResponse, string>({
      query: (id) => `/Admin/getUserDetail/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    addUser: builder.mutation<UserResponse, FormData | AddUserParams>({
      query: (data) => {
        // Check if it's FormData (for file upload) or regular object
        const isFormData = data instanceof FormData;
        return {
          url: '/Admin/addUser',
          method: 'POST',
          body: data,
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<UserResponse, UpdateUserParams & { formData?: FormData }>({
      query: ({ id, formData, ...body }) => {
        // If formData is provided, use it (for file upload), otherwise use body
        const isFormData = formData instanceof FormData;
        if (isFormData) {
          // Add other fields to FormData
          Object.keys(body).forEach((key) => {
            if (body[key as keyof typeof body] !== undefined) {
              formData.append(key, String(body[key as keyof typeof body]));
            }
          });
        }
        return {
          url: `/Admin/updateUser/${id}`,
          method: 'POST',
          body: isFormData ? formData : body,
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    deleteUser: builder.mutation<UserResponse, string>({
      query: (id) => ({
        url: `/Admin/deleteUser/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

