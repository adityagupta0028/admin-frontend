import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token') || '';
};

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:baseUrl+'/api/v1',
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Category', 'SubCategory', 'Auth', 'Banner', 'Product', 'Filter'],
  endpoints: () => ({}),
});


