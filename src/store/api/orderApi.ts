import { apiSlice } from './apiSlice';

export interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    product_id: string;
    product_name: string;
    images: string[];
    discounted_price?: number;
    original_price?: number;
  };
  product_id: string;
  productName: string;
  quantity: number;
  price: number;
  discountedPrice?: number;
  selectedVariant?: {
    diamond_type?: string;
    carat_weight?: string;
    metal_type?: string;
    ring_size?: number;
    necklace_size?: string;
    back_type?: string;
  };
  engraving_text?: string;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string | Customer;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentIntentId?: string;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  status: number;
}

export interface OrderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Order;
  status: number;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
}

export interface UpdateOrderStatusParams {
  id: string;
  orderStatus?: string;
  trackingNumber?: string;
}

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersResponse, GetOrdersParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
        if (params?.search) queryParams.append('search', params.search);
        
        const queryString = queryParams.toString();
        return `/Admin/getOrders${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<OrderResponse, string>({
      query: (id) => `/Admin/getOrder/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    updateOrderStatus: builder.mutation<OrderResponse, UpdateOrderStatusParams>({
      query: ({ id, ...body }) => ({
        url: `/Admin/updateOrderStatus/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Order'],
    }),
    deleteOrder: builder.mutation<OrderResponse, string>({
      query: (id) => ({
        url: `/Admin/deleteOrder/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;

