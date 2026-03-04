import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Search, Plus, Edit, Trash2, Eye, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { MultiSelect } from "../ui/multi-select";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  Product,
  ProductVariant,
  ProductMetalImage,
  useGetProductDetailQuery,
} from "../../store/api/productApi";
import { useGetCategoriesQuery } from "../../store/api/categoryApi";
import { useGetSubCategoriesQuery } from "../../store/api/subCategoryApi";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import AddProduct from "./AddProduct";
import AddBraceletsProduct from "./AddBraceletsProduct";
import AddNecklaceProduct from "./AddNecklaceProduct";
import AddEarringsProduct from "./AddEarringsProduct";
import { ProductTypeSelector } from "./ProductTypeSelector";

interface ProductFormData {
  product_id: string;
  product_name: string;
  description?: string;
  original_price?: number;
  discounted_price?: number;
  discount_label?: string;
  promotion_label?: string;
  metal_type: string[]; // multiple
  metal_code?: string;
  metal_price?: number;
  diamond_origin: string[]; // multiple
  carat_weight?: number[]; // multiple
  diamond_quality?: string[]; // multiple
  diamond_color_grade?: string;
  diamond_clarity_grade?: string;
  ring_size?: number[]; // multiple
  necklace_size?: string[]; // multiple
  engraving_text?: string;
  engraving_allowed?: boolean;
  back_type?: string;
  matching_band_available?: boolean;
  matching_band_product_id?: string | null;
  product_type?: string;
  collection_name?: string;
  categoryId: string; // single select
  subCategoryId: string[]; // multiple
  product_details?: string;
  center_stone_details?: string;
  side_stone_details?: string;
  stone_details?: string;
  status?: string;
  tags?: string;
  images?: FileList;
}

type EditableVariantRow = ProductVariant & {
  // Ensure price fields are always numbers for editing
  price: number;
  discounted_price: number;
};

type MetalImageUpload = {
  metal_type: string;
  shape?: string;
  view_angle: string;
  file: File;
};

type CenterStoneConfigItem = {
  stone: string;
  diamond_origin?: string;
  diamond_shapes?: string[];
  min_diamond_weight?: string;
  quantity?: string;
  average_color?: string;
  color_quality?: string;
  average_clarity?: string;
  dimensions?: string;
  gemstone_type?: string;
  holding_methods?: string[];
};

type SideStoneConfigItem = CenterStoneConfigItem;

