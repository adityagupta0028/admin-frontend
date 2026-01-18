import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { 
  useGetFilterVisibilityQuery, 
  useUpdateFilterVisibilityMutation, 
  useSaveMenuFilterSettingsMutation,
  useGetMenuFilterSettingsQuery,
  FilterVisibility 
} from "../../store/api/filterApi";
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
  ProductAttribute
} from "../../store/api/productAttributesApi";
import { toast } from "sonner";

// Menu items data
const mainMenuItems = [
  "Engagement Rings",
  "Wedding",
  "Jewellery",
  "Ring",
  "Bracelets",
  "Necklace",
  "Earrings"
];

const sideMenuItems = [
  "Engagement Rings",
  "Wedding",
  "Jewellery",
  "Ring",
  "Bracelets",
  "Necklace",
  "Earrings"
];

const heroMenuItems = [
  "Engagement",
  "Wedding",
  "Jewellery"
];

// Filter type configuration
interface FilterTypeConfig {
  key: string;
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

export function FilterManagement() {
  const { data: filterResponse, isLoading, refetch } = useGetFilterVisibilityQuery();
  const [updateFilterVisibility, { isLoading: isUpdating }] = useUpdateFilterVisibilityMutation();
  const [saveMenuFilterSettings, { isLoading: isSaving }] = useSaveMenuFilterSettingsMutation();
  
  // All filter type queries
  const { data: settingConfigurationsResponse, refetch: refetchSettingConfigurations } = useGetSettingConfigurationsQuery();
  const { data: shankConfigurationsResponse, refetch: refetchShankConfigurations } = useGetShankConfigurationsQuery();
  const { data: holdingMethodsResponse, refetch: refetchHoldingMethods } = useGetHoldingMethodsQuery();
  const { data: bandProfileShapesResponse, refetch: refetchBandProfileShapes } = useGetBandProfileShapesQuery();
  const { data: bandWidthCategoriesResponse, refetch: refetchBandWidthCategories } = useGetBandWidthCategoriesQuery();
  const { data: bandFitsResponse, refetch: refetchBandFits } = useGetBandFitsQuery();
  const { data: shankTreatmentsResponse, refetch: refetchShankTreatments } = useGetShankTreatmentsQuery();
  const { data: stylesResponse, refetch: refetchStyles } = useGetStylesQuery();
  const { data: settingFeaturesResponse, refetch: refetchSettingFeatures } = useGetSettingFeaturesQuery();
  const { data: motifThemesResponse, refetch: refetchMotifThemes } = useGetMotifThemesQuery();
  const { data: ornamentDetailsResponse, refetch: refetchOrnamentDetails } = useGetOrnamentDetailsQuery();
  
  const filters = (filterResponse?.data as FilterVisibility[]) || [];
  
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
  
  const [localFilters, setLocalFilters] = useState<FilterVisibility[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<"main-menu" | "side-menu" | "hero-menu">("main-menu");
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, Set<string>>>({
    settingConfigurations: new Set(),
    shankConfigurations: new Set(),
    holdingMethods: new Set(),
    bandProfileShapes: new Set(),
    bandWidthCategories: new Set(),
    bandFits: new Set(),
    shankTreatments: new Set(),
    styles: new Set(),
    settingFeatures: new Set(),
    motifThemes: new Set(),
    ornamentDetails: new Set(),
  });

  // Get menu filter settings when menu item is selected
  const menuName = activeMenuTab === "main-menu" ? "Main Menu" : activeMenuTab === "side-menu" ? "Side Menu" : "Hero Menu";
  const { data: menuFilterSettingsResponse, refetch: refetchMenuFilterSettings } = useGetMenuFilterSettingsQuery(
    { menuName, menuItem: selectedMenuItem || "" },
    { skip: !selectedMenuItem || activeMenuTab === "hero-menu" }
  );

  useEffect(() => {
    if (filters.length > 0) {
      setLocalFilters([...filters]);
      setHasChanges(false);
    }
  }, [filters]);

  // Fetch all filter types when a Main Menu or Side Menu item is selected
  useEffect(() => {
    if (selectedMenuItem && (activeMenuTab === "main-menu" || activeMenuTab === "side-menu")) {
      refetchSettingConfigurations();
      refetchShankConfigurations();
      refetchHoldingMethods();
      refetchBandProfileShapes();
      refetchBandWidthCategories();
      refetchBandFits();
      refetchShankTreatments();
      refetchStyles();
      refetchSettingFeatures();
      refetchMotifThemes();
      refetchOrnamentDetails();
      refetchMenuFilterSettings();
    }
  }, [selectedMenuItem, activeMenuTab, refetchSettingConfigurations, refetchShankConfigurations, refetchHoldingMethods, refetchBandProfileShapes, refetchBandWidthCategories, refetchBandFits, refetchShankTreatments, refetchStyles, refetchSettingFeatures, refetchMotifThemes, refetchOrnamentDetails, refetchMenuFilterSettings]);

  // Load saved filter settings when menu filter settings are fetched
  useEffect(() => {
    if (menuFilterSettingsResponse?.data && selectedMenuItem) {
      const savedSettings = menuFilterSettingsResponse.data as any[];
      const newSelectedFilters: Record<string, Set<string>> = {
        settingConfigurations: new Set(),
        shankConfigurations: new Set(),
        holdingMethods: new Set(),
        bandProfileShapes: new Set(),
        bandWidthCategories: new Set(),
        bandFits: new Set(),
        shankTreatments: new Set(),
        styles: new Set(),
        settingFeatures: new Set(),
        motifThemes: new Set(),
        ornamentDetails: new Set(),
      };

      savedSettings.forEach((setting) => {
        if (setting.itemKey && setting.items && Array.isArray(setting.items)) {
          newSelectedFilters[setting.itemKey] = new Set(setting.items.map((id: string) => id.toString()));
        }
      });

      setSelectedFilters(newSelectedFilters);
      setHasChanges(false);
    }
  }, [menuFilterSettingsResponse, selectedMenuItem]);

  const handleToggleFilterVisibility = (filterKey: string) => {
    setLocalFilters(prevFilters =>
      prevFilters.map(filter =>
        filter.filterKey === filterKey
          ? { ...filter, isVisible: !filter.isVisible }
          : filter
      )
    );
    setHasChanges(true);
  };

  const handleMenuItemClick = (menuItem: string) => {
    setSelectedMenuItem(menuItem);
    // Reset all selections
    setSelectedFilters({
      settingConfigurations: new Set(),
      shankConfigurations: new Set(),
      holdingMethods: new Set(),
      bandProfileShapes: new Set(),
      bandWidthCategories: new Set(),
      bandFits: new Set(),
      shankTreatments: new Set(),
      styles: new Set(),
      settingFeatures: new Set(),
      motifThemes: new Set(),
      ornamentDetails: new Set(),
    });
  };

  const handleToggleFilterItem = (filterType: string, itemId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      const currentSet = new Set(prev[filterType]);
      if (currentSet.has(itemId)) {
        currentSet.delete(itemId);
      } else {
        currentSet.add(itemId);
      }
      newFilters[filterType] = currentSet;
      return newFilters;
    });
    setHasChanges(true);
  };

