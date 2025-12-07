"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { cn } from "./utils";

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxHeight?: string;
}

export function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Select options...",
  className,
  disabled = false,
  maxHeight = "300px",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [contentWidth, setContentWidth] = React.useState<string>("auto");

  React.useEffect(() => {
    if (triggerRef.current && open) {
      const width = triggerRef.current.offsetWidth;
      setContentWidth(`${width}px`);
    }
  }, [open]);

  const handleUnselect = (value: string) => {
    onSelectionChange(selected.filter((s) => s !== value));
  };

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter((s) => s !== value));
    } else {
      onSelectionChange([...selected, value]);
    }
  };

  // Debug: Log when popover state changes
  React.useEffect(() => {
    console.log("MultiSelect - Open state:", open);
    console.log("MultiSelect - Options:", options);
    console.log("MultiSelect - Options count:", options.length);
    console.log("MultiSelect - Disabled:", disabled);
  }, [open, options, disabled]);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    console.log("Popover onOpenChange called:", newOpen);
    if (!disabled) {
      setOpen(newOpen);
    }
  }, [disabled]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          type="button"
          className={cn(
            "w-full justify-between min-h-10 h-auto text-left font-normal",
            className
          )}
          disabled={disabled}
        >
          <div className="flex gap-1 flex-wrap flex-1 overflow-hidden">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selected.map((value) => {
                const option = options.find((opt) => opt.value === value);
                return (
                  <Badge
                    variant="secondary"
                    key={value}
                    className="mr-1 mb-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(value);
                    }}
                  >
                    {option?.label || value}
                    <button
                      type="button"
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(value);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(value);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                );
              })
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 z-[99999] !z-[99999]" 
        align="start"
        style={{ width: contentWidth, zIndex: 99999, position: 'fixed' }}
        onOpenAutoFocus={(e) => e.preventDefault()}
        sideOffset={4}
        side="bottom"
        avoidCollisions={true}
      >
        <div
          className="overflow-y-auto p-2"
          style={{ maxHeight }}
        >
          {options.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2">No options available</div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                onClick={() => handleToggle(option.value)}
              >
                <Checkbox
                  checked={selected.includes(option.value)}
                  onCheckedChange={() => handleToggle(option.value)}
                />
                <Label className="cursor-pointer flex-1">{option.label}</Label>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

