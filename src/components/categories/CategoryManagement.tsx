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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, Category } from "../../store/api/categoryApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface CategoryFormData {
  title: string;
  categoryName: string;
  image?: FileList;
}

export function CategoryManagement() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: categoriesResponse, isLoading, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const categories = categoriesResponse?.data as Category[] || [];
  const filteredCategories = categories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CategoryFormData>({
    defaultValues: {
      title: "",
      categoryName: "",
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

  const handleAddCategory = async (data: CategoryFormData) => {
    console.log("handleAddCategory triggered", data);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("categoryName", data.categoryName);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      await createCategory(formData).unwrap();
      toast.success("Category created successfully!");
      setIsAddOpen(false);
      reset();
      setImagePreview(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  const handleEditClick = (category: Category) => {
    console.log("Edit clicked for category:", category);
    setSelectedCategory(category);
    reset({
      title: category.title,
      categoryName: category.categoryName,
      image: undefined,
    });
    setImagePreview(category.image ? `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${category.image}` : null);
    setIsEditOpen(true);
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!selectedCategory) return;

    console.log("handleUpdateCategory triggered", data, selectedCategory._id);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("categoryName", data.categoryName);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const response = await updateCategory({ id: selectedCategory._id, formData }).unwrap();
      console.log("Update response:", response);
      toast.success("Category updated successfully!");
      setIsEditOpen(false);
      setSelectedCategory(null);
      reset();
      setImagePreview(null);
      refetch();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    console.log("handleDeleteCategory triggered", selectedCategory._id);
    try {
      const response = await deleteCategory(selectedCategory._id).unwrap();
      console.log("Delete response:", response);
      toast.success("Category deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    reset();
    setImagePreview(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedCategory(null);
    reset();
    setImagePreview(null);
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
            <BreadcrumbPage>Categories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Category Management</h1>
          <p className="text-gray-500 mt-1">Organize your product categories</p>
        </div>
        <Button
          className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:opacity-90"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No categories found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">{category.categoryName}</TableCell>
                    <TableCell>{category.title}</TableCell>
                    <TableCell>
                      {category.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${category.image}`}
                          alt={category.categoryName}
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
                          category.isActive
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(category)}
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

      {/* Add Category Modal */}
      <Dialog open={isAddOpen} onOpenChange={handleCloseAdd}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new product category.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(
            (data) => {
              console.log("Form submitted successfully", data);
              handleAddCategory(data);
            },
            (errors) => {
              console.log("Form validation errors", errors);
            }
          )}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g., Gold Rings"
                />
                {errors.title && (
                  <span className="text-sm text-red-500">{errors.title.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  {...register("categoryName", { required: "Category name is required" })}
                  placeholder="e.g., gold-rings"
                />
                {errors.categoryName && (
                  <span className="text-sm text-red-500">{errors.categoryName.message}</span>
                )}
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
                {isCreating ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditOpen} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(
            (data) => {
              console.log("Edit form submitted successfully", data);
              handleUpdateCategory(data);
            },
            (errors) => {
              console.log("Edit form validation errors", errors);
            }
          )}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <span className="text-sm text-red-500">{errors.title.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-categoryName">Category Name</Label>
                <Input
                  id="edit-categoryName"
                  {...register("categoryName", { required: "Category name is required" })}
                />
                {errors.categoryName && (
                  <span className="text-sm text-red-500">{errors.categoryName.message}</span>
                )}
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
                {isUpdating ? "Updating..." : "Update Category"}
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
              Are you sure you want to delete this category?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={isDeleting}
              style={{ backgroundColor: '#dc2626', color: 'white' }}
              className="hover:!bg-red-700 focus:ring-red-500"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
