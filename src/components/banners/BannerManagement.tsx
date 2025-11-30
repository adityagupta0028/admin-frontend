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
import { Search, Plus, Edit, Trash2, Eye, Upload, X } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  useGetAllBannersQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  Banner,
} from "../../store/api/bannerApi";
import { toast } from "sonner";

export function BannerManagement() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Image states
  const [homeImage1, setHomeImage1] = useState<File | null>(null);
  const [homeImage2, setHomeImage2] = useState<File | null>(null);
  const [bannerImage3, setBannerImage3] = useState<File | null>(null);
  
  // Image previews
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [preview3, setPreview3] = useState<string | null>(null);

  const { data: bannersResponse, isLoading, refetch } = useGetAllBannersQuery();
  const [addBanner, { isLoading: isAdding }] = useAddBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const banners = (bannersResponse?.data as Banner[]) || [];
  const filteredBanners = banners.filter((banner) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      banner.homePageBanner1?.toLowerCase().includes(searchLower) ||
      banner.homePageBanner2?.toLowerCase().includes(searchLower) ||
      banner.bannerPage3?.toLowerCase().includes(searchLower)
    );
  });

  const handleImageChange = (
    file: File | null,
    setFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleAddBanner = async () => {
    try {
      const formData = new FormData();
      
      if (homeImage1) {
        formData.append("home_image1", homeImage1);
      }
      if (homeImage2) {
        formData.append("home_image2", homeImage2);
      }
      if (bannerImage3) {
        formData.append("bannner_image3", bannerImage3);
      }

      await addBanner(formData).unwrap();
      toast.success("Banner added successfully!");
      setIsAddOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add banner");
    }
  };

  const handleEditClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setPreview1(banner.homePageBanner1 ? `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${banner.homePageBanner1}` : null);
    setPreview2(banner.homePageBanner2 ? `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${banner.homePageBanner2}` : null);
    setPreview3(banner.bannerPage3 ? `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${banner.bannerPage3}` : null);
    setIsEditOpen(true);
  };

  const handleUpdateBanner = async () => {
    if (!selectedBanner) return;

    try {
      const formData = new FormData();
      
      if (homeImage1) {
        formData.append("home_image1", homeImage1);
      }
      if (homeImage2) {
        formData.append("home_image2", homeImage2);
      }

      await updateBanner({ id: selectedBanner._id, formData }).unwrap();
      toast.success("Banner updated successfully!");
      setIsEditOpen(false);
      setSelectedBanner(null);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update banner");
    }
  };

  const handleViewClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleteOpen(true);
  };

  const handleDeleteBanner = async () => {
    if (!selectedBanner) return;

    try {
      await deleteBanner(selectedBanner._id).unwrap();
      toast.success("Banner deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedBanner(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete banner");
    }
  };

  const resetForm = () => {
    setHomeImage1(null);
    setHomeImage2(null);
    setBannerImage3(null);
    setPreview1(null);
    setPreview2(null);
    setPreview3(null);
  };

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    resetForm();
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedBanner(null);
    resetForm();
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}${imagePath}`;
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
            <BreadcrumbPage>Banners</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Banner Management</h1>
          <p className="text-gray-500 mt-1">Manage homepage banners and promotional sliders</p>
        </div>
        <Button
          className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:opacity-90"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search banners..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Banners Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Banners ({filteredBanners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading banners...</div>
          ) : filteredBanners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No banners found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Home Banner 1</TableHead>
                  <TableHead>Home Banner 2</TableHead>
                  <TableHead>Banner 3</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.map((banner) => (
                  <TableRow key={banner._id}>
                    <TableCell>
                      {banner.homePageBanner1 ? (
                        <ImageWithFallback
                          src={getImageUrl(banner.homePageBanner1) || ''}
                          alt="Home Banner 1"
                          className="w-32 h-16 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {banner.homePageBanner2 ? (
                        <ImageWithFallback
                          src={getImageUrl(banner.homePageBanner2) || ''}
                          alt="Home Banner 2"
                          className="w-32 h-16 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {banner.bannerPage3 ? (
                        <ImageWithFallback
                          src={getImageUrl(banner.bannerPage3) || ''}
                          alt="Banner 3"
                          className="w-32 h-16 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewClick(banner)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(banner)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(banner)}
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

      {/* Add Banner Modal */}
      <Dialog open={isAddOpen} onOpenChange={handleCloseAdd}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Banner</DialogTitle>
            <DialogDescription>Upload banner images for your homepage.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Home Image 1 */}
            <div className="grid gap-2">
              <Label htmlFor="home_image1">Home Banner Image 1</Label>
              <div className="relative">
                <Input
                  id="home_image1"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleImageChange(file, setHomeImage1, setPreview1);
                  }}
                />
                {preview1 && (
                  <div className="mt-2 relative">
                    <img
                      src={preview1}
                      alt="Preview 1"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageChange(null, setHomeImage1, setPreview1)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Home Image 2 */}
            <div className="grid gap-2">
              <Label htmlFor="home_image2">Home Banner Image 2</Label>
              <div className="relative">
                <Input
                  id="home_image2"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleImageChange(file, setHomeImage2, setPreview2);
                  }}
                />
                {preview2 && (
                  <div className="mt-2 relative">
                    <img
                      src={preview2}
                      alt="Preview 2"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageChange(null, setHomeImage2, setPreview2)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Banner Image 3 */}
            <div className="grid gap-2">
              <Label htmlFor="bannner_image3">Banner Image 3</Label>
              <div className="relative">
                <Input
                  id="bannner_image3"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleImageChange(file, setBannerImage3, setPreview3);
                  }}
                />
                {preview3 && (
                  <div className="mt-2 relative">
                    <img
                      src={preview3}
                      alt="Preview 3"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageChange(null, setBannerImage3, setPreview3)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseAdd}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]"
              onClick={handleAddBanner}
              disabled={isAdding || (!homeImage1 && !homeImage2 && !bannerImage3)}
            >
              {isAdding ? "Adding..." : "Add Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Banner Modal */}
      <Dialog open={isEditOpen} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Update banner images.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Home Image 1 */}
            <div className="grid gap-2">
              <Label htmlFor="edit_home_image1">Home Banner Image 1</Label>
              <div className="relative">
                <Input
                  id="edit_home_image1"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleImageChange(file, setHomeImage1, setPreview1);
                  }}
                />
                {preview1 && (
                  <div className="mt-2 relative">
                    <img
                      src={preview1}
                      alt="Preview 1"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageChange(null, setHomeImage1, setPreview1)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Home Image 2 */}
            <div className="grid gap-2">
              <Label htmlFor="edit_home_image2">Home Banner Image 2</Label>
              <div className="relative">
                <Input
                  id="edit_home_image2"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleImageChange(file, setHomeImage2, setPreview2);
                  }}
                />
                {preview2 && (
                  <div className="mt-2 relative">
                    <img
                      src={preview2}
                      alt="Preview 2"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageChange(null, setHomeImage2, setPreview2)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
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
              type="button"
              className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]"
              onClick={handleUpdateBanner}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Banner Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Banner Details</DialogTitle>
          </DialogHeader>
          {selectedBanner && (
            <div className="grid gap-4 py-4">
              {selectedBanner.homePageBanner1 && (
                <div>
                  <Label>Home Banner 1</Label>
                  <ImageWithFallback
                    src={getImageUrl(selectedBanner.homePageBanner1) || ''}
                    alt="Home Banner 1"
                    className="w-full h-48 rounded-lg object-cover border border-gray-200 mt-2"
                  />
                </div>
              )}
              {selectedBanner.homePageBanner2 && (
                <div>
                  <Label>Home Banner 2</Label>
                  <ImageWithFallback
                    src={getImageUrl(selectedBanner.homePageBanner2) || ''}
                    alt="Home Banner 2"
                    className="w-full h-48 rounded-lg object-cover border border-gray-200 mt-2"
                  />
                </div>
              )}
              {selectedBanner.bannerPage3 && (
                <div>
                  <Label>Banner 3</Label>
                  <ImageWithFallback
                    src={getImageUrl(selectedBanner.bannerPage3) || ''}
                    alt="Banner 3"
                    className="w-full h-48 rounded-lg object-cover border border-gray-200 mt-2"
                  />
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
              Are you sure you want to delete this banner?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBanner}
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
