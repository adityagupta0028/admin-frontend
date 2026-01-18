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
import {
  useGetHeroMenuByCategoryQuery,
  useCreateHeroMenuMutation,
  useUpdateHeroMenuMutation,
  HeroMenu,
  HeroMenuColumn,
  HeroMenuHeader,
  HeroMenuBlog,
} from "../../store/api/heroMenuApi";
import { useGetCategoriesQuery, Category } from "../../store/api/categoryApi";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Trash2 } from "lucide-react";
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

  // Hero Menu state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [activeColumnTab, setActiveColumnTab] = useState<number>(0);
  const [heroMenuColumns, setHeroMenuColumns] = useState<HeroMenuColumn[]>([
    { columnIndex: 0, headers: [] },
    { columnIndex: 1, headers: [] },
    { columnIndex: 2, headers: [] },
    { columnIndex: 3, headers: [] },
  ]);
  const [heroMenuHasChanges, setHeroMenuHasChanges] = useState(false);

  // Hero Menu queries
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const categories = (categoriesResponse?.data as Category[]) || [];

  const { data: heroMenuResponse, refetch: refetchHeroMenu } = useGetHeroMenuByCategoryQuery(
    selectedCategoryId,
    { skip: !selectedCategoryId || activeMenuTab !== "hero-menu" }
  );

  const [createHeroMenu, { isLoading: isCreatingHeroMenu }] = useCreateHeroMenuMutation();
  const [updateHeroMenu, { isLoading: isUpdatingHeroMenu }] = useUpdateHeroMenuMutation();

  // Get menu filter settings when menu item is selected
  const menuName = activeMenuTab === "main-menu" ? "Main Menu" : activeMenuTab === "side-menu" ? "Side Menu" : "Hero Menu";
  const { data: menuFilterSettingsResponse, refetch: refetchMenuFilterSettings } = useGetMenuFilterSettingsQuery(
    { menuName, menuItem: selectedMenuItem || "" },
    { skip: !selectedMenuItem || activeMenuTab === "hero-menu" }
  );

  // Load hero menu data when category is selected or data is fetched
  useEffect(() => {
    if (activeMenuTab !== "hero-menu" || !selectedCategoryId) {
      return;
    }

    // Always reset first when category changes
    if (heroMenuResponse?.data) {
      const heroMenu = heroMenuResponse.data as HeroMenu;
      
      // Verify the response is for the current category
      const responseCategoryId = typeof heroMenu.categoryId === 'string' 
        ? heroMenu.categoryId 
        : (heroMenu.categoryId as any)?._id || heroMenu.categoryId;

      if (responseCategoryId === selectedCategoryId && heroMenu.columns && heroMenu.columns.length === 4) {
        // Create a deep copy to avoid read-only property errors
        const clonedColumns = heroMenu.columns.map((col) => ({
          columnIndex: col.columnIndex,
          headers: col.headers.map((header) => ({
            title: header.title,
            variables: { ...header.variables },
            blogs: header.blogs ? header.blogs.map((blog) => ({ ...blog })) : []
          }))
        }));
        setHeroMenuColumns(clonedColumns);
        setHeroMenuHasChanges(false);
      } else {
        // Data doesn't match current category, reset
        setHeroMenuColumns([
          { columnIndex: 0, headers: [] },
          { columnIndex: 1, headers: [] },
          { columnIndex: 2, headers: [] },
          { columnIndex: 3, headers: [] },
        ]);
        setHeroMenuHasChanges(false);
      }
    } else {
      // No data for this category, reset to empty
      setHeroMenuColumns([
        { columnIndex: 0, headers: [] },
        { columnIndex: 1, headers: [] },
        { columnIndex: 2, headers: [] },
        { columnIndex: 3, headers: [] },
      ]);
      setHeroMenuHasChanges(false);
    }
  }, [heroMenuResponse, selectedCategoryId, activeMenuTab]);

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

  // Hero Menu handlers
  const handleCategoryChange = (categoryId: string) => {
    // Reset columns immediately when category changes
    setHeroMenuColumns([
      { columnIndex: 0, headers: [] },
      { columnIndex: 1, headers: [] },
      { columnIndex: 2, headers: [] },
      { columnIndex: 3, headers: [] },
    ]);
    setSelectedCategoryId(categoryId);
    setActiveColumnTab(0);
    setHeroMenuHasChanges(false);
  };

  const addHeroMenuHeader = (columnIndex: number) => {
    const newHeader: HeroMenuHeader = {
      title: "",
      variables: {},
      blogs: [],
    };
    setHeroMenuColumns((prev) => {
      const newColumns = prev.map((col, idx) => {
        if (idx === columnIndex) {
          return {
            ...col,
            headers: [...col.headers, newHeader]
          };
        }
        return col;
      });
      return newColumns;
    });
    setHeroMenuHasChanges(true);
  };

  const removeHeroMenuHeader = (columnIndex: number, headerIndex: number) => {
    setHeroMenuColumns((prev) => {
      const newColumns = prev.map((col, idx) => {
        if (idx === columnIndex) {
          return {
            ...col,
            headers: col.headers.filter((_, hIdx) => hIdx !== headerIndex)
          };
        }
        return col;
      });
      return newColumns;
    });
    setHeroMenuHasChanges(true);
  };

  const updateHeroMenuHeaderTitle = (columnIndex: number, headerIndex: number, title: string) => {
    setHeroMenuColumns((prev) => {
      const newColumns = prev.map((col, idx) => {
        if (idx === columnIndex) {
          return {
            ...col,
            headers: col.headers.map((header, hIdx) => {
              if (hIdx === headerIndex) {
                return {
                  ...header,
                  title: title
                };
              }
              return header;
            })
          };
        }
        return col;
      });
      return newColumns;
    });
    setHeroMenuHasChanges(true);
  };

  const toggleHeroMenuVariable = (
    columnIndex: number,
    headerIndex: number,
    variableType: keyof HeroMenuHeader['variables'],
    variableId: string
  ) => {
    setHeroMenuColumns((prev) => {
      const newColumns = prev.map((col, idx) => {
        if (idx === columnIndex) {
          return {
            ...col,
            headers: col.headers.map((header, hIdx) => {
              if (hIdx === headerIndex) {
                const currentArray = header.variables[variableType] || [];
                const index = currentArray.indexOf(variableId);
                const newArray = [...currentArray];
                
                if (index > -1) {
                  newArray.splice(index, 1);
                } else {
                  newArray.push(variableId);
                }
                
                return {
                  ...header,
                  variables: {
                    ...header.variables,
                    [variableType]: newArray
                  }
                };
              }
              return header;
            })
          };
        }
        return col;
      });
      return newColumns;
    });
    setHeroMenuHasChanges(true);
  };

  const isHeroMenuVariableSelected = (
    columnIndex: number,
    headerIndex: number,
    variableType: keyof HeroMenuHeader['variables'],
    variableId: string
  ): boolean => {
    const header = heroMenuColumns[columnIndex]?.headers[headerIndex];
    if (!header || !header.variables[variableType]) {
      return false;
    }
    return (header.variables[variableType] || []).includes(variableId);
  };

  const handleSaveHeroMenu = async () => {
    try {
      if (!selectedCategoryId) {
        toast.error("Please select a category");
        return;
      }

      const heroMenu = heroMenuResponse?.data as HeroMenu | undefined;
      
      if (heroMenu?._id) {
        await updateHeroMenu({
          id: heroMenu._id,
          data: { columns: heroMenuColumns },
        }).unwrap();
        toast.success("Hero Menu updated successfully!");
      } else {
        await createHeroMenu({
          categoryId: selectedCategoryId,
          columns: heroMenuColumns,
        }).unwrap();
        toast.success("Hero Menu created successfully!");
      }
      
      setHeroMenuHasChanges(false);
      refetchHeroMenu();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save Hero Menu");
    }
  };

  const handleCancelHeroMenu = () => {
    if (heroMenuResponse?.data) {
      const heroMenu = heroMenuResponse.data as HeroMenu;
      if (heroMenu.columns && heroMenu.columns.length === 4) {
        const clonedColumns = heroMenu.columns.map((col) => ({
          columnIndex: col.columnIndex,
          headers: col.headers.map((header) => ({
            title: header.title,
            variables: { ...header.variables },
            blogs: header.blogs ? header.blogs.map((blog) => ({ ...blog })) : []
          }))
        }));
        setHeroMenuColumns(clonedColumns);
      }
    } else {
      setHeroMenuColumns([
        { columnIndex: 0, headers: [] },
        { columnIndex: 1, headers: [] },
        { columnIndex: 2, headers: [] },
        { columnIndex: 3, headers: [] },
      ]);
    }
    setHeroMenuHasChanges(false);
  };

  const addBlog = (columnIndex: number, headerIndex: number) => {
    setHeroMenuColumns((prev) => {
      return prev.map((col, idx) => {
        if (idx === columnIndex) {
          return {
            ...col,
            headers: col.headers.map((header, hIdx) => {
              if (hIdx === headerIndex) {
                return {
                  ...header,
                  blogs: [...(header.blogs || []), { title: "", link: "" }]
                };
              }
              return header;
            })
          };
        }
        return col;
      });
    });
    setHeroMenuHasChanges(true);
  };

  const removeBlog = (columnIndex: number, headerIndex: number, blogIndex: number) => {
    setHeroMenuColumns((prev) => {
      return prev.map((col, idx) => {
        if (idx === columnIndex) {
          return {
            ...col,
            headers: col.headers.map((header, hIdx) => {
              if (hIdx === headerIndex) {
                return {
                  ...header,
                  blogs: (header.blogs || []).filter((_, bIdx) => bIdx !== blogIndex)
                };
              }
              return header;
            })
          };
        }
        return col;
      });
    });
    setHeroMenuHasChanges(true);
  };

  const updateBlog = (columnIndex: number, headerIndex: number, blogIndex: number, field: "title" | "link", value: string) => {
    setHeroMenuColumns((prev) => {
      return prev.map((col, idx) => {
        if (idx === columnIndex) {
          return {
            ...col,
            headers: col.headers.map((header, hIdx) => {
              if (hIdx === headerIndex) {
                const newBlogs = [...(header.blogs || [])];
                newBlogs[blogIndex] = { ...newBlogs[blogIndex], [field]: value };
                return {
                  ...header,
                  blogs: newBlogs
                };
              }
              return header;
            })
          };
        }
        return col;
      });
    });
    setHeroMenuHasChanges(true);
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
                setSelectedCategoryId("");
                setActiveColumnTab(0);
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
                setHeroMenuHasChanges(false);
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
          {activeMenuTab === "hero-menu" ? (
            // Hero Menu Management Interface
            <div className="space-y-6">
              {/* Category Selection */}
              <div className="w-full max-w-md">
                <Label htmlFor="hero-category" className="mb-2 block">Select Category</Label>
                <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="hero-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((category) => {
                        const categoryName = category.categoryName;
                        return (
                          categoryName === "Fine Jewelry Collection" ||
                          categoryName === "Wedding Bands & Anniversary Bands" ||
                          categoryName === "Engagement Rings"
                        );
                      })
                      .map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategoryId && (
                <>
                  {/* Column Tabs */}
                  <div className="flex gap-2">
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
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Column {activeColumnTab + 1}</h3>
                      <Button
                        onClick={() => addHeroMenuHeader(activeColumnTab)}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-shadow add-buttom-column"
                        type="button"
                        size="default"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Header
                      </Button>
                    </div>

                    {heroMenuColumns[activeColumnTab]?.headers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        No headers added yet. Click "Add Header" to create one.
                      </div>
                    ) : (
                      heroMenuColumns[activeColumnTab]?.headers.map((header, headerIndex) => (
                        <div key={headerIndex} className="border rounded-lg p-6 space-y-4 bg-gray-50">
                          {/* Header Title Section */}
                          <div className="bg-white p-4 rounded border mb-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <Label htmlFor={`header-title-${activeColumnTab}-${headerIndex}`} className="mb-2 block text-sm font-medium">
                                  Header Title
                                </Label>
                                <Input
                                  id={`header-title-${activeColumnTab}-${headerIndex}`}
                                  value={header.title}
                                  onChange={(e) => updateHeroMenuHeaderTitle(activeColumnTab, headerIndex, e.target.value)}
                                  placeholder="Enter header title (e.g., Setting Types, Styles, etc.)"
                                  className="w-full"
                                />
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => removeHeroMenuHeader(activeColumnTab, headerIndex)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 mt-8"
                                type="button"
                                size="icon"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Product Variables */}
                          <div className="space-y-6">
                            {filterTypes.map((filterType) => {
                              const items = filterData[filterType.key as keyof typeof filterData];
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
                                            checked={isHeroMenuVariableSelected(
                                              activeColumnTab,
                                              headerIndex,
                                              filterType.key as keyof HeroMenuHeader['variables'],
                                              item._id
                                            )}
                                            onCheckedChange={() =>
                                              toggleHeroMenuVariable(
                                                activeColumnTab,
                                                headerIndex,
                                                filterType.key as keyof HeroMenuHeader['variables'],
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
                                            checked={isHeroMenuVariableSelected(
                                              activeColumnTab,
                                              headerIndex,
                                              filterType.key as keyof HeroMenuHeader['variables'],
                                              item._id
                                            )}
                                            onCheckedChange={() =>
                                              toggleHeroMenuVariable(
                                                activeColumnTab,
                                                headerIndex,
                                                filterType.key as keyof HeroMenuHeader['variables'],
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

                          {/* Blog Section inside Header - After variables */}
                          <div className="mt-6 pt-6 border-t-2 border-gray-300">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold">Add Blog</h3>
                              <Button
                                onClick={() => addBlog(activeColumnTab, headerIndex)}
                                className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-shadow px-4 py-2 add-blog-buttom"
                                type="button"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Blog
                              </Button>
                            </div>

                            {(!header.blogs || header.blogs.length === 0) ? (
                              <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                                No blogs added yet. Click "Add Blog" to create one.
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {header.blogs.map((blog, blogIndex) => (
                                  <div key={blogIndex} className="border rounded-lg p-4 bg-white">
                                    <div className="flex items-start gap-4">
                                      <div className="flex-1 space-y-4">
                                        <div>
                                          <Label htmlFor={`blog-title-${activeColumnTab}-${headerIndex}-${blogIndex}`} className="mb-2 block text-sm font-medium">
                                            Title
                                          </Label>
                                          <Input
                                            id={`blog-title-${activeColumnTab}-${headerIndex}-${blogIndex}`}
                                            value={blog.title}
                                            onChange={(e) => updateBlog(activeColumnTab, headerIndex, blogIndex, "title", e.target.value)}
                                            placeholder="Enter blog title"
                                            className="w-full"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor={`blog-link-${activeColumnTab}-${headerIndex}-${blogIndex}`} className="mb-2 block text-sm font-medium">
                                            Link
                                          </Label>
                                          <Input
                                            id={`blog-link-${activeColumnTab}-${headerIndex}-${blogIndex}`}
                                            value={blog.link}
                                            onChange={(e) => updateBlog(activeColumnTab, headerIndex, blogIndex, "link", e.target.value)}
                                            placeholder="Enter blog link (e.g., https://example.com/blog)"
                                            className="w-full"
                                          />
                                        </div>
                                      </div>
                                      <Button
                                        variant="outline"
                                        onClick={() => removeBlog(activeColumnTab, headerIndex, blogIndex)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 mt-8"
                                        type="button"
                                        size="icon"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Hero Menu Footer Actions */}
                  <Separator className="my-6" />
                  <div className="flex items-center justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleCancelHeroMenu}
                      disabled={isCreatingHeroMenu || isUpdatingHeroMenu || !heroMenuHasChanges}
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveHeroMenu}
                      disabled={!heroMenuHasChanges || isCreatingHeroMenu || isUpdatingHeroMenu}
                      className={`${
                        heroMenuHasChanges
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isCreatingHeroMenu || isUpdatingHeroMenu ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </>
              )}

              {!selectedCategoryId && (
                <div className="text-center py-8 text-gray-500">
                  Please select a category to configure Hero Menu
                </div>
              )}
            </div>
          ) : selectedMenuItem && (activeMenuTab === "main-menu" || activeMenuTab === "side-menu") ? (
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

