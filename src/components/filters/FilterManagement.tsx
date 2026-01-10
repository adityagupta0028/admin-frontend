import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { useGetFilterVisibilityQuery, useUpdateFilterVisibilityMutation, FilterVisibility } from "../../store/api/filterApi";
import { toast } from "sonner";
import { GripVertical } from "lucide-react";

export function FilterManagement() {
  const { data: filterResponse, isLoading, refetch } = useGetFilterVisibilityQuery();
  const [updateFilterVisibility, { isLoading: isUpdating }] = useUpdateFilterVisibilityMutation();
  
  const filters = (filterResponse?.data as FilterVisibility[]) || [];
  
  const [localFilters, setLocalFilters] = useState<FilterVisibility[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (filters.length > 0) {
      setLocalFilters([...filters]);
      setHasChanges(false);
    }
  }, [filters]);

  const handleToggleFilter = (filterKey: string) => {
    setLocalFilters(prevFilters =>
      prevFilters.map(filter =>
        filter.filterKey === filterKey
          ? { ...filter, isVisible: !filter.isVisible }
          : filter
      )
    );
    setHasChanges(true);
  };

  const handleApply = async () => {
    try {
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
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update filter settings");
    }
  };

  const handleCancel = () => {
    setLocalFilters([...filters]);
    setHasChanges(false);
  };

  // Split filters into two columns
  const leftColumnFilters = localFilters.slice(0, Math.ceil(localFilters.length / 2));
  const rightColumnFilters = localFilters.slice(Math.ceil(localFilters.length / 2));

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

      {/* Filter Settings Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Column settings:</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading filter settings...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-3">
                  {leftColumnFilters.map((filter) => (
                    <div key={filter._id} className="flex items-center space-x-4">
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                      {/* <Checkbox
                        id={filter.filterKey}
                        checked={filter.isVisible}
                        onCheckedChange={() => handleToggleFilter(filter.filterKey)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 data-[state=checked]:text-white w-5 h-5 rounded"
                      /> */}
                      <Checkbox
  id={filter.filterKey}
  checked={filter.isVisible}
  onCheckedChange={() => handleToggleFilter(filter.filterKey)}
  className="
    w-5 h-5 rounded
    data-[state=checked]:bg-blue-600
    data-[state=checked]:border-blue-600
    data-[state=checked]:text-white
  "
/>
                      <Label
                        htmlFor={filter.filterKey}
                        className="text-base font-normal cursor-pointer flex-1"
                      >
                        {filter.filterName}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  {rightColumnFilters.map((filter) => (
                    <div key={filter._id} className="flex items-center space-x-4">
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                      <Checkbox
                        id={filter.filterKey}
                        checked={filter.isVisible}
                        onCheckedChange={() => handleToggleFilter(filter.filterKey)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 data-[state=checked]:text-white w-5 h-5 rounded"
                      />
                      <Label
                        htmlFor={filter.filterKey}
                        className="text-base font-normal cursor-pointer flex-1"
                      >
                        {filter.filterName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Footer Actions */}
              <div className="flex items-center justify-between">
                

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={!hasChanges || isUpdating}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={!hasChanges || isUpdating}
                    className={`${
                      hasChanges
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isUpdating ? "Applying..." : "Apply"}
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

