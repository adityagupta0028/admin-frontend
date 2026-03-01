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
    getSizeScales: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getSizeScales',
    }),
    getFlexibilityTypes: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getFlexibilityTypes',
    }),
    getProductSpecials: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getProductSpecials',
    }),
    getCollections: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getCollections',
    }),
    getChainLinkTypes: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getChainLinkTypes',
    }),
    getClosureTypes: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getClosureTypes',
    }),
    getStoneSettings: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getStoneSettings',
    }),
    getPlacementFits: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getPlacementFits',
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
    getAssemblyTypes: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getAssemblyTypes',
    }),
    getChainTypes: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getChainTypes',
    }),
    getFinishDetails: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getFinishDetails',
    }),
    getUnitOfSales: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getUnitOfSales',
    }),
    getDropShapes: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getDropShapes',
    }),
    getAttachmentTypes: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getAttachmentTypes',
    }),
    getEarringOrientations: builder.query<ProductAttributeResponse, void>({
      query: () => '/Admin/getEarringOrientations',
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
  useGetSizeScalesQuery,
  useGetFlexibilityTypesQuery,
  useGetProductSpecialsQuery,
  useGetCollectionsQuery,
  useGetChainLinkTypesQuery,
  useGetClosureTypesQuery,
  useGetStoneSettingsQuery,
  useGetPlacementFitsQuery,
  useGetShankTreatmentsQuery,
  useGetStylesQuery,
  useGetSettingFeaturesQuery,
  useGetMotifThemesQuery,
  useGetOrnamentDetailsQuery,
  useGetAccentStoneShapesQuery,
  useGetAssemblyTypesQuery,
  useGetChainTypesQuery,
  useGetFinishDetailsQuery,
  useGetUnitOfSalesQuery,
  useGetDropShapesQuery,
  useGetAttachmentTypesQuery,
  useGetEarringOrientationsQuery,
} = productAttributesApi;

