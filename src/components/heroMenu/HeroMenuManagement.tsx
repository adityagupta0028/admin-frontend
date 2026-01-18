import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  useGetHeroMenusQuery,
  useGetHeroMenuByCategoryQuery,
  useCreateHeroMenuMutation,
  useUpdateHeroMenuMutation,
  HeroMenu,
  HeroMenuColumn,
  HeroMenuHeader,
} from "../../store/api/heroMenuApi";
import {
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
  ProductAttribute,
} from "../../store/api/productAttributesApi";
import { useGetCategoriesQuery, Category } from "../../store/api/categoryApi";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

// Filter type configuration
interface FilterTypeConfig {
  key: keyof HeroMenuHeader['variables'];
  label: string;
}

const filterTypes: FilterTypeConfig[] = [
  { key: "settingConfigurations", label: "Setting Configurations" },
  { key: "shankConfigurations", label: "Shank Configurations" },
  { key: "holdingMethods", label: "Holding Methods" },
  { key: "bandProfileShapes", label: "Band Profile Shapes" },
  { key: "bandWidthCategories", label: "Band Width Categories" },
  { key: "bandFits", label: "Band Fits" },
  { key: "shankTreatments", label: "Shank Treatments" },
  { key: "styles", label: "Styles" },
  { key: "settingFeatures", label: "Setting Features" },
  { key: "motifThemes", label: "Motif Themes" },
  { key: "ornamentDetails", label: "Ornament Details" },
];