  const handleApply = async () => {
    try {
      if (selectedMenuItem && (activeMenuTab === "main-menu" || activeMenuTab === "side-menu")) {
        // Save menu filter settings
        const menuName = activeMenuTab === "main-menu" ? "Main Menu" : "Side Menu";
        const filters = filterTypes
          .filter(filterType => {
            const selectedItems = selectedFilters[filterType.key];
            return selectedItems && selectedItems.size > 0;
          })
          .map(filterType => ({
            item: filterType.label,
            itemKey: filterType.key,
            items: Array.from(selectedFilters[filterType.key])
          }));

        await saveMenuFilterSettings({
          menuName,
          menuItem: selectedMenuItem,
          filters
        }).unwrap();

        toast.success("Filter settings saved successfully!");
        setHasChanges(false);
        refetchMenuFilterSettings();
      } else {
        // Original filter visibility update
        const updateData = {
          filters: localFilters.map(filter => ({
            filterKey: filter.filterKey,
            isVisible: filter.isVisible
          }))
        };
        
        await updateFilterVisibility(updateData).unwrap();
        toast.success("Filter settings updated successfully!");
        setHasChanges(false);
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save filter settings");
    }
  };

  const handleCancel = () => {
    setLocalFilters([...filters]);
    setHasChanges(false);
  };

  // Split filters into two columns
  const leftColumnFilters = localFilters.slice(0, Math.ceil(localFilters.length / 2));
  const rightColumnFilters = localFilters.slice(Math.ceil(localFilters.length / 2));

  // Helper function to split array into two columns
  const splitIntoColumns = (items: ProductAttribute[]) => {
    const mid = Math.ceil(items.length / 2);
    return {
      left: items.slice(0, mid),
      right: items.slice(mid)
    };
  };

  // Get current menu items based on active tab
  const getCurrentMenuItems = () => {
    if (activeMenuTab === "main-menu") return mainMenuItems;
    if (activeMenuTab === "side-menu") return sideMenuItems;
    return heroMenuItems;
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
            <BreadcrumbPage>Filter Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6">
        <h1>Filter Management</h1>
        <p className="text-gray-500 mt-1">Manage which filters are visible on the customer side</p>
      </div>

      {/* Menu Management Section */}
      <Card className="shadow-sm mb-12">
        <CardHeader>
          <CardTitle className="text-lg">Menu Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Select Area Label */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">Select area</p>
          </div>

          {/* Horizontal Button Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setActiveMenuTab("main-menu");
                setSelectedMenuItem(null);
                setSelectedFilters({
                  settingConfigurations: new Set(),
                  shankConfigurations: new Set(),
                  holdingMethods: new Set(),
                  bandProfileShapes: new Set(),
                  bandWidthCategories: new Set(),
                  bandFits: new Set(),
                  shankTreatments: new Set(),
                  styles: new Set(),
                  settingFeatures: new Set(),
                  motifThemes: new Set(),
                  ornamentDetails: new Set(),
                });
                setHasChanges(false);
              }}
              className={`flex-1 ${
                activeMenuTab === "main-menu"
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              style={
                activeMenuTab === "main-menu"
                  ? { backgroundColor: "#dc2626", color: "#ffffff" }
                  : {}
              }
            >
              Main Menu
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setActiveMenuTab("side-menu");
                setSelectedMenuItem(null);
                setSelectedFilters({
                  settingConfigurations: new Set(),
                  shankConfigurations: new Set(),
                  holdingMethods: new Set(),
                  bandProfileShapes: new Set(),
                  bandWidthCategories: new Set(),
                  bandFits: new Set(),
                  shankTreatments: new Set(),
                  styles: new Set(),
                  settingFeatures: new Set(),
                  motifThemes: new Set(),
                  ornamentDetails: new Set(),
                });
                setHasChanges(false);
              }}
              className={`flex-1 ${
                activeMenuTab === "side-menu"
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              style={
                activeMenuTab === "side-menu"
                  ? { backgroundColor: "#dc2626", color: "#ffffff" }
                  : {}
              }
            >
              Side Menu
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setActiveMenuTab("hero-menu");
                setSelectedMenuItem(null);
                setSelectedFilters({
                  settingConfigurations: new Set(),
                  shankConfigurations: new Set(),
                  holdingMethods: new Set(),
                  bandProfileShapes: new Set(),
                  bandWidthCategories: new Set(),
                  bandFits: new Set(),
                  shankTreatments: new Set(),
                  styles: new Set(),
                  settingFeatures: new Set(),
                  motifThemes: new Set(),
                  ornamentDetails: new Set(),
                });
                setHasChanges(false);
              }}
              className={`flex-1 ${
                activeMenuTab === "hero-menu"
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              style={
                activeMenuTab === "hero-menu"
                  ? { backgroundColor: "#dc2626", color: "#ffffff" }
                  : {}
              }
            >
              Hero Menu
            </Button>
          </div>

          {/* Table Content based on active tab */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Menu Item</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentMenuItems().map((item, index) => (
                <TableRow 
                  key={index}
                  onClick={() => {
                    if (activeMenuTab === "main-menu" || activeMenuTab === "side-menu") {
                      handleMenuItemClick(item);
                    }
                  }}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedMenuItem === item && (activeMenuTab === "main-menu" || activeMenuTab === "side-menu")
                      ? "bg-red-50 border-l-4 border-red-600"
                      : ""
                  }`}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filter Settings Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">
             {activeMenuTab === "main-menu" ? "Main Menu" : activeMenuTab === "side-menu" ? "Side Menu" : "Hero Menu"}
            {selectedMenuItem && `: ${selectedMenuItem}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMenuItem && (activeMenuTab === "main-menu" || activeMenuTab === "side-menu") ? (
            // Show all filter types when Main Menu or Side Menu item is selected
            <div className="space-y-8">
              {filterTypes.map((filterType) => {
                const items = filterData[filterType.key as keyof typeof filterData];
                const selectedItems = selectedFilters[filterType.key];
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
                              id={`${filterType.key}-${item._id}`}
                              checked={selectedItems.has(item._id)}
                              onCheckedChange={() => handleToggleFilterItem(filterType.key, item._id)}
                              className="w-5 h-5 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                            />
                            <Label
                              htmlFor={`${filterType.key}-${item._id}`}
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
                              id={`${filterType.key}-${item._id}`}
                              checked={selectedItems.has(item._id)}
                              onCheckedChange={() => handleToggleFilterItem(filterType.key, item._id)}
                              className="w-5 h-5 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                            />
                            <Label
                              htmlFor={`${filterType.key}-${item._id}`}
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
          ) : (
            // Show original filter visibility when no menu item is selected
            isLoading ? (
              <div className="text-center py-8">Loading filter settings...</div>
            ) : (
              <>
                <div className="text-center py-8 text-gray-500">
                  Please select a menu item from {activeMenuTab === "main-menu" ? "Main Menu" : activeMenuTab === "side-menu" ? "Side Menu" : "Hero Menu"} to configure filters
                </div>
              </>
            )
          )}

          {selectedMenuItem && (activeMenuTab === "main-menu" || activeMenuTab === "side-menu") && (
            <>
              <Separator className="mb-6" />

              {/* Footer Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Reload saved settings
                      if (menuFilterSettingsResponse?.data) {
                        const savedSettings = menuFilterSettingsResponse.data as any[];
                        const newSelectedFilters: Record<string, Set<string>> = {
                          settingConfigurations: new Set(),
                          shankConfigurations: new Set(),
                          holdingMethods: new Set(),
                          bandProfileShapes: new Set(),
                          bandWidthCategories: new Set(),
                          bandFits: new Set(),
                          shankTreatments: new Set(),
                          styles: new Set(),
                          settingFeatures: new Set(),
                          motifThemes: new Set(),
                          ornamentDetails: new Set(),
                        };

                        savedSettings.forEach((setting) => {
                          if (setting.itemKey && setting.items && Array.isArray(setting.items)) {
                            newSelectedFilters[setting.itemKey] = new Set(setting.items.map((id: string) => id.toString()));
                          }
                        });

                        setSelectedFilters(newSelectedFilters);
                      } else {
                        // If no saved settings, clear all
                        setSelectedFilters({
                          settingConfigurations: new Set(),
                          shankConfigurations: new Set(),
                          holdingMethods: new Set(),
                          bandProfileShapes: new Set(),
                          bandWidthCategories: new Set(),
                          bandFits: new Set(),
                          shankTreatments: new Set(),
                          styles: new Set(),
                          settingFeatures: new Set(),
                          motifThemes: new Set(),
                          ornamentDetails: new Set(),
                        });
                      }
                      setHasChanges(false);
                    }}
                    disabled={isUpdating || isSaving}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={!hasChanges || isUpdating || isSaving}
                    className={`${
                      hasChanges
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isUpdating || isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