export function ProductManagement() {
  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<"Rings" | "Bracelets" | "Necklace" | "Earrings">("Rings");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Multiple numeric/text list states (used with badges + "Add" inputs)
  const [caratWeights, setCaratWeights] = useState<number[]>([]);
  const [ringSizes, setRingSizes] = useState<number[]>([]);
  const [necklaceSizes, setNecklaceSizes] = useState<string[]>([]);
  const [newCaratWeight, setNewCaratWeight] = useState<string>("");
  const [newRingSize, setNewRingSize] = useState<string>("");
  const [newNecklaceSize, setNewNecklaceSize] = useState<string>("");

  // Product details configuration (edit)
  const [editProductDetails, setEditProductDetails] = useState<string>("");
  const [editAverageWidth, setEditAverageWidth] = useState<string>("");
  const [editRhodiumPlate, setEditRhodiumPlate] = useState<"Yes" | "No">("Yes");

  // Variants & metal images for edit modal
  const [variantRows, setVariantRows] = useState<EditableVariantRow[]>([]);
  const [existingMetalImages, setExistingMetalImages] = useState<ProductMetalImage[]>([]);
  const [metalImageUploads, setMetalImageUploads] = useState<MetalImageUpload[]>([]);
  const [centerStoneConfig, setCenterStoneConfig] = useState<CenterStoneConfigItem[]>([]);
  const [sideStoneConfig, setSideStoneConfig] = useState<SideStoneConfigItem[]>([]);
  // API hooks
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const { data: subCategoriesResponse } = useGetSubCategoriesQuery(
    selectedCategoryId ? { categoryId: selectedCategoryId } : undefined
  );

  const queryParams: any = {};
  if (selectedCategory !== "all") queryParams.categoryId = selectedCategory;
  if (selectedSubCategory !== "all") queryParams.subCategoryId = selectedSubCategory;
  if (selectedStatus && selectedStatus !== "All") queryParams.status = selectedStatus;

  const { data: productsResponse, isLoading, refetch } = useGetProductsQuery(queryParams);
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const categories = (Array.isArray(categoriesResponse?.data) ? categoriesResponse?.data : []) as any[];
  const subCategories = (Array.isArray(subCategoriesResponse?.data) ? subCategoriesResponse?.data : []) as any[];
  const products = (productsResponse?.data as Product[]) || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      product_id: "",
      product_name: "",
      description: "",
      metal_type: [],
      diamond_origin: [],
      diamond_quality: [],
      categoryId: "",
      subCategoryId: [],
      carat_weight: [],
      ring_size: [],
      necklace_size: [],
      status: "Active",
    },
  });

  const watchedImages = watch("images");

  // When categoryId changes, set selectedCategoryId (for subcategory API) and reset subcategories when empty
  const watchedCategoryId = watch("categoryId");
  useEffect(() => {
    if (watchedCategoryId) {
      setSelectedCategoryId(watchedCategoryId);
    } else {
      setSelectedCategoryId("");
      setValue("subCategoryId", []);
    }
  }, [watchedCategoryId, setValue]);

  // Image previews
  useEffect(() => {
    if (watchedImages && watchedImages.length > 0) {
      const previews: string[] = [];
      Array.from(watchedImages).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === watchedImages.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setImagePreviews([]);
    }
  }, [watchedImages]);

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.product_name?.toLowerCase().includes(searchLower) ||
      product.product_id?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    );
  });

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("product_id", data.product_id);
      formData.append("product_name", data.product_name);
      if (data.description) formData.append("description", data.description);
      if (data.original_price !== undefined)
        formData.append("original_price", data.original_price.toString());
      formData.append("discounted_price", data.discounted_price.toString());
      if (data.discount_label) formData.append("discount_label", data.discount_label);
      if (data.promotion_label) formData.append("promotion_label", data.promotion_label);

      // Multiple arrays (already arrays from RHF)
      (data.metal_type || []).forEach((type) => formData.append("metal_type", type));
      if (data.metal_code) formData.append("metal_code", data.metal_code);
      if (data.metal_price !== undefined)
        formData.append("metal_price", data.metal_price.toString());

      (data.diamond_origin || []).forEach((origin) =>
        formData.append("diamond_origin", origin)
      );
      (data.carat_weight || []).forEach((weight) =>
        formData.append("carat_weight", weight.toString())
      );
      (data.diamond_quality || []).forEach((quality) =>
        formData.append("diamond_quality", quality)
      );

      if (data.diamond_color_grade)
        formData.append("diamond_color_grade", data.diamond_color_grade);
      if (data.diamond_clarity_grade)
        formData.append("diamond_clarity_grade", data.diamond_clarity_grade);

      (data.ring_size || []).forEach((size) =>
        formData.append("ring_size", size.toString())
      );
      (data.necklace_size || []).forEach((size) =>
        formData.append("necklace_size", size)
      );

      if (data.engraving_text) formData.append("engraving_text", data.engraving_text);
      if (data.engraving_allowed !== undefined)
        formData.append("engraving_allowed", data.engraving_allowed.toString());
      if (data.back_type) formData.append("back_type", data.back_type);
      if (data.matching_band_available !== undefined)
        formData.append(
          "matching_band_available",
          data.matching_band_available.toString()
        );
      if (data.matching_band_available && data.matching_band_product_id) {
        formData.append(
          "matching_band_product_id",
          data.matching_band_product_id
        );
      }
      if (data.product_type) formData.append("product_type", data.product_type);
      if (data.collection_name)
        formData.append("collection_name", data.collection_name);

      if (data.categoryId) {
        formData.append("categoryId", data.categoryId);
      }
      (data.subCategoryId || []).forEach((subCatId) =>
        formData.append("subCategoryId", subCatId)
      );

      if (data.product_details)
        formData.append("product_details", data.product_details);
      if (data.center_stone_details)
        formData.append("center_stone_details", data.center_stone_details);
      if (data.side_stone_details)
        formData.append("side_stone_details", data.side_stone_details);
      if (data.stone_details)
        formData.append("stone_details", data.stone_details);
      if (data.status) formData.append("status", data.status);
      if (data.tags) formData.append("tags", data.tags);

      // Images
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => {
          formData.append("images", file);
        });
      }

      await createProduct(formData).unwrap();
      toast.success("Product created successfully!");
      setIsAddOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create product");
    }
  };

  const populateEditFormFromProduct = useCallback(
    (product: Product) => {
      // Category / Subcategory ids (single category now)
      const categoryId = Array.isArray(product.categoryId)
        ? product.categoryId.length > 0
          ? typeof product.categoryId[0] === "string"
            ? product.categoryId[0]
            : (product.categoryId[0] as any)._id
          : ""
        : typeof product.categoryId === "string"
        ? (product.categoryId as string)
        : ((product.categoryId as any)?._id as string) || "";

      const subCategoryIds = Array.isArray(product.subCategoryId)
        ? product.subCategoryId.map((sub: any) =>
            typeof sub === "string" ? sub : sub._id
          )
        : product.subCategoryId
        ? [
            typeof product.subCategoryId === "string"
              ? product.subCategoryId
              : (product.subCategoryId as any)._id,
          ]
        : [];

      setValue("product_id", product.product_id);
      setValue("product_name", product.product_name);
      setValue("description", product.description || "");
      setValue("original_price", product.original_price);
      setValue("discounted_price", product.discounted_price);
      setValue("discount_label", product.discount_label || "");
      setValue("promotion_label", product.promotion_label || "");

      // Array fields
      const metalTypesArray = Array.isArray(product.metal_type)
        ? product.metal_type
        : product.metal_type
        ? [product.metal_type as string]
        : [];
      setValue("metal_type", metalTypesArray);

      const diamondOriginsArray = Array.isArray(product.diamond_origin)
        ? product.diamond_origin
        : product.diamond_origin
        ? [product.diamond_origin as string]
        : [];
      setValue("diamond_origin", diamondOriginsArray);

      const caratWeightsArray = Array.isArray(product.carat_weight)
        ? (product.carat_weight as number[])
        : product.carat_weight !== undefined
        ? [product.carat_weight as number]
        : [];
      setCaratWeights(caratWeightsArray);
      setValue("carat_weight", caratWeightsArray);

      const diamondQualitiesArray = Array.isArray(product.diamond_quality)
        ? product.diamond_quality
        : product.diamond_quality
        ? [product.diamond_quality as string]
        : [];
      setValue("diamond_quality", diamondQualitiesArray);

      const ringSizesArray = Array.isArray(product.ring_size)
        ? (product.ring_size as number[])
        : product.ring_size !== undefined
        ? [product.ring_size as number]
        : [];
      setRingSizes(ringSizesArray);
      setValue("ring_size", ringSizesArray);

      const necklaceSizesArray = Array.isArray(product.necklace_size)
        ? (product.necklace_size as string[])
        : product.necklace_size
        ? [product.necklace_size as string]
        : [];
      setNecklaceSizes(necklaceSizesArray);
      setValue("necklace_size", necklaceSizesArray);

      setValue("metal_code", product.metal_code || "");
      setValue("metal_price", product.metal_price);
      setValue("diamond_color_grade", product.diamond_color_grade || "");
      setValue("diamond_clarity_grade", product.diamond_clarity_grade || "");
      setValue("engraving_text", product.engraving_text || "");
      setValue("engraving_allowed", product.engraving_allowed);
      setValue("back_type", product.back_type || "");
      setValue("matching_band_available", product.matching_band_available);
      setValue(
        "matching_band_product_id",
        product.matching_band_product_id || null
      );
      setValue("product_type", product.product_type || "");
      setValue("collection_name", product.collection_name || "");
      setValue("product_details", product.product_details || "");
      setValue("center_stone_details", product.center_stone_details || "");
      setValue("side_stone_details", product.side_stone_details || "");
      setValue("stone_details", product.stone_details || "");
      setValue("categoryId", categoryId);
      setValue("subCategoryId", subCategoryIds);
      setValue("status", product.status);
      if (product.tags)
        setValue(
          "tags",
          Array.isArray(product.tags) ? product.tags.join(", ") : product.tags
        );

      setSelectedCategoryId(categoryId);

      // Product details configuration
      const pdConfig: any = (product as any).productDetailsConfiguration || {};
      setEditProductDetails(
        pdConfig.product_details || product.product_details || ""
      );
      setEditAverageWidth(pdConfig.average_width || "");
      setEditRhodiumPlate((pdConfig.rhodium_plate as "Yes" | "No") || "Yes");

      // Center / Side stone configurations (advanced)
      const rawCenter = (product as any).centerStoneDetailsConfiguration || [];
      const rawSide = (product as any).sideStoneDetailsConfiguration || [];
      setCenterStoneConfig(
        Array.isArray(rawCenter)
          ? rawCenter.map((c: any) => ({
              stone: c.stone,
              diamond_origin: c.diamond_origin || "",
              diamond_shapes: c.diamond_shapes || [],
              min_diamond_weight: c.min_diamond_weight || "",
              quantity: c.quantity || "",
              average_color: c.average_color || "",
              color_quality: c.color_quality || "",
              average_clarity: c.average_clarity || "",
              dimensions: c.dimensions || "",
              gemstone_type: c.gemstone_type || "",
              holding_methods: c.holding_methods || [],
            }))
          : []
      );
      setSideStoneConfig(
        Array.isArray(rawSide)
          ? rawSide.map((c: any) => ({
              stone: c.stone,
              diamond_origin: c.diamond_origin || "",
              diamond_shapes: c.diamond_shapes || [],
              min_diamond_weight: c.min_diamond_weight || "",
              quantity: c.quantity || "",
              average_color: c.average_color || "",
              color_quality: c.color_quality || "",
              average_clarity: c.average_clarity || "",
              dimensions: c.dimensions || "",
              gemstone_type: c.gemstone_type || "",
              holding_methods: c.holding_methods || [],
            }))
          : []
      );

      // Variants (for editable prices)
      const mappedVariants: EditableVariantRow[] = (product.variants || []).map(
        (v: ProductVariant) => ({
          diamond_type: v.diamond_type,
          carat_weight: v.carat_weight,
          metal_type: v.metal_type,
          diamond_quality: v.diamond_quality || "",
          shape: v.shape || "",
          price: typeof v.price === "number" ? v.price : Number(v.price ?? 0),
          discounted_price:
            typeof v.discounted_price === "number"
              ? v.discounted_price
              : Number(v.discounted_price ?? 0),
        })
      );
      setVariantRows(mappedVariants);

      // Metal images (existing)
      setExistingMetalImages(product.metal_images || []);
      setMetalImageUploads([]);

      // Existing images
      if (product.images && product.images.length > 0) {
        const previews = product.images.map((img) => getImageUrl(img));
        setImagePreviews(previews);
      } else {
        setImagePreviews([]);
      }
    },
    [
      setValue,
      setSelectedCategoryId,
      setCaratWeights,
      setRingSizes,
      setNecklaceSizes,
      setVariantRows,
      setExistingMetalImages,
      setMetalImageUploads,
      setImagePreviews,
    ]
  );

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    populateEditFormFromProduct(product);
    setIsEditOpen(true);
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!selectedProduct) return;

    try {
      const formData = new FormData();

      if (data.product_id) formData.append("product_id", data.product_id);
      if (data.product_name) formData.append("product_name", data.product_name);
      if (data.description !== undefined)
        formData.append("description", data.description || "");
      if (data.original_price !== undefined)
        formData.append(
          "original_price",
          data.original_price?.toString() || ""
        );
      if (data.discounted_price)
        formData.append("discounted_price", data.discounted_price.toString());
      if (data.discount_label !== undefined)
        formData.append("discount_label", data.discount_label || "");
      if (data.promotion_label !== undefined)
        formData.append("promotion_label", data.promotion_label || "");

      (data.metal_type || []).forEach((type) =>
        formData.append("metal_type", type)
      );
      if (data.metal_code !== undefined)
        formData.append("metal_code", data.metal_code || "");
      if (typeof data.metal_price === "number" && !Number.isNaN(data.metal_price)) {
        // Only send when > 0; if user clears or leaves as 0, omit so backend keeps existing
        if (data.metal_price > 0) {
          formData.append("metal_price", data.metal_price.toString());
        }
      }

      (data.diamond_origin || []).forEach((origin) =>
        formData.append("diamond_origin", origin)
      );
      (data.carat_weight || []).forEach((weight) =>
        formData.append("carat_weight", weight.toString())
      );
      (data.diamond_quality || []).forEach((quality) =>
        formData.append("diamond_quality", quality)
      );

      if (data.diamond_color_grade !== undefined)
        formData.append(
          "diamond_color_grade",
          data.diamond_color_grade || ""
        );
      if (data.diamond_clarity_grade !== undefined)
        formData.append(
          "diamond_clarity_grade",
          data.diamond_clarity_grade || ""
        );

      (data.ring_size || []).forEach((size) =>
        formData.append("ring_size", size.toString())
      );
      (data.necklace_size || []).forEach((size) =>
        formData.append("necklace_size", size)
      );

      if (data.engraving_text !== undefined)
        formData.append("engraving_text", data.engraving_text || "");
      if (data.engraving_allowed !== undefined)
        formData.append(
          "engraving_allowed",
          data.engraving_allowed.toString()
        );
      if (data.back_type !== undefined)
        formData.append("back_type", data.back_type || "");
      if (data.matching_band_available !== undefined)
        formData.append(
          "matching_band_available",
          data.matching_band_available.toString()
        );
      if (data.matching_band_available && data.matching_band_product_id) {
        formData.append(
          "matching_band_product_id",
          data.matching_band_product_id
        );
      }
      if (data.product_type !== undefined)
        formData.append("product_type", data.product_type || "");
      if (data.collection_name !== undefined)
        formData.append("collection_name", data.collection_name || "");

      if (data.categoryId) {
        formData.append("categoryId", data.categoryId);
      }
      (data.subCategoryId || []).forEach((subCatId) =>
        formData.append("subCategoryId", subCatId)
      );

      if (data.product_details !== undefined)
        formData.append("product_details", data.product_details || "");
      // Advanced stone configuration fields are not editable in this UI anymore,
      // so we avoid sending them to prevent validation errors and unintended updates.
      if (data.status != null && data.status !== "")
        formData.append("status", String(data.status));
      if (data.tags) formData.append("tags", data.tags);

      // Variants - send updated prices as JSON (backend parses this)
      if (variantRows.length > 0) {
        const cleaned = variantRows
          .filter(
            (v) =>
              typeof v.price === "number" &&
              v.price > 0 &&
              typeof v.discounted_price === "number" &&
              v.discounted_price > 0
          )
          .map((v) => ({
            diamond_type: v.diamond_type,
            carat_weight: v.carat_weight,
            metal_type: v.metal_type,
            diamond_quality: v.diamond_quality || "",
            shape: v.shape || "",
            price: Number(v.price),
            discounted_price: Number(v.discounted_price),
          }));

        if (cleaned.length > 0) {
          formData.append("variants", JSON.stringify(cleaned));
        }
      }

      // New images
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => {
          formData.append("images", file);
        });
      }

      // Metal images - upload replacements if any were chosen
      if (metalImageUploads.length > 0) {
        metalImageUploads.forEach((entry) => {
          const fieldName = `metal_images_${entry.metal_type.replace(/\s+/g, "_")}_${
            (entry.shape || "").replace(/\s+/g, "_")
          }_${entry.view_angle.replace(/\s+/g, "_")}`;
          formData.append(fieldName, entry.file);
        });
      }

      await updateProduct({ id: selectedProduct._id, formData }).unwrap();
      toast.success("Product updated successfully!");
      setIsEditOpen(false);
      setSelectedProduct(null);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update product");
    }
  };

  const handleViewClick = (product: Product) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProduct(selectedProduct._id).unwrap();
      toast.success("Product deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedProduct(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  const resetForm = () => {
    reset();
    setImagePreviews([]);
    setSelectedCategoryId("");
    setCaratWeights([]);
    setRingSizes([]);
    setNecklaceSizes([]);
    setNewCaratWeight("");
    setNewRingSize("");
    setNewNecklaceSize("");
    setVariantRows([]);
    setExistingMetalImages([]);
    setMetalImageUploads([]);
    setEditProductDetails("");
    setEditAverageWidth("");
    setEditRhodiumPlate("Yes");
    setCenterStoneConfig([]);
    setSideStoneConfig([]);
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    resetForm();
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedProduct(null);
    resetForm();
  };

  const getImageUrl = (imagePath: string) => {
    return `${
      import.meta.env.VITE_API_URL || "http://localhost:8081"
    }${imagePath}`;
  };

  // Get default product image - prioritize "Angled view" from metal_images
  const getDefaultProductImage = (product: Product): string | null => {
    // First, try to get "Angled view" from metal_images
    if (product.metal_images && product.metal_images.length > 0) {
      const angledViewImage = product.metal_images.find(
        (img) => img.view_angle === "Angled view"
      );
      if (angledViewImage) {
        return getImageUrl(angledViewImage.image);
      }
      // If no Angled view, get the first metal image
      if (product.metal_images[0]?.image) {
        return getImageUrl(product.metal_images[0].image);
      }
    }
    // Fallback to regular images
    if (product.images && product.images.length > 0) {
      return getImageUrl(product.images[0]);
    }
    return null;
  };

  const getCategoryName = (product: Product) => {
    console.log("product.categoryId=====>", product);
    if (typeof product.categoryId === "string") {
      const category = categories.find(
        (cat: any) => cat._id === product.categoryId
      );
      return category ? category?.categoryName : "Unknown";
    }
    return (product.categoryId as any)[0]?.categoryName;
  };

  const getSubCategoryName = (product: Product) => {
    if (typeof product.subCategoryId === "string") {
      const subCategory = subCategories.find(
        (subCat: any) => subCat._id === product.subCategoryId
      );
      return subCategory ? subCategory.subCategoryName : "Unknown";
    }
    return (product.subCategoryId as any).subCategoryName;
  };

  const watchedMatchingBand = watch("matching_band_available");
  const watchedProductType = watch("product_type");
  const watchedStatus = watch("status");

  // Fetch full product detail when a product is selected for editing
  const { data: productDetailResponse } = useGetProductDetailQuery(
    selectedProduct?._id ?? "",
    {
      skip: !selectedProduct?._id,
    }
  );

  useEffect(() => {
    if (productDetailResponse && (productDetailResponse.data as any)?._id) {
      populateEditFormFromProduct(productDetailResponse.data as Product);
    }
  }, [productDetailResponse, populateEditFormFromProduct]);

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Product Management</h1>
          <p className="text-gray-500 mt-1">
            Manage your jewelry collection and inventory
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:opacity-90"
          onClick={() => setIsTypeSelectorOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.length > 0 &&
                  categories.map((category: any) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getDefaultProductImage(product) ? (
                          <ImageWithFallback
                            src={getDefaultProductImage(product)!}
                            alt={product.product_name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              No Image
                            </span>
                          </div>
                        )}
                        <span>{product.product_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {product.product_id}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {getCategoryName(product)}
                      {/* {getSubCategoryName(product)} */}
                    </TableCell>
                    <TableCell>
                      <div>
                        {product.variants && product.variants.length > 0 && (
                          <span className="text-gray-400 line-through mr-2">
                            ${product.variants[0]?.price?.toFixed(2)}
                          </span>
                        )}
                       
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          product.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : product.status === "Inactive"
                            ? "bg-gray-50 text-gray-700 border-gray-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewClick(product)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product Type Selector Modal */}
      <ProductTypeSelector
        show={isTypeSelectorOpen}
        handleClose={() => setIsTypeSelectorOpen(false)}
        onSelectType={(type) => {
          setSelectedProductType(type);
          setIsAddOpen(true);
        }}
      />

      {/* Add Product Modal */}
      {isAddOpen && selectedProductType === "Rings" && (
        <AddProduct
          show={isAddOpen}
          handleClose={handleCloseAdd}
          categories={categories}
          subCategories={subCategories}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
      {isAddOpen && selectedProductType === "Bracelets" && (
        <AddBraceletsProduct
          show={isAddOpen}
          handleClose={handleCloseAdd}
          categories={categories}
          subCategories={subCategories}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
      {isAddOpen && selectedProductType === "Necklace" && (
        <AddNecklaceProduct
          show={isAddOpen}
          handleClose={handleCloseAdd}
          categories={categories}
          subCategories={subCategories}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
      {isAddOpen && selectedProductType === "Earrings" && (
        <AddEarringsProduct
          show={isAddOpen}
          handleClose={handleCloseAdd}
          categories={categories}
          subCategories={subCategories}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Edit Product Modal */}
      <Dialog open={isEditOpen} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(
              (data) => {
                handleUpdateProduct(data);
              },
              (errors) => {
                console.log("Edit form validation errors", errors);
              }
            )}
          >
            <div className="grid gap-4 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_product_id">Product ID</Label>
                  <Input id="edit_product_id" {...register("product_id")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_product_name">Product Name</Label>
                  <Input
                    id="edit_product_name"
                    {...register("product_name")}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  {...register("description")}
                  rows={3}
                />
              </div>

              {/* Category & SubCategory */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category - Single Select */}
                <div className="grid gap-2">
                  <Label>Category *</Label>
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCategoryId(value);
                          setValue("subCategoryId", []);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat: any) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* SubCategory */}
                <div className="grid gap-2">
                  <Label>SubCategory (Multiple)</Label>
                  <Controller
                    control={control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <MultiSelect
                        options={subCategories.map((subCat: any) => ({
                          label: subCat.subCategoryName,
                          value: subCat._id,
                        }))}
                        selected={field.value}
                        onSelectionChange={field.onChange}
                        placeholder={
                          !watchedCategoryId
                            ? "Select category first"
                            : "Select subcategories..."
                        }
                        disabled={
                          !watchedCategoryId ||
                          subCategories.length === 0
                        }
                      />
                    )}
                  />
                </div>
              </div>

              {/* Metal & Diamond - Multiple */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Metal Type (Multiple)</Label>
                  <Controller
                    control={control}
                    name="metal_type"
                    render={({ field }) => (
                      <MultiSelect
                        options={[
                          { label: "14K White Gold", value: "14K White Gold" },
                          { label: "14K Yellow Gold", value: "14K Yellow Gold" },
                          { label: "14K Rose Gold", value: "14K Rose Gold" },
                          { label: "18K White Gold", value: "18K White Gold" },
                          { label: "18K Yellow Gold", value: "18K Yellow Gold" },
                          { label: "18K Rose Gold", value: "18K Rose Gold" },
                          { label: "Platinum", value: "Platinum" },
                        ]}
                        selected={field.value}
                        onSelectionChange={field.onChange}
                        placeholder="Select metal types..."
                      />
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Diamond Origin (Multiple)</Label>
                  <Controller
                    control={control}
                    name="diamond_origin"
                    render={({ field }) => (
                      <MultiSelect
                        options={[
                          { label: "Natural", value: "Natural" },
                          { label: "Lab Grown", value: "Lab Grown" },
                        ]}
                        selected={field.value}
                        onSelectionChange={field.onChange}
                        placeholder="Select diamond origins..."
                      />
                    )}
                  />
                </div>
              </div>

              {/* Carat Weight - Multiple */}
              <div className="grid gap-2">
                <Label>Carat Weight (Multiple)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter carat weight"
                    value={newCaratWeight}
                    onChange={(e) => setNewCaratWeight(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const weight = parseFloat(newCaratWeight);
                        if (
                          weight > 0 &&
                          !caratWeights.includes(weight)
                        ) {
                          const updated = [...caratWeights, weight];
                          setCaratWeights(updated);
                          setValue("carat_weight", updated);
                          setNewCaratWeight("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const weight = parseFloat(newCaratWeight);
                      if (weight > 0 && !caratWeights.includes(weight)) {
                        const updated = [...caratWeights, weight];
                        setCaratWeights(updated);
                        setValue("carat_weight", updated);
                        setNewCaratWeight("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {caratWeights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {caratWeights.map((weight, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {weight}ct
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => {
                            const updated = caratWeights.filter(
                              (_, i) => i !== idx
                            );
                            setCaratWeights(updated);
                            setValue("carat_weight", updated);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Diamond Quality - Multiple */}
              <div className="grid gap-2">
                <Label>Diamond Quality (Multiple)</Label>
                <Controller
                  control={control}
                  name="diamond_quality"
                  render={({ field }) => (
                    <MultiSelect
                      options={[
                        { label: "Best - D, VVS", value: "Best - D, VVS" },
                        { label: "Better - E, VS1", value: "Better - E, VS1" },
                        { label: "Good - F, VS2", value: "Good - F, VS2" },
                      ]}
                      selected={field.value || []}
                      onSelectionChange={field.onChange}
                      placeholder="Select diamond qualities..."
                    />
                  )}
                />
              </div>

              {/* Ring Size - Multiple */}
              <div className="grid gap-2">
                <Label>Ring Size (Multiple)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="3"
                    max="10"
                    placeholder="Enter ring size (3-10)"
                    value={newRingSize}
                    onChange={(e) => setNewRingSize(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const size = parseInt(newRingSize);
                        if (
                          size >= 3 &&
                          size <= 10 &&
                          !ringSizes.includes(size)
                        ) {
                          const updated = [...ringSizes, size];
                          setRingSizes(updated);
                          setValue("ring_size", updated);
                          setNewRingSize("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const size = parseInt(newRingSize);
                      if (
                        size >= 3 &&
                        size <= 10 &&
                        !ringSizes.includes(size)
                      ) {
                        const updated = [...ringSizes, size];
                        setRingSizes(updated);
                        setValue("ring_size", updated);
                        setNewRingSize("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {ringSizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ringSizes.map((size, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Size {size}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => {
                            const updated = ringSizes.filter(
                              (_, i) => i !== idx
                            );
                            setRingSizes(updated);
                            setValue("ring_size", updated);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Necklace Size - Multiple */}
              <div className="grid gap-2">
                <Label>Necklace Size (Multiple)</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter necklace size"
                    value={newNecklaceSize}
                    onChange={(e) => setNewNecklaceSize(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (
                          newNecklaceSize &&
                          !necklaceSizes.includes(newNecklaceSize)
                        ) {
                          const updated = [
                            ...necklaceSizes,
                            newNecklaceSize,
                          ];
                          setNecklaceSizes(updated);
                          setValue("necklace_size", updated);
                          setNewNecklaceSize("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (
                        newNecklaceSize &&
                        !necklaceSizes.includes(newNecklaceSize)
                      ) {
                        const updated = [...necklaceSizes, newNecklaceSize];
                        setNecklaceSizes(updated);
                        setValue("necklace_size", updated);
                        setNewNecklaceSize("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {necklaceSizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {necklaceSizes.map((size, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {size}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => {
                            const updated = necklaceSizes.filter(
                              (_, i) => i !== idx
                            );
                            setNecklaceSizes(updated);
                            setValue("necklace_size", updated);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Type */}
              <div className="grid gap-2">
                <Label htmlFor="edit_product_type">Product Type</Label>
                <Select
                  value={watchedProductType}
                  onValueChange={(value) => setValue("product_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engagement Ring">
                      Engagement Ring
                    </SelectItem>
                    <SelectItem value="Earrings">Earrings</SelectItem>
                    <SelectItem value="Pendant">Pendant</SelectItem>
                    <SelectItem value="Bracelet">Bracelet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Matching Band */}
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_matching_band_available"
                    {...register("matching_band_available")}
                    onCheckedChange={(checked) => {
                      setValue("matching_band_available", checked as boolean);
                      if (!checked) {
                        setValue("matching_band_product_id", null);
                      }
                    }}
                  />
                  <Label
                    htmlFor="edit_matching_band_available"
                    className="cursor-pointer"
                  >
                    Matching Band Available
                  </Label>
                </div>
                {watchedMatchingBand && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit_matching_band_product_id">
                      Matching Band Product ID
                    </Label>
                    <Input
                      id="edit_matching_band_product_id"
                      {...register("matching_band_product_id")}
                      placeholder="Enter product ID"
                    />
                  </div>
                )}
              </div>

              {/* Engraving */}
              <div className="grid gap-2">
                <Label htmlFor="edit_engraving_text">Engraving</Label>
                <Textarea
                  id="edit_engraving_text"
                  {...register("engraving_text")}
                  placeholder="Enter engraving text..."
                  rows={2}
                />
              </div>

              {/* Variants - editable price & discounted price */}
              {variantRows.length > 0 && (
                <div className="grid gap-2">
                  <Label>Variants (Price Configuration)</Label>
                  <p className="text-xs text-gray-500">
                    Update price and discounted price for each variant. Other fields come from the
                    original variant configuration.
                  </p>
                  <div className="overflow-x-auto border rounded-md">
                    <table className="w-full text-xs md:text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-2 text-left font-semibold text-gray-700">
                            Stone
                          </th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-700">
                            Carat
                          </th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-700">
                            Metal
                          </th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-700">
                            Diamond Quality
                          </th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-700">
                            Shape
                          </th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-700">
                            Price
                          </th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-700">
                            Discounted Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {variantRows.map((v, index) => (
                          <tr key={`${v.metal_type}-${v.carat_weight}-${v.diamond_type}-${index}`}>
                            <td className="px-2 py-1 whitespace-nowrap">{v.diamond_type}</td>
                            <td className="px-2 py-1 whitespace-nowrap">{v.carat_weight}</td>
                            <td className="px-2 py-1 whitespace-nowrap">{v.metal_type}</td>
                            <td className="px-2 py-1 whitespace-nowrap">
                              {v.diamond_quality || "-"}
                            </td>
                            <td className="px-2 py-1 whitespace-nowrap">{v.shape || "-"}</td>
                            <td className="px-2 py-1 min-w-[110px]">
                              <Input
                                type="number"
                                step="0.01"
                                value={Number.isNaN(v.price) ? "" : v.price}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const numeric =
                                    value === "" ? Number.NaN : parseFloat(value);
                                  setVariantRows((prev) =>
                                    prev.map((row, i) =>
                                      i === index ? { ...row, price: numeric } : row
                                    )
                                  );
                                }}
                              />
                            </td>
                            <td className="px-2 py-1 min-w-[140px]">
                              <Input
                                type="number"
                                step="0.01"
                                value={
                                  Number.isNaN(v.discounted_price)
                                    ? ""
                                    : v.discounted_price
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const numeric =
                                    value === "" ? Number.NaN : parseFloat(value);
                                  setVariantRows((prev) =>
                                    prev.map((row, i) =>
                                      i === index
                                        ? { ...row, discounted_price: numeric }
                                        : row
                                    )
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Metal Images */}
              {existingMetalImages.length > 0 && (
                <div className="grid gap-2">
                  <Label>Metal Images</Label>
                  <p className="text-xs text-gray-500">
                    Existing images by metal / shape / view angle. Uploading a new image will
                    replace the current one for that combination when you save.
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {existingMetalImages.map((img, index) => {
                      const key = `${img.metal_type}|${img.shape || ""}|${img.view_angle}|${index}`;
                      const displayLabel = `${img.metal_type}${
                        img.shape ? ` • ${img.shape}` : ""
                      } • ${img.view_angle}`;
                      return (
                        <div
                          key={key}
                          className="flex items-start gap-3 border rounded-md p-2 bg-white"
                        >
                          <div className="w-20 h-20 flex-shrink-0">
                            <ImageWithFallback
                              src={getImageUrl(img.image)}
                              alt={displayLabel}
                              className="w-full h-full object-cover rounded border"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-xs font-medium text-gray-800">{displayLabel}</p>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const uploadKey = `${img.metal_type}|${img.shape || ""}|${
                                  img.view_angle
                                }`;
                                setMetalImageUploads((prev) => {
                                  const filtered = prev.filter(
                                    (m) =>
                                      `${m.metal_type}|${m.shape || ""}|${m.view_angle}` !==
                                      uploadKey
                                  );
                                  return [
                                    ...filtered,
                                    {
                                      metal_type: img.metal_type,
                                      shape: img.shape,
                                      view_angle: img.view_angle,
                                      file,
                                    },
                                  ];
                                });
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Images */}
              <div className="grid gap-2">
                <Label htmlFor="edit_images">
                  Add More Images (Optional)
                </Label>
                <Input
                  id="edit_images"
                  type="file"
                  accept="image/*"
                  multiple
                  {...register("images")}
                />
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="grid gap-2">
                <Label htmlFor="edit_status">Status</Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseEdit}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Product Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Product ID</Label>
                  <p className="font-semibold">{selectedProduct.product_id}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Product Name</Label>
                  <p className="font-semibold">
                    {selectedProduct.product_name}
                  </p>
                </div>
              </div>
              {selectedProduct.description && (
                <div>
                  <Label className="text-gray-500">Description</Label>
                  <p>{selectedProduct.description}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-500">Original Price</Label>
                  <p className="font-semibold">
                    {selectedProduct.original_price
                      ? `$${selectedProduct?.original_price?.toFixed(2)}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Discounted Price</Label>
                  <p className="font-semibold text-green-600">
                    ${selectedProduct?.discounted_price?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <Badge
                    variant="outline"
                    className={
                      selectedProduct.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }
                  >
                    {selectedProduct.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Category</Label>
                  <p>{getCategoryName(selectedProduct)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">SubCategory</Label>
                  <p>{getSubCategoryName(selectedProduct)}</p>
                </div>
              </div>
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div>
                  <Label className="text-gray-500">Product Images</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedProduct.images.map((image, index) => (
                      <ImageWithFallback
                        key={index}
                        src={getImageUrl(image)}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              style={{ backgroundColor: "#dc2626", color: "white" }}
              className="hover:!bg-red-700 focus:ring-red-500"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}