export function HeroMenuManagement() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [activeColumnTab, setActiveColumnTab] = useState<number>(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [columns, setColumns] = useState<HeroMenuColumn[]>([
    { columnIndex: 0, headers: [] },
    { columnIndex: 1, headers: [] },
    { columnIndex: 2, headers: [] },
    { columnIndex: 3, headers: [] },
  ]);

  const { data: categoriesResponse } = useGetCategoriesQuery();
  const categories = (categoriesResponse?.data as Category[]) || [];

  const { data: heroMenuResponse, refetch: refetchHeroMenu } = useGetHeroMenuByCategoryQuery(
    selectedCategoryId,
    { skip: !selectedCategoryId }
  );

  const [createHeroMenu, { isLoading: isCreating }] = useCreateHeroMenuMutation();
  const [updateHeroMenu, { isLoading: isUpdating }] = useUpdateHeroMenuMutation();

  // All filter type queries
  const { data: settingConfigurationsResponse } = useGetSettingConfigurationsQuery();
  const { data: shankConfigurationsResponse } = useGetShankConfigurationsQuery();
  const { data: holdingMethodsResponse } = useGetHoldingMethodsQuery();
  const { data: bandProfileShapesResponse } = useGetBandProfileShapesQuery();
  const { data: bandWidthCategoriesResponse } = useGetBandWidthCategoriesQuery();
  const { data: bandFitsResponse } = useGetBandFitsQuery();
  const { data: shankTreatmentsResponse } = useGetShankTreatmentsQuery();
  const { data: stylesResponse } = useGetStylesQuery();
  const { data: settingFeaturesResponse } = useGetSettingFeaturesQuery();
  const { data: motifThemesResponse } = useGetMotifThemesQuery();
  const { data: ornamentDetailsResponse } = useGetOrnamentDetailsQuery();

  // Extract data from all responses
  const filterData = {
    settingConfigurations: (settingConfigurationsResponse?.data as ProductAttribute[]) || [],
    shankConfigurations: (shankConfigurationsResponse?.data as ProductAttribute[]) || [],
    holdingMethods: (holdingMethodsResponse?.data as ProductAttribute[]) || [],
    bandProfileShapes: (bandProfileShapesResponse?.data as ProductAttribute[]) || [],
    bandWidthCategories: (bandWidthCategoriesResponse?.data as ProductAttribute[]) || [],
    bandFits: (bandFitsResponse?.data as ProductAttribute[]) || [],
    shankTreatments: (shankTreatmentsResponse?.data as ProductAttribute[]) || [],
    styles: (stylesResponse?.data as ProductAttribute[]) || [],
    settingFeatures: (settingFeaturesResponse?.data as ProductAttribute[]) || [],
    motifThemes: (motifThemesResponse?.data as ProductAttribute[]) || [],
    ornamentDetails: (ornamentDetailsResponse?.data as ProductAttribute[]) || [],
  };

  // Load hero menu data when category is selected or data is fetched
  useEffect(() => {
    if (heroMenuResponse?.data && selectedCategoryId) {
      const heroMenu = heroMenuResponse.data as HeroMenu;
      if (heroMenu.columns && heroMenu.columns.length === 4) {
        setColumns(heroMenu.columns);
        setHasChanges(false);
      }
    } else if (selectedCategoryId && !heroMenuResponse?.data) {
      // Reset to empty columns for new category
      setColumns([
        { columnIndex: 0, headers: [] },
        { columnIndex: 1, headers: [] },
        { columnIndex: 2, headers: [] },
        { columnIndex: 3, headers: [] },
      ]);
      setHasChanges(false);
    }
  }, [heroMenuResponse, selectedCategoryId]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setActiveColumnTab(0);
    setHasChanges(false);
  };

  const addHeader = (columnIndex: number) => {
    const newHeader: HeroMenuHeader = {
      title: "",
      variables: {},
    };
    setColumns((prev) => {
      const newColumns = [...prev];
      newColumns[columnIndex].headers = [...newColumns[columnIndex].headers, newHeader];
      return newColumns;
    });
    setHasChanges(true);
  };

  const removeHeader = (columnIndex: number, headerIndex: number) => {
    setColumns((prev) => {
      const newColumns = [...prev];
      newColumns[columnIndex].headers = newColumns[columnIndex].headers.filter(
        (_, idx) => idx !== headerIndex
      );
      return newColumns;
    });
    setHasChanges(true);
  };

  const updateHeaderTitle = (columnIndex: number, headerIndex: number, title: string) => {
    setColumns((prev) => {
      const newColumns = [...prev];
      newColumns[columnIndex].headers[headerIndex].title = title;
      return newColumns;
    });
    setHasChanges(true);
  };

  const toggleVariable = (
    columnIndex: number,
    headerIndex: number,
    variableType: keyof HeroMenuHeader['variables'],
    variableId: string
  ) => {
    setColumns((prev) => {
      const newColumns = [...prev];
      const header = newColumns[columnIndex].headers[headerIndex];
      
      if (!header.variables[variableType]) {
        header.variables[variableType] = [];
      }
      
      const currentArray = header.variables[variableType] || [];
      const index = currentArray.indexOf(variableId);
      
      if (index > -1) {
        currentArray.splice(index, 1);
      } else {
        currentArray.push(variableId);
      }
      
      header.variables[variableType] = currentArray;
      return newColumns;
    });
    setHasChanges(true);
  };

  const isVariableSelected = (
    columnIndex: number,
    headerIndex: number,
    variableType: keyof HeroMenuHeader['variables'],
    variableId: string
  ): boolean => {
    const header = columns[columnIndex]?.headers[headerIndex];
    if (!header || !header.variables[variableType]) {
      return false;
    }
    return (header.variables[variableType] || []).includes(variableId);
  };

  const handleSave = async () => {
    try {
      if (!selectedCategoryId) {
        toast.error("Please select a category");
        return;
      }

      const heroMenu = heroMenuResponse?.data as HeroMenu | undefined;
      
      if (heroMenu?._id) {
        // Update existing
        await updateHeroMenu({
          id: heroMenu._id,
          data: { columns },
        }).unwrap();
        toast.success("Hero Menu updated successfully!");
      } else {
        // Create new
        await createHeroMenu({
          categoryId: selectedCategoryId,
          columns,
        }).unwrap();
        toast.success("Hero Menu created successfully!");
      }
      
      setHasChanges(false);
      refetchHeroMenu();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save Hero Menu");
    }
  };

  const handleCancel = () => {
    if (heroMenuResponse?.data) {
      const heroMenu = heroMenuResponse.data as HeroMenu;
      if (heroMenu.columns && heroMenu.columns.length === 4) {
        setColumns(heroMenu.columns);
      }
    } else {
      setColumns([
        { columnIndex: 0, headers: [] },
        { columnIndex: 1, headers: [] },
        { columnIndex: 2, headers: [] },
        { columnIndex: 3, headers: [] },
      ]);
    }
    setHasChanges(false);
  };

  // Helper function to split array into two columns
  const splitIntoColumns = (items: ProductAttribute[]) => {
    const mid = Math.ceil(items.length / 2);
    return {
      left: items.slice(0, mid),
      right: items.slice(mid),
    };
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
            <BreadcrumbPage>Hero Menu Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6">
        <h1>Hero Menu Management</h1>
        <p className="text-gray-500 mt-1">Manage hero menu columns and variables for each category</p>
      </div>

      {/* Category Selection Card */}
      <Card className="shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Select Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-md">
            <Label htmlFor="category" className="mb-2 block">Category</Label>
            <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Hero Menu Configuration Card */}
      {selectedCategoryId && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Hero Menu Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Column Tabs */}
            <div className="flex gap-2 mb-6">
              {[0, 1, 2, 3].map((index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => setActiveColumnTab(index)}
                  className={`flex-1 ${
                    activeColumnTab === index
                      ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    activeColumnTab === index
                      ? { backgroundColor: "#dc2626", color: "#ffffff" }
                      : {}
                  }
                >
                  Column {index + 1}
                </Button>
              ))}
            </div>

            {/* Column Content */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Column {activeColumnTab + 1}</h3>
                <Button
                  onClick={() => addHeader(activeColumnTab)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Header
                </Button>
              </div>

              {columns[activeColumnTab]?.headers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No headers added yet. Click "Add Header" to create one.
                </div>
              ) : (
                columns[activeColumnTab]?.headers.map((header, headerIndex) => (
                  <div key={headerIndex} className="border rounded-lg p-6 space-y-4">
                    {/* Header Title */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <Label htmlFor={`header-title-${activeColumnTab}-${headerIndex}`} className="mb-2 block">
                          Header Title
                        </Label>
                        <Input
                          id={`header-title-${activeColumnTab}-${headerIndex}`}
                          value={header.title}
                          onChange={(e) => updateHeaderTitle(activeColumnTab, headerIndex, e.target.value)}
                          placeholder="Enter header title"
                          className="w-full"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => removeHeader(activeColumnTab, headerIndex)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Product Variables */}
                    <div className="space-y-6">
                      {filterTypes.map((filterType) => {
                        const items = filterData[filterType.key];
                        const { left, right } = splitIntoColumns(items);

                        if (items.length === 0) return null;

                        return (
                          <div key={filterType.key} className="space-y-4">
                            <div className="mb-2">
                              <p className="text-sm text-gray-600 font-medium">{filterType.label}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              {/* Left Column */}
                              <div className="space-y-3">
                                {left.map((item) => (
                                  <div key={item._id} className="flex items-center space-x-4">
                                    <Checkbox
                                      id={`${filterType.key}-${activeColumnTab}-${headerIndex}-${item._id}`}
                                      checked={isVariableSelected(
                                        activeColumnTab,
                                        headerIndex,
                                        filterType.key,
                                        item._id
                                      )}
                                      onCheckedChange={() =>
                                        toggleVariable(
                                          activeColumnTab,
                                          headerIndex,
                                          filterType.key,
                                          item._id
                                        )
                                      }
                                      className="w-5 h-5 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                                    />
                                    <Label
                                      htmlFor={`${filterType.key}-${activeColumnTab}-${headerIndex}-${item._id}`}
                                      className="text-base font-normal cursor-pointer flex-1"
                                    >
                                      {item.displayName || item.code}
                                    </Label>
                                  </div>
                                ))}
                              </div>

                              {/* Right Column */}
                              <div className="space-y-3">
                                {right.map((item) => (
                                  <div key={item._id} className="flex items-center space-x-4">
                                    <Checkbox
                                      id={`${filterType.key}-${activeColumnTab}-${headerIndex}-${item._id}-right`}
                                      checked={isVariableSelected(
                                        activeColumnTab,
                                        headerIndex,
                                        filterType.key,
                                        item._id
                                      )}
                                      onCheckedChange={() =>
                                        toggleVariable(
                                          activeColumnTab,
                                          headerIndex,
                                          filterType.key,
                                          item._id
                                        )
                                      }
                                      className="w-5 h-5 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                                    />
                                    <Label
                                      htmlFor={`${filterType.key}-${activeColumnTab}-${headerIndex}-${item._id}-right`}
                                      className="text-base font-normal cursor-pointer flex-1"
                                    >
                                      {item.displayName || item.code}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {filterType.key !== filterTypes[filterTypes.length - 1].key && (
                              <Separator />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Actions */}
            <Separator className="my-6" />
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isCreating || isUpdating || !hasChanges}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isCreating || isUpdating}
                className={`${
                  hasChanges
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isCreating || isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

