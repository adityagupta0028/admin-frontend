import React, { useState, useEffect } from "react";
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
import { Search, Plus, Edit, Trash2, Eye, Upload, X } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  useGetProductsQuery,
  useGetProductDetailQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  Product,
} from "../../store/api/productApi";
import { useGetCategoriesQuery } from "../../store/api/categoryApi";
import { useGetSubCategoriesQuery } from "../../store/api/subCategoryApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface ProductFormData {
  product_id: string;
  product_name: string;
  description?: string;
  original_price?: number;
  discounted_price: number;
  discount_label?: string;
  promotion_label?: string;
  metal_type: string;
  metal_code?: string;
  metal_price?: number;
  diamond_origin: string;
  carat_weight?: number;
  diamond_quality?: string;
  diamond_color_grade?: string;
  diamond_clarity_grade?: string;
  ring_size: number;
  engraving_text?: string;
  engraving_allowed?: boolean;
  back_type?: string;
  matching_band_available?: boolean;
  product_type?: string;
  collection_name?: string;
  categoryId: string;
  subCategoryId: string;
  status?: string;
  tags?: string;
  images?: FileList;
}

export function ProductManagement() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("Active");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // API hooks
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const { data: subCategoriesResponse } = useGetSubCategoriesQuery(
    selectedCategoryId ? { categoryId: selectedCategoryId } : undefined
  );
  
  const queryParams: any = {};
  if (selectedCategory !== "all") queryParams.categoryId = selectedCategory;
  if (selectedSubCategory !== "all") queryParams.subCategoryId = selectedSubCategory;
  if (selectedStatus) queryParams.status = selectedStatus;

  const { data: productsResponse, isLoading, refetch } = useGetProductsQuery(queryParams);
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const categories = (Array.isArray(categoriesResponse?.data) ? categoriesResponse?.data : []) as any[];
  const subCategories = (Array.isArray(subCategoriesResponse?.data) ? subCategoriesResponse?.data : []) as any[];
  const products = (productsResponse?.data as Product[]) || [];
  
  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.product_name?.toLowerCase().includes(searchLower) ||
      product.product_id?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    );
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      product_id: "",
      product_name: "",
      description: "",
      discounted_price: 0,
      metal_type: "",
      diamond_origin: "",
      ring_size: 3,
      categoryId: "",
      subCategoryId: "",
      status: "Active",
    },
  });

  const watchedImages = watch("images");
  const watchedCategoryId = watch("categoryId");

  useEffect(() => {
    if (watchedCategoryId) {
      setSelectedCategoryId(watchedCategoryId);
      setValue("subCategoryId", "");
    }
  }, [watchedCategoryId, setValue]);

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

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      const formData = new FormData();
      
      // Append all form fields
      formData.append("product_id", data.product_id);
      formData.append("product_name", data.product_name);
      if (data.description) formData.append("description", data.description);
      if (data.original_price) formData.append("original_price", data.original_price.toString());
      formData.append("discounted_price", data.discounted_price.toString());
      if (data.discount_label) formData.append("discount_label", data.discount_label);
      if (data.promotion_label) formData.append("promotion_label", data.promotion_label);
      formData.append("metal_type", data.metal_type);
      if (data.metal_code) formData.append("metal_code", data.metal_code);
      if (data.metal_price) formData.append("metal_price", data.metal_price.toString());
      formData.append("diamond_origin", data.diamond_origin);
      if (data.carat_weight) formData.append("carat_weight", data.carat_weight.toString());
      if (data.diamond_quality) formData.append("diamond_quality", data.diamond_quality);
      if (data.diamond_color_grade) formData.append("diamond_color_grade", data.diamond_color_grade);
      if (data.diamond_clarity_grade) formData.append("diamond_clarity_grade", data.diamond_clarity_grade);
      formData.append("ring_size", data.ring_size.toString());
      if (data.engraving_text) formData.append("engraving_text", data.engraving_text);
      if (data.engraving_allowed !== undefined) formData.append("engraving_allowed", data.engraving_allowed.toString());
      if (data.back_type) formData.append("back_type", data.back_type);
      if (data.matching_band_available !== undefined) formData.append("matching_band_available", data.matching_band_available.toString());
      if (data.product_type) formData.append("product_type", data.product_type);
      if (data.collection_name) formData.append("collection_name", data.collection_name);
      formData.append("categoryId", data.categoryId);
      formData.append("subCategoryId", data.subCategoryId);
      if (data.status) formData.append("status", data.status);
      if (data.tags) formData.append("tags", data.tags);

      // Append images
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => {
          formData.append("images", file);
        });
      }

      await createProduct(formData).unwrap();
      toast.success("Product created successfully!");
      setIsAddOpen(false);
      reset();
      setImagePreviews([]);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create product");
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    const categoryId = typeof product.categoryId === 'string' ? product.categoryId : product.categoryId._id;
    const subCategoryId = typeof product.subCategoryId === 'string' ? product.subCategoryId : product.subCategoryId._id;
    
    setValue("product_id", product.product_id);
    setValue("product_name", product.product_name);
    setValue("description", product.description || "");
    setValue("original_price", product.original_price);
    setValue("discounted_price", product.discounted_price);
    setValue("discount_label", product.discount_label || "");
    setValue("promotion_label", product.promotion_label || "");
    setValue("metal_type", product.metal_type);
    setValue("metal_code", product.metal_code || "");
    setValue("metal_price", product.metal_price);
    setValue("diamond_origin", product.diamond_origin);
    setValue("carat_weight", product.carat_weight);
    setValue("diamond_quality", product.diamond_quality || "");
    setValue("diamond_color_grade", product.diamond_color_grade || "");
    setValue("diamond_clarity_grade", product.diamond_clarity_grade || "");
    setValue("ring_size", product.ring_size);
    setValue("engraving_text", product.engraving_text || "");
    setValue("engraving_allowed", product.engraving_allowed);
    setValue("back_type", product.back_type || "");
    setValue("matching_band_available", product.matching_band_available);
    setValue("product_type", product.product_type || "");
    setValue("collection_name", product.collection_name || "");
    setValue("categoryId", categoryId);
    setValue("subCategoryId", subCategoryId);
    setValue("status", product.status);
    if (product.tags) setValue("tags", Array.isArray(product.tags) ? product.tags.join(", ") : product.tags);
    
    setSelectedCategoryId(categoryId);
    
    // Set image previews from existing images
    if (product.images && product.images.length > 0) {
      const previews = product.images.map(img => 
        `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${img}`
      );
      setImagePreviews(previews);
    }
    
    setIsEditOpen(true);
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!selectedProduct) return;

    try {
      const formData = new FormData();
      
      // Append all form fields
      if (data.product_id) formData.append("product_id", data.product_id);
      if (data.product_name) formData.append("product_name", data.product_name);
      if (data.description !== undefined) formData.append("description", data.description || "");
      if (data.original_price !== undefined) formData.append("original_price", data.original_price?.toString() || "");
      if (data.discounted_price) formData.append("discounted_price", data.discounted_price.toString());
      if (data.discount_label !== undefined) formData.append("discount_label", data.discount_label || "");
      if (data.promotion_label !== undefined) formData.append("promotion_label", data.promotion_label || "");
      if (data.metal_type) formData.append("metal_type", data.metal_type);
      if (data.metal_code !== undefined) formData.append("metal_code", data.metal_code || "");
      if (data.metal_price !== undefined) formData.append("metal_price", data.metal_price?.toString() || "");
      if (data.diamond_origin) formData.append("diamond_origin", data.diamond_origin);
      if (data.carat_weight !== undefined) formData.append("carat_weight", data.carat_weight?.toString() || "");
      if (data.diamond_quality !== undefined) formData.append("diamond_quality", data.diamond_quality || "");
      if (data.diamond_color_grade !== undefined) formData.append("diamond_color_grade", data.diamond_color_grade || "");
      if (data.diamond_clarity_grade !== undefined) formData.append("diamond_clarity_grade", data.diamond_clarity_grade || "");
      if (data.ring_size) formData.append("ring_size", data.ring_size.toString());
      if (data.engraving_text !== undefined) formData.append("engraving_text", data.engraving_text || "");
      if (data.engraving_allowed !== undefined) formData.append("engraving_allowed", data.engraving_allowed.toString());
      if (data.back_type !== undefined) formData.append("back_type", data.back_type || "");
      if (data.matching_band_available !== undefined) formData.append("matching_band_available", data.matching_band_available.toString());
      if (data.product_type !== undefined) formData.append("product_type", data.product_type || "");
      if (data.collection_name !== undefined) formData.append("collection_name", data.collection_name || "");
      if (data.categoryId) formData.append("categoryId", data.categoryId);
      if (data.subCategoryId) formData.append("subCategoryId", data.subCategoryId);
      if (data.status) formData.append("status", data.status);
      if (data.tags) formData.append("tags", data.tags);

      // Append new images if any
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => {
          formData.append("images", file);
        });
      }

      await updateProduct({ id: selectedProduct._id, formData }).unwrap();
      toast.success("Product updated successfully!");
      setIsEditOpen(false);
      setSelectedProduct(null);
      reset();
      setImagePreviews([]);
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
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${imagePath}`;
  };

  const getCategoryName = (product: Product) => {
    if (typeof product.categoryId === 'string') {
      const category = categories.find((cat: any) => cat._id === product.categoryId);
      return category ? category.categoryName : 'Unknown';
    }
    return (product.categoryId as any).categoryName;
  };

  const getSubCategoryName = (product: Product) => {
    if (typeof product.subCategoryId === 'string') {
      const subCategory = subCategories.find((subCat: any) => subCat._id === product.subCategoryId);
      return subCategory ? subCategory.subCategoryName : 'Unknown';
    }
    return (product.subCategoryId as any).subCategoryName;
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>Dashboard</BreadcrumbLink>
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
          <p className="text-gray-500 mt-1">Manage your jewelry collection and inventory</p>
        </div>
        <Button
          className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:opacity-90"
          onClick={() => setIsAddOpen(true)}
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.length > 0 && categories.map((category: any) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
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
            <div className="text-center py-8 text-gray-500">No products found</div>
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
                        {product.images && product.images.length > 0 ? (
                          <ImageWithFallback
                            src={getImageUrl(product.images[0])}
                            alt={product.product_name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                        <span>{product.product_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{product.product_id}</TableCell>
                    <TableCell className="text-gray-600">
                      {getCategoryName(product)} / {getSubCategoryName(product)}
                    </TableCell>
                    <TableCell>
                      <div>
                        {product.original_price && product.original_price > product.discounted_price && (
                          <span className="text-gray-400 line-through mr-2">
                            ${product.original_price.toFixed(2)}
                          </span>
                        )}
                        <span className="font-semibold">${product.discounted_price.toFixed(2)}</span>
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

      {/* Add Product Modal - This will be a large form, showing key fields */}
      <Dialog open={isAddOpen} onOpenChange={handleCloseAdd}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Add a new jewelry item to your catalog.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(
            (data) => {
              console.log("Form submitted successfully", data);
              handleAddProduct(data);
            },
            (errors) => {
              console.log("Form validation errors", errors);
            }
          )}>
            <div className="grid gap-4 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="product_id">Product ID *</Label>
                  <Input
                    id="product_id"
                    {...register("product_id", { required: "Product ID is required" })}
                    placeholder="e.g., PRD-001"
                  />
                  {errors.product_id && (
                    <span className="text-sm text-red-500">{errors.product_id.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product_name">Product Name *</Label>
                  <Input
                    id="product_name"
                    {...register("product_name", { required: "Product name is required" })}
                    placeholder="e.g., Diamond Ring"
                  />
                  {errors.product_name && (
                    <span className="text-sm text-red-500">{errors.product_name.message}</span>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="original_price">Original Price</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    {...register("original_price", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discounted_price">Discounted Price *</Label>
                  <Input
                    id="discounted_price"
                    type="number"
                    step="0.01"
                    {...register("discounted_price", { 
                      required: "Discounted price is required",
                      valueAsNumber: true,
                      min: { value: 0.01, message: "Price must be greater than 0" }
                    })}
                    placeholder="0.00"
                  />
                  {errors.discounted_price && (
                    <span className="text-sm text-red-500">{errors.discounted_price.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount_label">Discount Label</Label>
                  <Input
                    id="discount_label"
                    {...register("discount_label")}
                    placeholder="e.g., 20% OFF"
                  />
                </div>
              </div>

              {/* Category & SubCategory */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={watch("categoryId")}
                    onValueChange={(value) => {
                      setValue("categoryId", value, { shouldValidate: true });
                      setSelectedCategoryId(value);
                      setValue("subCategoryId", "", { shouldValidate: false });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                      ) : (
                        categories.map((category: any) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.categoryName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <span className="text-sm text-red-500">{errors.categoryId.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subCategoryId">SubCategory *</Label>
                  <Select
                    value={watch("subCategoryId")}
                    onValueChange={(value) => setValue("subCategoryId", value, { shouldValidate: true })}
                    disabled={!watch("categoryId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={watch("categoryId") ? "Select subcategory" : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {!watch("categoryId") ? (
                        <SelectItem value="disabled" disabled>Select category first</SelectItem>
                      ) : subCategories.length === 0 ? (
                        <SelectItem value="loading" disabled>Loading subcategories...</SelectItem>
                      ) : (
                        subCategories.map((subCategory: any) => (
                          <SelectItem key={subCategory._id} value={subCategory._id}>
                            {subCategory.subCategoryName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.subCategoryId && (
                    <span className="text-sm text-red-500">{errors.subCategoryId.message}</span>
                  )}
                </div>
              </div>

              {/* Metal & Diamond */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="metal_type">Metal Type *</Label>
                  <Select
                    onValueChange={(value) => setValue("metal_type", value)}
                    {...register("metal_type", { required: "Metal type is required" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select metal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14K White Gold">14K White Gold</SelectItem>
                      <SelectItem value="14K Yellow Gold">14K Yellow Gold</SelectItem>
                      <SelectItem value="14K Rose Gold">14K Rose Gold</SelectItem>
                      <SelectItem value="18K White Gold">18K White Gold</SelectItem>
                      <SelectItem value="18K Yellow Gold">18K Yellow Gold</SelectItem>
                      <SelectItem value="18K Rose Gold">18K Rose Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.metal_type && (
                    <span className="text-sm text-red-500">{errors.metal_type.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="diamond_origin">Diamond Origin *</Label>
                  <Select
                    onValueChange={(value) => setValue("diamond_origin", value)}
                    {...register("diamond_origin", { required: "Diamond origin is required" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diamond origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Natural">Natural</SelectItem>
                      <SelectItem value="Lab Grown">Lab Grown</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.diamond_origin && (
                    <span className="text-sm text-red-500">{errors.diamond_origin.message}</span>
                  )}
                </div>
              </div>

              {/* Ring Size & Other Details */}
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ring_size">Ring Size *</Label>
                  <Input
                    id="ring_size"
                    type="number"
                    min="3"
                    max="10"
                    {...register("ring_size", { 
                      required: "Ring size is required",
                      valueAsNumber: true,
                      min: { value: 3, message: "Ring size must be at least 3" },
                      max: { value: 10, message: "Ring size must be at most 10" }
                    })}
                    placeholder="3-10"
                  />
                  {errors.ring_size && (
                    <span className="text-sm text-red-500">{errors.ring_size.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="carat_weight">Carat Weight</Label>
                  <Input
                    id="carat_weight"
                    type="number"
                    step="0.01"
                    {...register("carat_weight", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product_type">Product Type</Label>
                  <Select
                    onValueChange={(value) => setValue("product_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engagement Ring">Engagement Ring</SelectItem>
                      <SelectItem value="Earrings">Earrings</SelectItem>
                      <SelectItem value="Pendant">Pendant</SelectItem>
                      <SelectItem value="Bracelet">Bracelet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Images */}
              <div className="grid gap-2">
                <Label htmlFor="images">Product Images * (Multiple)</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  {...register("images", { required: "At least one image is required" })}
                />
                {errors.images && (
                  <span className="text-sm text-red-500">{errors.images.message}</span>
                )}
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
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setValue("status", value)}
                  defaultValue="Active"
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
                onClick={handleCloseAdd}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal - Similar structure but with pre-filled values */}
      <Dialog open={isEditOpen} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(
            (data) => {
              console.log("Edit form submitted successfully", data);
              handleUpdateProduct(data);
            },
            (errors) => {
              console.log("Edit form validation errors", errors);
            }
          )}>
            <div className="grid gap-4 py-4">
              {/* Same fields as Add form but with pre-filled values */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_product_id">Product ID</Label>
                  <Input
                    id="edit_product_id"
                    {...register("product_id")}
                  />
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

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_original_price">Original Price</Label>
                  <Input
                    id="edit_original_price"
                    type="number"
                    step="0.01"
                    {...register("original_price", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_discounted_price">Discounted Price</Label>
                  <Input
                    id="edit_discounted_price"
                    type="number"
                    step="0.01"
                    {...register("discounted_price", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_discount_label">Discount Label</Label>
                  <Input
                    id="edit_discount_label"
                    {...register("discount_label")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_categoryId">Category</Label>
                  <Select
                    value={watch("categoryId")}
                    onValueChange={(value) => {
                      setValue("categoryId", value, { shouldValidate: true });
                      setSelectedCategoryId(value);
                      setValue("subCategoryId", "", { shouldValidate: false });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                      ) : (
                        categories.map((category: any) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.categoryName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_subCategoryId">SubCategory</Label>
                  <Select
                    value={watch("subCategoryId")}
                    onValueChange={(value) => setValue("subCategoryId", value, { shouldValidate: true })}
                    disabled={!watch("categoryId")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={watch("categoryId") ? "Select subcategory" : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {!watch("categoryId") ? (
                        <SelectItem value="disabled" disabled>Select category first</SelectItem>
                      ) : subCategories.length === 0 ? (
                        <SelectItem value="loading" disabled>Loading subcategories...</SelectItem>
                      ) : (
                        subCategories.map((subCategory: any) => (
                          <SelectItem key={subCategory._id} value={subCategory._id}>
                            {subCategory.subCategoryName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_metal_type">Metal Type</Label>
                  <Select
                    value={watch("metal_type")}
                    onValueChange={(value) => setValue("metal_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select metal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14K White Gold">14K White Gold</SelectItem>
                      <SelectItem value="14K Yellow Gold">14K Yellow Gold</SelectItem>
                      <SelectItem value="14K Rose Gold">14K Rose Gold</SelectItem>
                      <SelectItem value="18K White Gold">18K White Gold</SelectItem>
                      <SelectItem value="18K Yellow Gold">18K Yellow Gold</SelectItem>
                      <SelectItem value="18K Rose Gold">18K Rose Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_diamond_origin">Diamond Origin</Label>
                  <Select
                    value={watch("diamond_origin")}
                    onValueChange={(value) => setValue("diamond_origin", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diamond origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Natural">Natural</SelectItem>
                      <SelectItem value="Lab Grown">Lab Grown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_ring_size">Ring Size</Label>
                  <Input
                    id="edit_ring_size"
                    type="number"
                    min="3"
                    max="10"
                    {...register("ring_size", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_carat_weight">Carat Weight</Label>
                  <Input
                    id="edit_carat_weight"
                    type="number"
                    step="0.01"
                    {...register("carat_weight", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_product_type">Product Type</Label>
                  <Select
                    value={watch("product_type")}
                    onValueChange={(value) => setValue("product_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engagement Ring">Engagement Ring</SelectItem>
                      <SelectItem value="Earrings">Earrings</SelectItem>
                      <SelectItem value="Pendant">Pendant</SelectItem>
                      <SelectItem value="Bracelet">Bracelet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_images">Add More Images (Optional)</Label>
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

              <div className="grid gap-2">
                <Label htmlFor="edit_status">Status</Label>
                <Select
                  value={watch("status")}
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
                  <p className="font-semibold">{selectedProduct.product_name}</p>
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
                    {selectedProduct.original_price ? `$${selectedProduct.original_price.toFixed(2)}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Discounted Price</Label>
                  <p className="font-semibold text-green-600">
                    ${selectedProduct.discounted_price.toFixed(2)}
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
              style={{ backgroundColor: '#dc2626', color: 'white' }}
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
