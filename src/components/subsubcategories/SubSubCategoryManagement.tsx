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
  useGetSubSubCategoriesQuery,
  useCreateSubSubCategoryMutation,
  useUpdateSubSubCategoryMutation,
  useDeleteSubSubCategoryMutation,
  SubSubCategory,
} from "../../store/api/subSubCategoryApi";
import { useGetSubCategoriesQuery } from "../../store/api/subCategoryApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface SubSubCategoryFormData {
  subCategoryId: string;
  title: string;
  subSubCategoryName: string;
  image?: FileList;
}

export function SubSubCategoryManagement() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<SubSubCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState<string>("all");

  const { data: subCategoriesResponse } = useGetSubCategoriesQuery();
  const { data: subSubCategoriesResponse, isLoading, refetch } = useGetSubSubCategoriesQuery(
    selectedSubCategoryFilter !== "all" ? { subCategoryId: selectedSubCategoryFilter } : undefined
  );
  const [createSubSubCategory, { isLoading: isCreating }] = useCreateSubSubCategoryMutation();
  const [updateSubSubCategory, { isLoading: isUpdating }] = useUpdateSubSubCategoryMutation();
  const [deleteSubSubCategory, { isLoading: isDeleting }] = useDeleteSubSubCategoryMutation();

  const subCategories = subCategoriesResponse?.data || [];
  const subSubCategories = subSubCategoriesResponse?.data as SubSubCategory[] || [];
  const filteredSubSubCategories = subSubCategories.filter((subSubCat) =>
    subSubCat.subSubCategoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subSubCat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { register, handleSubmit, reset, setValue, watch } = useForm<SubSubCategoryFormData>({
    defaultValues: {
      subCategoryId: "",
      title: "",
      subSubCategoryName: "",
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
    if (selectedSubCategoryFilter !== "all") {
      refetch();
    }
  }, [selectedSubCategoryFilter, refetch]);

  const handleAddSubSubCategory = async (data: SubSubCategoryFormData) => {
    try {
      const formData = new FormData();
      formData.append("subCategoryId", data.subCategoryId);
      formData.append("title", data.title);
      formData.append("subSubCategoryName", data.subSubCategoryName);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      await createSubSubCategory(formData).unwrap();
      toast.success("Sub-SubCategory created successfully!");
      setIsAddOpen(false);
      reset();
      setImagePreview(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create sub-subcategory");
    }
  };

  const handleEditClick = (subSubCategory: SubSubCategory) => {
    setSelectedSubSubCategory(subSubCategory);
    const subCategoryId = typeof subSubCategory.subCategoryId === 'string' 
      ? subSubCategory.subCategoryId 
      : subSubCategory.subCategoryId._id;
    setValue("subCategoryId", subCategoryId);
    setValue("title", subSubCategory.title);
    setValue("subSubCategoryName", subSubCategory.subSubCategoryName);
    setImagePreview(subSubCategory.image ? `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${subSubCategory.image}` : null);
    setIsEditOpen(true);
  };

  const handleUpdateSubSubCategory = async (data: SubSubCategoryFormData) => {
    if (!selectedSubSubCategory) return;

    try {
      const formData = new FormData();
      formData.append("subCategoryId", data.subCategoryId);
      formData.append("title", data.title);
      formData.append("subSubCategoryName", data.subSubCategoryName);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      await updateSubSubCategory({ id: selectedSubSubCategory._id, formData }).unwrap();
      toast.success("Sub-SubCategory updated successfully!");
      setIsEditOpen(false);
      setSelectedSubSubCategory(null);
      reset();
      setImagePreview(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update sub-subcategory");
    }
  };

  const handleDeleteClick = (subSubCategory: SubSubCategory) => {
    setSelectedSubSubCategory(subSubCategory);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubSubCategory = async () => {
    if (!selectedSubSubCategory) return;

    try {
      await deleteSubSubCategory(selectedSubSubCategory._id).unwrap();
      toast.success("Sub-SubCategory deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedSubSubCategory(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete sub-subcategory");
    }
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    reset();
    setImagePreview(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedSubSubCategory(null);
    reset();
    setImagePreview(null);
  };

  const getSubCategoryName = (subSubCategory: SubSubCategory) => {
    if (typeof subSubCategory?.subCategoryId === 'string') {
      const subCategory = subCategories.find((subCat: any) => subCat._id === subSubCategory?.subCategoryId);
      return subCategory ? subCategory?.subCategoryName : 'Unknown';
    }
    return subSubCategory.subCategoryId?.subCategoryName;
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
            <BreadcrumbPage>Sub-SubCategories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Sub-SubCategory Management</h1>
          <p className="text-gray-500 mt-1">Organize your product sub-subcategories</p>
        </div>
        <Button
          className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:opacity-90"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sub-SubCategory
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search sub-subcategories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedSubCategoryFilter} onValueChange={setSelectedSubCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SubCategories</SelectItem>
                {subCategories.map((subCategory: any) => (
                  <SelectItem key={subCategory._id} value={subCategory._id}>
                    {subCategory.subCategoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SubSubCategories Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Sub-SubCategories ({filteredSubSubCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading sub-subcategories...</div>
          ) : filteredSubSubCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No sub-subcategories found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sub-SubCategory Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>SubCategory</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubSubCategories.map((subSubCategory) => (
                  <TableRow key={subSubCategory._id}>
                    <TableCell className="font-medium">{subSubCategory.subSubCategoryName}</TableCell>
                    <TableCell>{subSubCategory.title}</TableCell>
                    <TableCell>{getSubCategoryName(subSubCategory)}</TableCell>
                    <TableCell>
                      {subSubCategory.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${subSubCategory.image}`}
                          alt={subSubCategory.subSubCategoryName}
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
                          subSubCategory.isActive
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {subSubCategory.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(subSubCategory)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(subSubCategory)}
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

      {/* Add SubSubCategory Modal */}
      <Dialog open={isAddOpen} onOpenChange={handleCloseAdd}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Sub-SubCategory</DialogTitle>
            <DialogDescription>Create a new product sub-subcategory.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddSubSubCategory)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subCategoryId">SubCategory</Label>
                <Select
                  onValueChange={(value) => setValue("subCategoryId", value)}
                  {...register("subCategoryId", { required: "SubCategory is required" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((subCategory: any) => (
                      <SelectItem key={subCategory._id} value={subCategory._id}>
                        {subCategory.subCategoryName}
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
                <Label htmlFor="subSubCategoryName">Sub-SubCategory Name</Label>
                <Input
                  id="subSubCategoryName"
                  {...register("subSubCategoryName", { required: "Sub-SubCategory name is required" })}
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
                {isCreating ? "Creating..." : "Create Sub-SubCategory"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit SubSubCategory Modal */}
      <Dialog open={isEditOpen} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Sub-SubCategory</DialogTitle>
            <DialogDescription>Update sub-subcategory information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdateSubSubCategory)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-subCategoryId">SubCategory</Label>
                <Select
                  value={watch("subCategoryId")}
                  onValueChange={(value) => setValue("subCategoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((subCategory: any) => (
                      <SelectItem key={subCategory._id} value={subCategory._id}>
                        {subCategory?.subCategoryName}
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
                <Label htmlFor="edit-subSubCategoryName">Sub-SubCategory Name</Label>
                <Input
                  id="edit-subSubCategoryName"
                  {...register("subSubCategoryName", { required: "Sub-SubCategory name is required" })}
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
                {isUpdating ? "Updating..." : "Update Sub-SubCategory"}
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
              This action cannot be undone. This will permanently delete the sub-subcategory
              "{selectedSubSubCategory?.subSubCategoryName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubSubCategory}
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

