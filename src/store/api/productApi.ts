import { apiSlice } from './apiSlice';

export interface Product {
  variants: any;
  _id: string;
  product_id: string;
  product_name: string;
  description?: string;
  average_rating?: number;
  review_count?: number;
  original_price?: number;
  discounted_price: number;
  discount_label?: string;
  promotion_label?: string;
  promotion_end_date?: string;
  metal_type: string | string[];
  metal_code?: string;
  metal_price?: number;
  diamond_origin: string | string[];
  carat_weight?: number | number[];
  diamond_quality?: string | string[];
  diamond_color_grade?: string;
  diamond_clarity_grade?: string;
  ring_size?: number | number[];
  necklace_size?: string | string[];
  engraving_text?: string;
  engraving_allowed?: boolean;
  back_type?: string;
  matching_band_available?: boolean;
  matching_band_product_id?: string | null;
  product_type?: string;
  collection_name?: string;
  categoryId: string | string[] | {
    _id: string;
    title: string;
    categoryName: string;
  } | Array<{
    _id: string;
    title: string;
    categoryName: string;
  }>;
  subCategoryId: string | string[] | {
    _id: string;
    title: string;
    subCategoryName: string;
  } | Array<{
    _id: string;
    title: string;
    subCategoryName: string;
  }>;
  product_details?: string;
  center_stone_details?: string;
  side_stone_details?: string;
  stone_details?: string;
  images: string[];
  videos?: string[];
  status: string;
  tags?: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Product | Product[];
  status: number;
}

export interface GetProductsParams {
  categoryId?: string;
  subCategoryId?: string;
  status?: string;
  product_type?: string;
  metal_type?: string;
  diamond_origin?: string;
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductResponse, GetProductsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
        if (params?.subCategoryId) queryParams.append('subCategoryId', params.subCategoryId);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.product_type) queryParams.append('product_type', params.product_type);
        if (params?.metal_type) queryParams.append('metal_type', params.metal_type);
        if (params?.diamond_origin) queryParams.append('diamond_origin', params.diamond_origin);
        
        const queryString = queryParams.toString();
        return `/Admin/getProducts${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Product'],
    }),
    getProductDetail: builder.query<ProductResponse, string>({
      query: (id) => `/Admin/getProductDetail/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getProductByProductId: builder.query<ProductResponse, string>({
      query: (productId) => `/Admin/getProductByProductId/${productId}`,
      providesTags: (result, error, productId) => [{ type: 'Product', productId }],
    }),
    createProduct: builder.mutation<ProductResponse, FormData>({
      query: (formData) => ({
        url: '/Admin/createProduct',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<ProductResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/Admin/updateProduct/${id}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),
    deleteProduct: builder.mutation<ProductResponse, string>({
      query: (id) => ({
        url: `/Admin/deleteProduct/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailQuery,
  useGetProductByProductIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

