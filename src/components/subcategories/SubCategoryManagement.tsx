import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import {
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  SubCategory,
} from "../../store/api/subCategoryApi";
import { useGetCategoriesQuery } from "../../store/api/categoryApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface SubCategoryFormData {
  categoryId: string;
  title: string;
  subCategoryName: string;
  image?: FileList;
}

export function SubCategoryManagement() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  const { data: categoriesResponse } = useGetCategoriesQuery();
  const { data: subCategoriesResponse, isLoading, refetch } = useGetSubCategoriesQuery(
    selectedCategoryFilter !== "all" ? { categoryId: selectedCategoryFilter } : undefined
  );
  const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation();
  const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryMutation();
  const [deleteSubCategory, { isLoading: isDeleting }] = useDeleteSubCategoryMutation();

  const categories = categoriesResponse?.data || [];
  const subCategories = subCategoriesResponse?.data as SubCategory[] || [];
  const filteredSubCategories = subCategories.filter((subCat) =>
    subCat.subCategoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subCat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { register, handleSubmit, reset, setValue, watch } = useForm<SubCategoryFormData>({
    defaultValues: {
      categoryId: "",
      title: "",
      subCategoryName: "",
    },
  });

  const watchedImage = watch("image");

  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [watchedImage]);

  useEffect(() => {
    if (selectedCategoryFilter !== "all") {
      refetch();
    }
  }, [selectedCategoryFilter, refetch]);

  const handleAddSubCategory = async (data: SubCategoryFormData) => {
    try {
      const formData = new FormData();
      formData.append("categoryId", data.categoryId);
      formData.append("title", data.title);
      formData.append("subCategoryName", data.subCategoryName);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      await createSubCategory(formData).unwrap();
      toast.success("SubCategory created successfully!");
      setIsAddOpen(false);
      reset();
      setImagePreview(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create subcategory");
    }
  };

  const handleEditClick = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    const categoryId = typeof subCategory.categoryId === 'string' 
      ? subCategory.categoryId 
      : subCategory.categoryId._id;
    setValue("categoryId", categoryId);
    setValue("title", subCategory.title);
    setValue("subCategoryName", subCategory.subCategoryName);
    setImagePreview(subCategory.image ? `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${subCategory.image}` : null);
    setIsEditOpen(true);
  };

  const handleUpdateSubCategory = async (data: SubCategoryFormData) => {
    if (!selectedSubCategory) return;

    try {
      const formData = new FormData();
      formData.append("categoryId", data.categoryId);
      formData.append("title", data.title);
      formData.append("subCategoryName", data.subCategoryName);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      await updateSubCategory({ id: selectedSubCategory._id, formData }).unwrap();
      toast.success("SubCategory updated successfully!");
      setIsEditOpen(false);
      setSelectedSubCategory(null);
      reset();
      setImagePreview(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update subcategory");
    }
  };

  const handleDeleteClick = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubCategory = async () => {
    if (!selectedSubCategory) return;

    try {
      await deleteSubCategory(selectedSubCategory._id).unwrap();
      toast.success("SubCategory deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedSubCategory(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete subcategory");
    }
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    reset();
    setImagePreview(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedSubCategory(null);
    reset();
    setImagePreview(null);
  };

  const getCategoryName = (subCategory: SubCategory) => {
    if (typeof subCategory.categoryId === 'string') {
      const category = categories.find((cat: any) => cat._id === subCategory.categoryId);
      return category ? category.categoryName : 'Unknown';
    }
    return subCategory.categoryId.categoryName;
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
            <BreadcrumbPage>SubCategories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>SubCategory Management</h1>
          <p className="text-gray-500 mt-1">Organize your product subcategories</p>
        </div>
        <Button
          className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:opacity-90"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add SubCategory
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search subcategories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: any) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SubCategories Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All SubCategories ({filteredSubCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading subcategories...</div>
          ) : filteredSubCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No subcategories found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SubCategory Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubCategories.map((subCategory) => (
                  <TableRow key={subCategory._id}>
                    <TableCell className="font-medium">{subCategory.subCategoryName}</TableCell>
                    <TableCell>{subCategory.title}</TableCell>
                    <TableCell>{getCategoryName(subCategory)}</TableCell>
                    <TableCell>
                      {subCategory.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${subCategory.image}`}
                          alt={subCategory.subCategoryName}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          subCategory.isActive
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {subCategory.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(subCategory)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(subCategory)}
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

      {/* Add SubCategory Modal */}
      <Dialog open={isAddOpen} onOpenChange={handleCloseAdd}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New SubCategory</DialogTitle>
            <DialogDescription>Create a new product subcategory.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddSubCategory)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  onValueChange={(value) => setValue("categoryId", value)}
                  {...register("categoryId", { required: "Category is required" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g., Gold Rings"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subCategoryName">SubCategory Name</Label>
                <Input
                  id="subCategoryName"
                  {...register("subCategoryName", { required: "SubCategory name is required" })}
                  placeholder="e.g., gold-rings"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image (Optional)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image")}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded mt-2"
                  />
                )}
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
                {isCreating ? "Creating..." : "Create SubCategory"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit SubCategory Modal */}
      <Dialog open={isEditOpen} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit SubCategory</DialogTitle>
            <DialogDescription>Update subcategory information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdateSubCategory)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-categoryId">Category</Label>
                <Select
                  value={watch("categoryId")}
                  onValueChange={(value) => setValue("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  {...register("title", { required: "Title is required" })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-subCategoryName">SubCategory Name</Label>
                <Input
                  id="edit-subCategoryName"
                  {...register("subCategoryName", { required: "SubCategory name is required" })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image (Optional)</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  {...register("image")}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded mt-2"
                  />
                )}
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
                {isUpdating ? "Updating..." : "Update SubCategory"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subcategory
              "{selectedSubCategory?.subCategoryName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubCategory}
              className="bg-red-600 hover:bg-red-700"
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


