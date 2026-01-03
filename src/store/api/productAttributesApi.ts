import { apiSlice } from './apiSlice';

export interface ProductAttribute {
  _id: string;
  code: string;
  displayName: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductAttributeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ProductAttribute[];
  status: number;
}

export const productAttributesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Radio button fields (single select)
    getSettingConfigurations: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getSettingConfigurations',
    }),
    getShankConfigurations: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getShankConfigurations',
    }),
    getHoldingMethods: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getHoldingMethods',
    }),
    getBandProfileShapes: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getBandProfileShapes',
    }),
    getBandWidthCategories: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getBandWidthCategories',
    }),
    getBandFits: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getBandFits',
    }),
    // Multi-select dropdown fields
    getShankTreatments: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getShankTreatments',
    }),
    getStyles: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getStyles',
    }),
    getSettingFeatures: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getSettingFeatures',
    }),
    getMotifThemes: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getMotifThemes',
    }),
    getOrnamentDetails: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getOrnamentDetails',
    }),
    getAccentStoneShapes: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getAccentStoneShapes',
    }),
  }),
});

export const {
  useGetSettingConfigurationsQuery,
  useGetShankConfigurationsQuery,
  useGetHoldingMethodsQuery,
  useGetBandProfileShapesQuery,
  useGetBandWidthCategoriesQuery,
  useGetBandFitsQuery,
  useGetShankTreatmentsQuery,
  useGetStylesQuery,
  useGetSettingFeaturesQuery,
  useGetMotifThemesQuery,
  useGetOrnamentDetailsQuery,
  useGetAccentStoneShapesQuery,
} = productAttributesApi;

