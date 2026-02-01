import React, { useState, useEffect, useRef, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCreateProductMutation } from "../../store/api/productApi";
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
} from "../../store/api/productAttributesApi";
import { useGetSubSubCategoriesQuery } from "../../store/api/subSubCategoryApi";
import { toast } from "sonner";

interface AddProductProps {
  show: boolean;
  handleClose: () => void;
  categories?: any[];
  subCategories?: any[];
  onSuccess?: () => void;
}

type VariantRow = {
  stone_type: string;
  carat_weight: string;
  gold_type: string;
  diamond_quality: string;
  shape: string;
  price: string;             // original price
  discounted_price: string;  // discount price
};

function AddProduct({ show, handleClose, categories = [], subCategories = [], onSuccess }: AddProductProps) {
  // Form state
  const [productId, setProductId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [discountedPrice, setDiscountedPrice] = useState<string>("");
  const [discountLabel, setDiscountLabel] = useState<string>("");
  const [selectedVideoFiles, setSelectedVideoFiles] = useState<File[]>([]);
  console.log(categories, subCategories);
  // Category and SubCategory
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedSubSubCategories, setSelectedSubSubCategories] = useState<string[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] = useState(false);
  const [subSubCategoryDropdownOpen, setSubSubCategoryDropdownOpen] = useState(false);
  const [variants, setVariants] = useState<VariantRow[]>([]);

  // Metal Type
  const [selectedMetalColors, setSelectedMetalColors] = useState<string[]>([]);
  const [selectedMetalKarats, setSelectedMetalKarats] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedDesignStyles, setSelectedDesignStyles] = useState<string[]>([]);
  const metalTypes = useMemo(() => {
    const types: string[] = [];
    selectedMetalColors.forEach(color => {
      if (color === "Platinum") {
        types.push("Platinum");
      } else {
        selectedMetalKarats.forEach(karat => {
          types.push(`${karat} ${color}`);
        });
      }
    });
    return types;
  }, [selectedMetalColors, selectedMetalKarats]);

  // Metal Images: { [metalType]: { [viewAngle]: File } } - single image per view angle
  const [metalImages, setMetalImages] = useState<Record<string, Record<string, File>>>({});

  // Metal View Angles: { [metalType]: string[] } - all 3 view angles are required
  const [metalViewAngles, setMetalViewAngles] = useState<Record<string, string[]>>({});

  // Diamond fields
  const [diamondOrigin, setDiamondOrigin] = useState<string>("");
  const [diamondGrading, setDiamondGrading] = useState<"single" | "double">("single");
  const [diamondQualities, setDiamondQualities] = useState<string[]>([]);
  const [diamondDropdownOpen, setDiamondDropdownOpen] = useState(false);
  const [diamondQualityDropdownOpen, setDiamondQualityDropdownOpen] = useState(false);

  // Carat Weight
  const [caratWeights, setCaratWeights] = useState<string[]>([]);

  // Stone
  const [stones, setStones] = useState<string[]>([]);

  // Ring Size and Necklace Size
  const [ringSizes, setRingSizes] = useState<string[]>([]);
  const [necklaceSizes, setNecklaceSizes] = useState<string[]>([]);
  const [ringSizeDropdownOpen, setRingSizeDropdownOpen] = useState(false);
  const [necklaceSizeDropdownOpen, setNecklaceSizeDropdownOpen] = useState(false);

  // Text areas
  const [engraving, setEngraving] = useState<boolean>(false);
  const [gift, setGift] = useState<boolean>(false);
  const [productDetails, setProductDetails] = useState<string>("");
  const [centerStoneDetails, setCenterStoneDetails] = useState<string>("");
  const [sideStoneDetails, setSideStoneDetails] = useState<string>("");
  const [stoneDetails, setStoneDetails] = useState<string>("");
  const [sizeType, setSizeType] = useState<"ring" | "necklace">("ring");
  // Gender
  const [gender, setGender] = useState<string>("Male");
  // Product Specials
  const [productSpecials, setProductSpecials] = useState<string>("");
  // Status
  const [status, setStatus] = useState<string>("active");

  // Radio button fields (single select)
  const [settingConfigurations, setSettingConfigurations] = useState<string>("");
  const [shankConfigurations, setShankConfigurations] = useState<string>("");
  const [holdingMethods, setHoldingMethods] = useState<string>("");
  const [bandProfileShapes, setBandProfileShapes] = useState<string>("");
  const [bandWidthCategories, setBandWidthCategories] = useState<string>("");
  const [bandFits, setBandFits] = useState<string>("");
  // Collections
  const [collections, setCollections] = useState<string>("");

  // Multi-select dropdown fields
  const [shankTreatments, setShankTreatments] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [settingFeatures, setSettingFeatures] = useState<string[]>([]);
  const [motifThemes, setMotifThemes] = useState<string[]>([]);
  const [ornamentDetails, setOrnamentDetails] = useState<string[]>([]);

  // New Product Details Fields
  const [averageWidth, setAverageWidth] = useState<string>("");
  const [rhodiumPlate, setRhodiumPlate] = useState<string>("Yes");
  const [isProductDetailsAccordionOpen, setIsProductDetailsAccordionOpen] = useState<boolean>(false);

  // Center Stone Details Fields
  const [isCenterStoneAccordionOpen, setIsCenterStoneAccordionOpen] = useState<boolean>(false);
  const [centerStoneCertified, setCenterStoneCertified] = useState<string>("No");
  const [centerStoneShape, setCenterStoneShape] = useState<string>("");
  const [centerStoneMinWeight, setCenterStoneMinWeight] = useState<string>("");
  const [centerStoneColor, setCenterStoneColor] = useState<string>("");
  const [centerStoneColorQuality, setCenterStoneColorQuality] = useState<string>("");
  const [centerStoneClarity, setCenterStoneClarity] = useState<string>("");
  const [centerStoneDiamondQuality, setCenterStoneDiamondQuality] = useState<string>("");
  const [centerStoneQualityType, setCenterStoneQualityType] = useState<string>("");
  const [hasCenterStone, setHasCenterStone] = useState(false);

  // Dropdown open states for multi-select
  const [shankTreatmentsDropdownOpen, setShankTreatmentsDropdownOpen] = useState(false);

  // Side Stone Details Fields
  const [hasSideStone, setHasSideStone] = useState<boolean>(false);
  const [isSideStoneAccordionOpen, setIsSideStoneAccordionOpen] = useState<boolean>(false);

  const [sideStones, setSideStones] = useState<string[]>([]);
  const [sideStonesData, setSideStonesData] = useState<Record<string, {
    origins: string[];
    shapes: string[];
    dimensions: string;
    gemstoneType: string;
    quantity: string;
    avgColor: string;
    avgClarity: string;
    minDiamondWeight: string;
  }>>({});

  // Stone Details Form Fields
  const [hasStoneDetailsForm, setHasStoneDetailsForm] = useState<boolean>(false);
  const [isStoneDetailsFormAccordionOpen, setIsStoneDetailsFormAccordionOpen] = useState<boolean>(false);
  const [stoneDetailsStones, setStoneDetailsStones] = useState<string[]>([]);
  const [stoneDetailsData, setStoneDetailsData] = useState<Record<string, {
    origins: string[];
    shapes: string[];
    dimensions: string;
    gemstoneType: string;
    quantity: string;
    avgColor: string;
    avgClarity: string;
    minDiamondWeight: string;
  }>>({});
  const [stoneDetailsCertified, setStoneDetailsCertified] = useState<string>("No");
  const [stoneDetailsColor, setStoneDetailsColor] = useState<string>("");


  const [caratMinWeights, setCaratMinWeights] = useState<Record<string, string>>({});
  const [stylesDropdownOpen, setStylesDropdownOpen] = useState(false);
  const [settingFeaturesDropdownOpen, setSettingFeaturesDropdownOpen] = useState(false);
  const [motifThemesDropdownOpen, setMotifThemesDropdownOpen] = useState(false);
  const [ornamentDetailsDropdownOpen, setOrnamentDetailsDropdownOpen] = useState(false);

  // Refs for dropdowns
  const shankTreatmentsDropdownRef = useRef<HTMLDivElement>(null);
  const stylesDropdownRef = useRef<HTMLDivElement>(null);
  const settingFeaturesDropdownRef = useRef<HTMLDivElement>(null);
  const motifThemesDropdownRef = useRef<HTMLDivElement>(null);
  const ornamentDetailsDropdownRef = useRef<HTMLDivElement>(null);

  // Loading state
  const [createProduct, { isLoading }] = useCreateProductMutation();

  // Fetch product attributes
  const { data: settingConfigurationsData } = useGetSettingConfigurationsQuery();
  const { data: shankConfigurationsData } = useGetShankConfigurationsQuery();
  const { data: holdingMethodsData } = useGetHoldingMethodsQuery();
  const { data: bandProfileShapesData } = useGetBandProfileShapesQuery();
  const { data: bandWidthCategoriesData } = useGetBandWidthCategoriesQuery();
  const { data: bandFitsData } = useGetBandFitsQuery();
  const { data: shankTreatmentsData } = useGetShankTreatmentsQuery();
  const { data: stylesData } = useGetStylesQuery();
  const { data: settingFeaturesData } = useGetSettingFeaturesQuery();
  const { data: motifThemesData } = useGetMotifThemesQuery();
  const { data: ornamentDetailsData } = useGetOrnamentDetailsQuery();

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const subCategoryDropdownRef = useRef<HTMLDivElement>(null);
  const subSubCategoryDropdownRef = useRef<HTMLDivElement>(null);
  const diamondDropdownRef = useRef<HTMLDivElement>(null);
  const diamondQualityDropdownRef = useRef<HTMLDivElement>(null);
  const ringSizeDropdownRef = useRef<HTMLDivElement>(null);
  const necklaceSizeDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch subSubCategories - we'll filter client-side based on selected subCategories
  // Note: The API might need to support multiple subCategoryIds, but for now we fetch all and filter
  const { data: subSubCategoriesResponse } = useGetSubSubCategoriesQuery();
  const allSubSubCategories = (subSubCategoriesResponse?.data as any[]) || [];

  // Filter subcategories based on selected category
  const filteredSubCategories = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }
    return subCategories.filter((subCat) => {
      const categoryId = typeof subCat?.categoryId === 'object'
        ? subCat?.categoryId?._id
        : subCat?.categoryId;
      return categoryId === selectedCategory;
    });
  }, [subCategories, selectedCategory]);

  // Get category/subcategory display names
  const getCategoryName = (category: any) => {
    if (!category) return '';
    return category.categoryName || category.title || category.label || '';
  };

  const getSubCategoryName = (subCategory: any) => {
    if (!subCategory) return '';
    return subCategory.title || subCategory.subCategoryName || subCategory.label || '';
  };

  const getCategoryId = (category: any) => {
    return category._id || category.id || category.value || '';
  };

  const getSubCategoryId = (subCategory: any) => {
    return subCategory._id || subCategory.id || subCategory.value || '';
  };

  const getSubSubCategoryName = (subSubCategory: any) => {
    if (!subSubCategory) return '';
    return subSubCategory.title || subSubCategory.subSubCategoryName || subSubCategory.label || '';
  };

  const getSubSubCategoryId = (subSubCategory: any) => {
    return subSubCategory._id || subSubCategory.id || subSubCategory.value || '';
  };

  // Filter subSubCategories based on selected subCategories
  const filteredSubSubCategories = useMemo(() => {
    if (selectedSubCategories.length === 0) {
      return [];
    }
    return allSubSubCategories.filter((subSubCat) => {
      const subCategoryId = typeof subSubCat?.subCategoryId === 'object'
        ? subSubCat?.subCategoryId?._id
        : subSubCat?.subCategoryId;
      return selectedSubCategories.includes(subCategoryId);
    });
  }, [allSubSubCategories, selectedSubCategories]);

  // Filter categories for Rings - only show 3 fixed categories
  const filteredCategories = useMemo(() => {
    const allowedCategoryNames = [
      "Ring",
      "Rings",
      "Wedding Bands & Anniversary Bands",
      "Engagement Rings"
    ];

    return categories.filter((category) => {
      const categoryName = getCategoryName(category);
      return allowedCategoryNames.includes(categoryName);
    });
  }, [categories]);

  // Check if selected category is one that doesn't need subcategory/sub-subcategory
  const shouldDisableSubCategories = useMemo(() => {
    if (!selectedCategory) return false;
    const selectedCat = filteredCategories.find((cat) => getCategoryId(cat) === selectedCategory);
    if (!selectedCat) return false;
    const categoryName = getCategoryName(selectedCat);
    return categoryName === "Engagement Rings" || categoryName === "Wedding Bands & Anniversary Bands";
  }, [selectedCategory, filteredCategories]);

  const diamondOriginStatic = [
    { id: 1, label: "Natural", value: "natural" },
    { id: 2, label: "Lab Grown", value: "lab grown" },
  ];

  const diamondQualityStatic = [
    { id: 1, label: "Excellent", value: "excellent" },
    { id: 2, label: "Very Good", value: "very good" },
    { id: 3, label: "Good", value: "good" },
    { id: 4, label: "Fair", value: "fair" },
  ];

  const ringSizeStatic = ["4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const necklaceSizeStatic = ["16\"", "18\"", "20\"", "22\"", "24\""];
  //const caratWeightOptions = ["0.5", "1", "1.5", "2", "2.5", "3", "4", "5"];
  const caratWeightOptions = [
    "0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3", "3.25", "3.5", "3.75", "4", "4.25", "4.5", "4.75", "5",
    "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15",
    "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"
  ];

  const diamondShapeStatic = [
    "Round", "Princess", "Cushion", "Oval", "Emerald", "Pear", "Radiant", "Asscher", "Marquise", "Heart"
  ];

  const diamondQualityOptions = [
    { label: "Best", color: "D", clarity: "VVS", fullLabel: "Best - D, VVS", type: "single" },
    { label: "Better", color: "E", clarity: "VS1", fullLabel: "Better - E, VS1", type: "single" },
    { label: "Good", color: "F", clarity: "VS2", fullLabel: "Good - F, VS2", type: "single" },
    { label: "DQ1", color: "DE", clarity: "CL1", fullLabel: "DQ1 - DE, CL1", type: "double" },
    { label: "DQ2", color: "EF", clarity: "CL2", fullLabel: "DQ2 - EF, CL2", type: "double" },
    { label: "DQ3", color: "FG", clarity: "CL3", fullLabel: "DQ3 - FG, CL3", type: "double" },
    { label: "DQ4", color: "GH", clarity: "CL4", fullLabel: "DQ4 - GH, CL4", type: "double" },
  ];

  const viewAngleOptions = [
    { id: 1, label: "Angled view", value: "Angled view", required: true },
    { id: 2, label: "Top view", value: "Top view", required: true },
    { id: 3, label: "Side view", value: "Side view", required: true },
    { id: 4, label: "Images 1", value: "Image 1", required: false },
    { id: 5, label: "Images 2", value: "Image 2", required: false },
    { id: 6, label: "Images 3", value: "Image 3", required: false },
  ];

  const requiredViewAngles = viewAngleOptions.filter(a => a.required).map(a => a.value);
  const optionalViewAngles = viewAngleOptions.filter(a => !a.required).map(a => a.value);

  // Handle video file selection
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []) as File[];
    setSelectedVideoFiles((prev) => [...prev, ...files]);
  };

  // Remove video
  const removeVideo = (index: number) => {
    const updated = [...selectedVideoFiles];
    updated.splice(index, 1);
    setSelectedVideoFiles(updated);
  };

  // Handle category selection (single select)
  const handleCategorySelect = (category: any) => {
    const categoryId = getCategoryId(category);
    setSelectedCategory(categoryId);
    // Clear subcategories and sub-subcategories when category changes
    setSelectedSubCategories([]);
    setSelectedSubSubCategories([]);
    setCategoryDropdownOpen(false);
    // Close subcategory dropdowns when category changes
    setSubCategoryDropdownOpen(false);
    setSubSubCategoryDropdownOpen(false);
  };

  // Toggle subcategory selection
  const toggleSubCategory = (subCategory: any) => {
    const subCategoryId = getSubCategoryId(subCategory);
    setSelectedSubCategories((prev) => {
      const isRemoving = prev.includes(subCategoryId);
      if (isRemoving) {
        // Remove subcategory and also remove subSubCategories that belong to this subcategory
        const updated = prev.filter((c) => c !== subCategoryId);
        setSelectedSubSubCategories((prevSubSub) => {
          return prevSubSub.filter((subSubId) => {
            const subSubCat = allSubSubCategories.find((ssc) => getSubSubCategoryId(ssc) === subSubId);
            if (!subSubCat) return true;
            const subSubCatSubCategoryId = typeof subSubCat.subCategoryId === 'object'
              ? subSubCat.subCategoryId._id
              : subSubCat.subCategoryId;
            return subSubCatSubCategoryId !== subCategoryId;
          });
        });
        return updated;
      } else {
        return [...prev, subCategoryId];
      }
    });
  };

  // Toggle subSubCategory selection
  const toggleSubSubCategory = (subSubCategory: any) => {
    const subSubCategoryId = getSubSubCategoryId(subSubCategory);
    setSelectedSubSubCategories((prev) =>
      prev.includes(subSubCategoryId)
        ? prev.filter((c) => c !== subSubCategoryId)
        : [...prev, subSubCategoryId]
    );
  };

  // Select diamond origin (single select)
  const selectDiamondOrigin = (origin: { value: string }) => {
    setDiamondOrigin(origin.value);
    setDiamondDropdownOpen(false);
  };

  // Toggle diamond quality
  const toggleDiamondQuality = (quality: { value: string }) => {
    setDiamondQualities((prev) =>
      prev.includes(quality.value)
        ? prev.filter((q) => q !== quality.value)
        : [...prev, quality.value]
    );
  };

  // Toggle ring size
  const toggleRingSize = (size: string) => {
    setRingSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  // Toggle necklace size
  const toggleNecklaceSize = (size: string) => {
    setNecklaceSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  // Toggle metal color
  const toggleMetalColor = (color: string) => {
    setSelectedMetalColors((prev) => {
      const isRemoving = prev.includes(color);
      if (isRemoving) {
        // Remove metal color and its associated image data for all shapes
        setMetalImages((imgPrev) => {
          const newImages = { ...imgPrev };
          selectedShapes.forEach(shape => {
            delete newImages[`${color}_${shape}`];
          });
          return newImages;
        });
        setMetalViewAngles((anglePrev) => {
          const newAngles = { ...anglePrev };
          selectedShapes.forEach(shape => {
            delete newAngles[`${color}_${shape}`];
          });
          return newAngles;
        });
        return prev.filter((c) => c !== color);
      } else {
        // Add metal color - setup required angles for all selected shapes
        const newImagesAdd: Record<string, Record<string, File>> = {};
        const newAnglesAdd: Record<string, string[]> = {};
        selectedShapes.forEach(shape => {
          const key = `${color}_${shape}`;
          newImagesAdd[key] = {};
          newAnglesAdd[key] = ["Angled view", "Top view", "Side view"];
        });

        setMetalImages((imgPrev) => ({ ...imgPrev, ...newImagesAdd }));
        setMetalViewAngles((anglePrev) => ({ ...anglePrev, ...newAnglesAdd }));
        return [...prev, color];
      }
    });
  };

  // Toggle shape
  const toggleShape = (shape: string) => {
    setSelectedShapes((prev) => {
      const isRemoving = prev.includes(shape);
      if (isRemoving) {
        // Remove shape and its associated image data for all colors
        setMetalImages((imgPrev) => {
          const newImages = { ...imgPrev };
          selectedMetalColors.forEach(color => {
            delete newImages[`${color}_${shape}`];
          });
          return newImages;
        });
        setMetalViewAngles((anglePrev) => {
          const newAngles = { ...anglePrev };
          selectedMetalColors.forEach(color => {
            delete newAngles[`${color}_${shape}`];
          });
          return newAngles;
        });
        return prev.filter((s) => s !== shape);
      } else {
        // Add shape - setup required angles for all selected colors
        const newImagesAdd: Record<string, Record<string, File>> = {};
        const newAnglesAdd: Record<string, string[]> = {};
        selectedMetalColors.forEach(color => {
          const key = `${color}_${shape}`;
          newImagesAdd[key] = {};
          newAnglesAdd[key] = ["Angled view", "Top view", "Side view"];
        });

        setMetalImages((imgPrev) => ({ ...imgPrev, ...newImagesAdd }));
        setMetalViewAngles((anglePrev) => ({ ...anglePrev, ...newAnglesAdd }));
        return [...prev, shape];
      }
    });
  };

  // Toggle metal karat
  const toggleMetalKarat = (karat: string) => {
    setSelectedMetalKarats((prev) =>
      prev.includes(karat)
        ? prev.filter((k) => k !== karat)
        : [...prev, karat]
    );
  };

  // Toggle design style
  const toggleDesignStyle = (style: string) => {
    setSelectedDesignStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  // Toggle optional view angle for a metal type
  const toggleOptionalViewAngle = (metalType: string, viewAngle: string) => {
    setMetalViewAngles((prev) => {
      const currentAngles = prev[metalType] || [];
      if (currentAngles.includes(viewAngle)) {
        // Remove optional angle
        const updated = currentAngles.filter(a => a !== viewAngle);
        setMetalImages((imgPrev) => {
          const newImages = { ...imgPrev };
          if (newImages[metalType]) {
            delete newImages[metalType][viewAngle];
          }
          return newImages;
        });
        return { ...prev, [metalType]: updated };
      } else {
        // Add optional angle
        return { ...prev, [metalType]: [...currentAngles, viewAngle] };
      }
    });
  };

  // Handle image upload for specific metal type and view angle (single file)
  const handleMetalImageUpload = (metalType: string, viewAngle: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMetalImages((prev) => ({
        ...prev,
        [metalType]: {
          ...prev[metalType],
          [viewAngle]: file
        }
      }));
    }
  };

  // Remove image for specific metal type and view angle
  const removeMetalImage = (metalType: string, viewAngle: string) => {
    setMetalImages((prev) => {
      const newImages = { ...prev };
      if (newImages[metalType]) {
        delete newImages[metalType][viewAngle];
      }
      return newImages;
    });
    // Reset the file input
    const input = document.querySelector(`input[data-metal="${metalType}"][data-angle="${viewAngle}"]`) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  // Toggle carat weight
  const toggleCaratWeight = (weight: string) => {
    setCaratWeights((prev) =>
      prev.includes(weight)
        ? prev.filter((w) => w !== weight)
        : [...prev, weight]
    );
  };

  // Toggle side stone
  const toggleSideStone = (stone: string) => {
    setSideStones((prev) => {
      const isRemoving = prev.includes(stone);
      if (isRemoving) {
        setSideStonesData((dataPrev) => {
          const newData = { ...dataPrev };
          delete newData[stone];
          return newData;
        });
        return prev.filter((s) => s !== stone);
      } else {
        setSideStonesData((dataPrev) => ({
          ...dataPrev,
          [stone]: { origins: [], shapes: [], dimensions: "", gemstoneType: "", quantity: "", avgColor: "", avgClarity: "", minDiamondWeight: "" }
        }));
        return [...prev, stone];
      }
    });
  };

  // Update side stone data
  const updateSideStoneData = (stone: string, field: string, value: any) => {
    setSideStonesData((prev) => ({
      ...prev,
      [stone]: {
        ...prev[stone],
        [field]: value
      }
    }));
  };

  // Toggle side stone origin
  const toggleSideStoneOrigin = (stone: string, origin: string) => {
    setSideStonesData((prev) => {
      const currentOrigins = prev[stone]?.origins || [];
      const updatedOrigins = currentOrigins.includes(origin)
        ? currentOrigins.filter((o) => o !== origin)
        : [...currentOrigins, origin];

      return {
        ...prev,
        [stone]: {
          ...prev[stone],
          origins: updatedOrigins
        }
      };
    });
  };

  // Stone Details Form Handlers
  const toggleStoneDetailStone = (stone: string) => {
    setStoneDetailsStones((prev) => {
      const isRemoving = prev.includes(stone);
      if (isRemoving) {
        setStoneDetailsData((dataPrev) => {
          const newData = { ...dataPrev };
          delete newData[stone];
          return newData;
        });
        return prev.filter((s) => s !== stone);
      } else {
        setStoneDetailsData((dataPrev) => ({
          ...dataPrev,
          [stone]: { origins: [], shapes: [], dimensions: "", gemstoneType: "", quantity: "", avgColor: "", avgClarity: "", minDiamondWeight: "" }
        }));
        return [...prev, stone];
      }
    });
  };

  const updateStoneDetailData = (stone: string, field: string, value: any) => {
    setStoneDetailsData((prev) => ({
      ...prev,
      [stone]: {
        ...prev[stone],
        [field]: value
      }
    }));
  };

  const toggleStoneDetailOrigin = (stone: string, origin: string) => {
    setStoneDetailsData((prev) => {
      const currentOrigins = prev[stone]?.origins || [];
      const updatedOrigins = currentOrigins.includes(origin)
        ? currentOrigins.filter((o) => o !== origin)
        : [...currentOrigins, origin];

      return {
        ...prev,
        [stone]: {
          ...prev[stone],
          origins: updatedOrigins
        }
      };
    });
  };

  // Toggle stone
  const toggleStone = (stone: string) => {
    setStones((prev) =>
      prev.includes(stone)
        ? prev.filter((s) => s !== stone)
        : [...prev, stone]
    );
  };

  // Toggle multi-select dropdown fields
  const toggleShankTreatment = (id: string) => {
    setShankTreatments((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleStyle = (id: string) => {
    setStyles((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleSettingFeature = (id: string) => {
    setSettingFeatures((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleMotifTheme = (id: string) => {
    setMotifThemes((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleOrnamentDetail = (id: string) => {
    setOrnamentDetails((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (subCategoryDropdownRef.current && !subCategoryDropdownRef.current.contains(event.target as Node)) {
        setSubCategoryDropdownOpen(false);
      }
      if (subSubCategoryDropdownRef.current && !subSubCategoryDropdownRef.current.contains(event.target as Node)) {
        setSubSubCategoryDropdownOpen(false);
      }
      if (diamondDropdownRef.current && !diamondDropdownRef.current.contains(event.target as Node)) {
        setDiamondDropdownOpen(false);
      }
      if (diamondQualityDropdownRef.current && !diamondQualityDropdownRef.current.contains(event.target as Node)) {
        setDiamondQualityDropdownOpen(false);
      }
      if (ringSizeDropdownRef.current && !ringSizeDropdownRef.current.contains(event.target as Node)) {
        setRingSizeDropdownOpen(false);
      }
      if (necklaceSizeDropdownRef.current && !necklaceSizeDropdownRef.current.contains(event.target as Node)) {
        setNecklaceSizeDropdownOpen(false);
      }
      if (shankTreatmentsDropdownRef.current && !shankTreatmentsDropdownRef.current.contains(event.target as Node)) {
        setShankTreatmentsDropdownOpen(false);
      }
      if (stylesDropdownRef.current && !stylesDropdownRef.current.contains(event.target as Node)) {
        setStylesDropdownOpen(false);
      }
      if (settingFeaturesDropdownRef.current && !settingFeaturesDropdownRef.current.contains(event.target as Node)) {
        setSettingFeaturesDropdownOpen(false);
      }
      if (motifThemesDropdownRef.current && !motifThemesDropdownRef.current.contains(event.target as Node)) {
        setMotifThemesDropdownOpen(false);
      }
      if (ornamentDetailsDropdownRef.current && !ornamentDetailsDropdownRef.current.contains(event.target as Node)) {
        setOrnamentDetailsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset form
  const resetForm = () => {
    setProductId("");
    setProductName("");
    setDescription("");
    setOriginalPrice("");
    setDiscountedPrice("");
    setDiscountLabel("");
    setSelectedVideoFiles([]);
    setSelectedCategory("");
    setSelectedSubCategories([]);
    setSelectedSubSubCategories([]);
    setSelectedMetalColors([]);
    setSelectedMetalKarats([]);
    setSelectedShapes([]);
    setMetalImages({});
    setMetalViewAngles({});
    setDiamondOrigin("");
    setDiamondQualities([]);
    setCaratWeights([]);
    setStones([]);
    setRingSizes([]);
    setNecklaceSizes([]);
    setEngraving(false);
    setGift(false);
    setProductDetails("");
    setCenterStoneDetails("");
    setSideStoneDetails("");
    setStoneDetails("");
    setGender("Male");
    setProductSpecials("");
    setStatus("active");
    // Reset new fields
    setSettingConfigurations("");
    setShankConfigurations("");
    setHoldingMethods("");
    setBandProfileShapes("");
    setBandWidthCategories("");
    setBandFits("");
    setCollections("");
    setShankTreatments([]);
    setStyles([]);
    setSettingFeatures([]);
    setMotifThemes([]);
    setOrnamentDetails([]);
    setSideStones([]);
    setSideStonesData({});
    setAverageWidth("");
    setRhodiumPlate("Yes");
    setCenterStoneCertified("No");
    setCenterStoneShape("");
    setCenterStoneMinWeight("");
    setCenterStoneColor("");
    setCenterStoneColorQuality("");
    setCenterStoneClarity("");
    setCenterStoneDiamondQuality("");
    setCenterStoneQualityType("");
    setHasSideStone(false);
    setCaratMinWeights({});
    // Reset Stone Details Form
    setHasStoneDetailsForm(false);
    setIsStoneDetailsFormAccordionOpen(false);
    setStoneDetailsStones([]);
    setStoneDetailsData({});
    setStoneDetailsCertified("No");
    setStoneDetailsColor("");
    setSelectedDesignStyles([]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!productName.trim()) {
      toast.error("Please enter Product Name");
      return;
    }
    // if (!discountedPrice || parseFloat(discountedPrice) <= 0) {
    //   toast.error("Please enter a valid Discounted Price");
    //   return;
    // }
    if (!selectedCategory) {
      toast.error("Please select a Category");
      return;
    }
    // Only validate subcategory and sub-subcategory if they are required
    if (!shouldDisableSubCategories) {
      if (selectedSubCategories.length === 0) {
        toast.error("Please select at least one Sub Category");
        return;
      }
      if (selectedSubSubCategories.length === 0) {
        toast.error("Please select at least one Sub SubCategory");
        return;
      }
    }
    if (!settingConfigurations) {
      toast.error("Please select Setting Configurations");
      return;
    }
    if (!shankConfigurations) {
      toast.error("Please select Shank Configurations");
      return;
    }
    if (!holdingMethods) {
      toast.error("Please select Holding Methods");
      return;
    }
    if (!bandProfileShapes) {
      toast.error("Please select Band Profile Shapes");
      return;
    }
    if (!bandWidthCategories) {
      toast.error("Please select Band Width Categories");
      return;
    }
    if (!bandFits) {
      toast.error("Please select Band Fits");
      return;
    }
    if (shankTreatments.length === 0) {
      toast.error("Please select at least one Shank Treatment");
      return;
    }
    if (styles.length === 0) {
      toast.error("Please select at least one Style");
      return;
    }
    if (settingFeatures.length === 0) {
      toast.error("Please select at least one Setting Feature");
      return;
    }
    if (motifThemes.length === 0) {
      toast.error("Please select at least one Motif Theme");
      return;
    }
    if (ornamentDetails.length === 0) {
      toast.error("Please select at least one Ornament Detail");
      return;
    }

    // Validate metal images - mandatory view angles must have images for each color + shape combination
    if (selectedMetalColors.length > 0 && selectedShapes.length > 0) {
      const mandatoryAngles = ["Angled view", "Top view", "Side view"];
      for (const color of selectedMetalColors) {
        for (const shape of selectedShapes) {
          const key = `${color}_${shape}`;
          for (const viewAngle of mandatoryAngles) {
            if (!metalImages[key]?.[viewAngle]) {
              toast.error(`Please upload an image for ${viewAngle} of ${color} (${shape})`);
              return;
            }
          }
        }
      }
    }

    try {
      const formData = new FormData();

      // Basic fields
      if (productId.trim()) {
        formData.append("product_id", productId.trim());
      }
      formData.append("product_name", productName.trim());
      if (description.trim()) formData.append("description", description.trim());
      // if (originalPrice) formData.append("original_price", originalPrice);
      // formData.append("discounted_price", discountedPrice);
      if (discountLabel.trim()) formData.append("discount_label", discountLabel.trim());

      // Categories (single category)
      formData.append("categoryId", selectedCategory);
      selectedSubCategories.forEach((subCatId) => formData.append("subCategoryId", subCatId));
      selectedSubSubCategories.forEach((subSubCatId) => formData.append("subSubCategoryId", subSubCatId));

      // Metal types
      metalTypes.forEach((type) => formData.append("metal_type", type));

      // Shape
      selectedShapes.forEach((shape) => formData.append("shape", shape));

      // Karat
      selectedMetalKarats.forEach((karat) => formData.append("karat", karat));

      // Metal Images - send single file per view angle for each combination
      // Format: metal_images_${metalType}_${shape}_${viewAngle}
      metalTypes.forEach((metalType) => {
        const metalColor = ["Rose Gold", "Yellow Gold", "White Gold", "Platinum"].find(color => metalType.includes(color));
        if (metalColor) {
          selectedShapes.forEach(shape => {
            const key = `${metalColor}_${shape}`;
            const viewAngles = metalViewAngles[key] || [];
            viewAngles.forEach((viewAngle) => {
              const imageFile = metalImages[key]?.[viewAngle];
              if (imageFile) {
                const fieldName = `metal_images_${metalType.replace(/\s+/g, '_')}_${shape.replace(/\s+/g, '_')}_${viewAngle.replace(/\s+/g, '_')}`;
                formData.append(fieldName, imageFile);
              }
            });
          });
        }
      });

      // Diamond fields
      if (diamondOrigin) {
        formData.append("diamond_origin", diamondOrigin);
      }
      diamondQualities.forEach((quality) => formData.append("diamond_quality", quality));
      caratWeights.forEach((weight) => formData.append("carat_weight", weight));

      // Filter min weights to only include those in selected caratWeights
      const filteredMinWeights: Record<string, string> = {};
      caratWeights.forEach(weight => {
        if (caratMinWeights[weight]) {
          filteredMinWeights[weight] = caratMinWeights[weight];
        }
      });
      if (Object.keys(filteredMinWeights).length > 0) {
        formData.append("carat_min_weights", JSON.stringify(filteredMinWeights));
      }

      // Stone
      stones.forEach((stone) => formData.append("stone", stone));

      // Sizes
      ringSizes.forEach((size) => formData.append("ring_size", size));
      necklaceSizes.forEach((size) => formData.append("necklace_size", size));

      // Text areas
      formData.append("engraving_allowed", engraving.toString());
      formData.append("gift", gift.toString());

      // Product Details Configuration as an object
      const productDetailsConfiguration = {
        product_details: productDetails.trim() || '',
        average_width: averageWidth.trim() || '',
        rhodium_plate: rhodiumPlate || 'Yes'
      };
      formData.append("productDetailsConfiguration", JSON.stringify(productDetailsConfiguration));

      // Center Stone Details Configuration as an array
      if (hasCenterStone && stones.length > 0) {
        const centerStoneDetailsArray = stones.map((stone) => {
          const stoneData = sideStonesData[stone] || {};
          return {
            stone: stone,
            diamond_origin: stoneData.origins && stoneData.origins.length > 0 ? stoneData.origins[0] : '', // Single select - take first
            diamond_shapes: stoneData.shapes || [],
            min_diamond_weight: stoneData.minDiamondWeight || '',
            quantity: stoneData.quantity || '',
            average_color: stoneData.avgColor || '',
            average_clarity: stoneData.avgClarity || '',
            dimensions: stoneData.dimensions || '',
            gemstone_type: stoneData.gemstoneType || ''
          };
        });

        formData.append("centerStoneDetailsConfiguration", JSON.stringify(centerStoneDetailsArray));

        // Also send the global center stone fields
        formData.append("center_stone_certified", centerStoneCertified);
        if (centerStoneShape) formData.append("center_stone_shape", centerStoneShape);
        if (centerStoneMinWeight) formData.append("center_stone_min_weight", centerStoneMinWeight);
        if (centerStoneColor) formData.append("center_stone_color", centerStoneColor);
        if (centerStoneColorQuality) formData.append("center_stone_color_quality", centerStoneColorQuality);
        if (centerStoneClarity) formData.append("center_stone_clarity", centerStoneClarity);
        if (centerStoneDiamondQuality) formData.append("center_stone_diamond_quality", centerStoneDiamondQuality);
        if (centerStoneQualityType) formData.append("center_stone_quality_type", centerStoneQualityType);
        if (centerStoneDetails.trim()) formData.append("center_stone_details", centerStoneDetails.trim());
      }

      // Side Stone Details Configuration as an array
      if (hasSideStone && sideStones.length > 0) {
        const sideStoneDetailsArray = sideStones.map((stone) => {
          const stoneData = sideStonesData[stone] || {};
          return {
            stone: stone,
            diamond_origin: stoneData.origins && stoneData.origins.length > 0 ? stoneData.origins[0] : '', // Single select - take first
            diamond_shapes: stoneData.shapes || [],
            min_diamond_weight: stoneData.minDiamondWeight || '',
            quantity: stoneData.quantity || '',
            average_color: stoneData.avgColor || '',
            average_clarity: stoneData.avgClarity || '',
            dimensions: stoneData.dimensions || '',
            gemstone_type: stoneData.gemstoneType || ''
          };
        });

        formData.append("sideStoneDetailsConfiguration", JSON.stringify(sideStoneDetailsArray));
        if (sideStoneDetails.trim()) formData.append("side_stone_details", sideStoneDetails.trim());
      }

      // Stone Details Form Configuration as an array
      if (hasStoneDetailsForm && stones.length > 0) {
        const stoneDetailsFormArray = stones.map((stone) => {
          const stoneData = stoneDetailsData[stone] || {};
          return {
            stone: stone,
            certified: stoneDetailsCertified || 'No',
            color: stoneDetailsColor || '',
            diamond_origin: stoneData.origins && stoneData.origins.length > 0 ? stoneData.origins[0] : '', // Single select - take first
            diamond_shapes: stoneData.shapes || [],
            min_diamond_weight: stoneData.minDiamondWeight || '',
            quantity: stoneData.quantity || '',
            average_color: stoneData.avgColor || '',
            average_clarity: stoneData.avgClarity || '',
            dimensions: stoneData.dimensions || '',
            gemstone_type: stoneData.gemstoneType || ''
          };
        });

        formData.append("stoneDetailsFormConfiguration", JSON.stringify(stoneDetailsFormArray));
      }

      if (stoneDetails.trim()) formData.append("stone_details", stoneDetails.trim());

      // Gender
      formData.append("gender", gender);

      // Product Specials
      if (productSpecials) {
        formData.append("productSpecials", productSpecials);
      }

      // Status
      formData.append("status", status);

      // Collections
      if (collections) {
        formData.append("collections", collections);
      }

      if (variants.length > 0) {
        const cleaned = variants
          .filter(v => v.price && v.discounted_price)
          .map(v => ({
            diamond_type: v.stone_type,
            carat_weight: v.carat_weight,
            metal_type: v.gold_type,
            diamond_quality: v.diamond_quality,
            shape: v.shape || '',
            price: Number(v.price),
            discounted_price: Number(v.discounted_price),
          }));

        if (cleaned.length === 0) {
          toast.error("Please enter price and discounted price for at least one variant");
          return;
        }

        formData.append("variants", JSON.stringify(cleaned));
      }

      // Videos
      selectedVideoFiles.forEach((file) => {
        formData.append("videos", file);
      });

      // Radio button fields (single ObjectId)
      if (settingConfigurations) {
        formData.append("settingConfigurations", settingConfigurations);
      }
      if (shankConfigurations) {
        formData.append("shankConfigurations", shankConfigurations);
      }
      if (holdingMethods) {
        formData.append("holdingMethods", holdingMethods);
      }
      if (bandProfileShapes) {
        formData.append("bandProfileShapes", bandProfileShapes);
      }
      if (bandWidthCategories) {
        formData.append("bandWidthCategories", bandWidthCategories);
      }
      if (bandFits) {
        formData.append("bandFits", bandFits);
      }

      // Multi-select dropdown fields (array of ObjectIds)
      shankTreatments.forEach((id) => formData.append("shankTreatments", id));
      styles.forEach((id) => formData.append("styles", id));
      settingFeatures.forEach((id) => formData.append("settingFeatures", id));
      motifThemes.forEach((id) => formData.append("motifThemes", id));
      ornamentDetails.forEach((id) => formData.append("ornamentDetails", id));
      selectedDesignStyles.forEach((style) => formData.append("design_styles", style));

      await createProduct(formData).unwrap();
      toast.success("Product created successfully!");
      resetForm();
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create product");
      console.error("Error creating product:", error);
    }
  };

  // Generate all combinations of Stone (diamondOrigin) × Carat × Gold (metalTypes) × Diamond Quality
  const handleGenerateVariants = () => {
    if (!diamondOrigin) {
      toast.error("Please select a Stone Type (Diamond Origin)");
      return;
    }
    if (caratWeights.length === 0) {
      toast.error("Please select at least one Carat Weight");
      return;
    }
    if (selectedMetalColors.length === 0) {
      toast.error("Please select at least one Metal Color");
      return;
    }
    if (selectedMetalColors.some(c => c !== "Platinum") && selectedMetalKarats.length === 0) {
      toast.error("Please select at least one Karat");
      return;
    }
    if (diamondQualities.length === 0) {
      toast.error("Please select at least one Diamond Quality");
      return;
    }
    if (selectedShapes.length === 0) {
      toast.error("Please select at least one Shape");
      return;
    }

    const rows: VariantRow[] = [];

    caratWeights.forEach(carat => {
      metalTypes.forEach(gold => {
        diamondQualities.forEach(quality => {
          selectedShapes.forEach(shape => {
            rows.push({
              stone_type: diamondOrigin,
              carat_weight: `${carat}ct`,
              gold_type: gold,
              diamond_quality: quality,
              shape: shape,
              price: "",
              discounted_price: "",
            });
          });
        });
      });
    });

    setVariants(rows);
  };

  // price change
  const handleVariantPriceChange = (index: number, value: string) => {
    setVariants(prev =>
      prev.map((row, i) => (i === index ? { ...row, price: value } : row))
    );
  };
  const handleVariantChange = (
    index: number,
    field: "price" | "discounted_price",
    value: string
  ) => {
    setVariants(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  console.log("hasSideStone", hasSideStone);
  console.log("stones", stones);
  console.log("isSideStoneAccordionOpen", isSideStoneAccordionOpen);

  return (
    <Modal centered show={show} onHide={handleClose} size="lg" className="modal-parent">
      <Modal.Body className="modal-body-scrollable">
        <div className="custom-form-container">
          <h3 className="mb-4 fw-bold text-center text-black">Add Rings Product</h3>
          <p className="text-center text-black">Add a new jewelry item to your catalog.</p>
          <button type="button" className="close-modal-btn" onClick={handleClose}>X</button>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-3">
              <label className="form-label text-black">Product ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter product id (optional)"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Product Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-black">Description</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            {/* <div className="mb-3">
              <label className="form-label text-black">Original Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div> */}
            {/* <div className="mb-3">
              <label className="form-label text-black">Discounted Price *</label>
              <input
                type="number"
                className="form-control"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                required
              />
            </div> */}
            {/* <div className="mb-3">
              <label className="form-label text-black">Discount Label</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 20% off"
                value={discountLabel}
                onChange={(e) => setDiscountLabel(e.target.value)}
              />
            </div> */}
            {/* Single-Select Dropdown for Category */}
            <div className="dropdown-multi">
              <div className="mb-3 ddr-width" ref={categoryDropdownRef}>
                <label className="dropdown-label text-black">Category *</label>
                <div className={`dropdown ${categoryDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  >
                    <span>
                      {selectedCategory
                        ? (() => {
                          const selectedCat = filteredCategories.find((cat) => getCategoryId(cat) === selectedCategory);
                          return selectedCat ? getCategoryName(selectedCat) : "Select...";
                        })()
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {categoryDropdownOpen && (
                    <div className="dropdown-list">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => {
                          const categoryId = getCategoryId(category);
                          const categoryName = getCategoryName(category);
                          return (
                            <div
                              className={`dropdown-item ${selectedCategory === categoryId ? "selected" : ""}`}
                              key={categoryId}
                              onClick={() => handleCategorySelect(category)}
                              style={{ cursor: "pointer" }}
                            >
                              {categoryName}
                            </div>
                          );
                        })
                      ) : (
                        <div className="dropdown-item">No categories available</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3 ddr-width" ref={subCategoryDropdownRef}>
                <label className="dropdown-label text-black">Sub Category {!shouldDisableSubCategories ? '*' : ''}</label>
                <div className={`dropdown ${subCategoryDropdownOpen ? "active" : ""} ${shouldDisableSubCategories ? "disabled" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => {
                      if (shouldDisableSubCategories) {
                        return;
                      }
                      if (!selectedCategory) {
                        toast.error("Please select a category first");
                        return;
                      }
                      setSubCategoryDropdownOpen(!subCategoryDropdownOpen);
                    }}
                    style={{
                      cursor: shouldDisableSubCategories ? 'not-allowed' : 'pointer',
                      opacity: shouldDisableSubCategories ? 0.6 : 1,
                      pointerEvents: shouldDisableSubCategories ? 'none' : 'auto'
                    }}
                  >
                    <span>
                      {shouldDisableSubCategories
                        ? "Not required for this category"
                        : selectedSubCategories.length
                          ? `${selectedSubCategories.length} subcategor${selectedSubCategories.length > 1 ? 'ies' : ''} selected`
                          : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {subCategoryDropdownOpen && !shouldDisableSubCategories && (
                    <div className="dropdown-list">
                      {filteredSubCategories.length > 0 ? (
                        filteredSubCategories.map((subCategory) => {
                          const subCategoryId = getSubCategoryId(subCategory);
                          const subCategoryName = getSubCategoryName(subCategory);
                          return (
                            <label className="dropdown-item" key={subCategoryId}>
                              <input
                                type="checkbox"
                                value={subCategoryId}
                                checked={selectedSubCategories.includes(subCategoryId)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleSubCategory(subCategory);
                                }}
                              />
                              {subCategoryName}
                            </label>
                          );
                        })
                      ) : (
                        <div className="dropdown-item">
                          {!selectedCategory
                            ? "Please select a category first"
                            : "No subcategories available for selected category"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3 ddr-width" ref={subSubCategoryDropdownRef}>
                <label className="dropdown-label text-black">Sub SubCategory {!shouldDisableSubCategories ? '*' : ''}</label>
                <div className={`dropdown ${subSubCategoryDropdownOpen ? "active" : ""} ${shouldDisableSubCategories ? "disabled" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => {
                      if (shouldDisableSubCategories) {
                        return;
                      }
                      if (selectedSubCategories.length === 0) {
                        toast.error("Please select a sub category first");
                        return;
                      }
                      setSubSubCategoryDropdownOpen(!subSubCategoryDropdownOpen);
                    }}
                    style={{
                      cursor: shouldDisableSubCategories ? 'not-allowed' : 'pointer',
                      opacity: shouldDisableSubCategories ? 0.6 : 1,
                      pointerEvents: shouldDisableSubCategories ? 'none' : 'auto'
                    }}
                  >
                    <span>
                      {shouldDisableSubCategories
                        ? "Not required for this category"
                        : selectedSubSubCategories.length
                          ? `${selectedSubSubCategories.length} sub-subcategory${selectedSubSubCategories.length > 1 ? 'ies' : ''} selected`
                          : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {subSubCategoryDropdownOpen && !shouldDisableSubCategories && (
                    <div className="dropdown-list">
                      {filteredSubSubCategories.length > 0 ? (
                        filteredSubSubCategories.map((subSubCategory) => {
                          const subSubCategoryId = getSubSubCategoryId(subSubCategory);
                          const subSubCategoryName = getSubSubCategoryName(subSubCategory);
                          return (
                            <label className="dropdown-item" key={subSubCategoryId}>
                              <input
                                type="checkbox"
                                value={subSubCategoryId}
                                checked={selectedSubSubCategories.includes(subSubCategoryId)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleSubSubCategory(subSubCategory);
                                }}
                              />
                              {subSubCategoryName}
                            </label>
                          );
                        })
                      ) : (
                        <div className="dropdown-item">
                          {selectedSubCategories.length === 0
                            ? "Please select a sub category first"
                            : "No sub-subcategories available for selected subcategories"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Upload */}
            <div className="mb-3">
              <label className="form-label text-black">Upload Videos</label>
              <input
                type="file"
                className="form-control"
                multiple
                accept="video/*"
                onChange={handleVideoUpload}
              />
              <div id="video-preview" className="video-preview mt-2">
                {selectedVideoFiles.map((file, index) => (
                  <div className="video-box mb-2" key={index} style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      style={{ maxWidth: '200px', maxHeight: '150px' }}
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeVideo(index)}
                      style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>




            {/* Metal Selection */}
            <div className="mb-3">
              <label className="form-label text-black fw-bold">Metal Color</label>
              <div className="d-flex flex-wrap gap-3">
                {["Rose Gold", "Yellow Gold", "White Gold", "Platinum"].map((color) => (
                  <div className="form-check" key={color}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`color-${color.replace(/\s+/g, '')}`}
                      checked={selectedMetalColors.includes(color)}
                      onChange={() => toggleMetalColor(color)}
                    />
                    <label className="form-check-label text-black" htmlFor={`color-${color.replace(/\s+/g, '')}`}>
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Shape Selection */}
            <div className="mb-3">
              <label className="form-label text-black fw-bold">Shape</label>
              <div className="d-flex flex-wrap gap-3">
                {["Oval", "Circle", "Round", "Heart"].map((shape) => (
                  <div className="form-check" key={shape}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`shape-${shape.replace(/\s+/g, '')}`}
                      checked={selectedShapes.includes(shape)}
                      onChange={() => toggleShape(shape)}
                    />
                    <label className="form-check-label text-black" htmlFor={`shape-${shape.replace(/\s+/g, '')}`}>
                      {shape}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-black fw-bold">Karat (Except Platinum)</label>
              <div className="d-flex flex-wrap gap-3">
                {["14K", "18K"].map((karat) => (
                  <div className="form-check" key={karat}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`karat-${karat}`}
                      checked={selectedMetalKarats.includes(karat)}
                      onChange={() => toggleMetalKarat(karat)}
                    />
                    <label className="form-check-label text-black" htmlFor={`karat-${karat}`}>
                      {karat}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Styles Selection */}
            <div className="mb-3">
              <label className="form-label text-black fw-bold">Design Styles</label>
              <div className="d-flex flex-wrap gap-3">
                {["Halo", "Solitaire", "Vintage", "Modern", "Minimalist", "Bohemian", "Art Deco", "Classic", "Side-Stone", "Three-Stone"].map((style) => (
                  <div className="form-check" key={style}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`style-${style.replace(/\s+/g, '')}`}
                      checked={selectedDesignStyles.includes(style)}
                      onChange={() => toggleDesignStyle(style)}
                    />
                    <label className="form-check-label text-black" htmlFor={`style-${style.replace(/\s+/g, '')}`}>
                      {style}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* View Angle and Image Upload per Metal Color and Shape */}
            {selectedMetalColors.length > 0 && selectedShapes.length > 0 && (
              <div className="mb-3">
                <label className="form-label text-black fw-bold">View Angle & Image Upload (per Metal Color & Shape)</label>
                {selectedMetalColors.map((color) => (
                  selectedShapes.map((shape) => {
                    const key = `${color}_${shape}`;
                    return (
                      <div key={key} className="mb-4 p-3 border rounded">
                        <h6 className="text-black mb-3">{color} ({shape})</h6>

                        {/* View Angle Selection - Required and Optional */}
                        <div className="mb-3">
                          <label className="form-label text-black">View Angles</label>
                          <div className="w-100 mb-2">
                            <small className="text-muted d-block mb-2">Required <span className="text-danger">*</span></small>
                            {viewAngleOptions.filter(a => a.required).map((angle) => (
                              <div className="form-check form-check-inline" key={angle.id}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`${key}-${angle.value}`}
                                  checked={(metalViewAngles[key] || []).includes(angle.value)}
                                  disabled
                                  readOnly
                                />
                                <label className="form-check-label text-black" htmlFor={`${key}-${angle.value}`}>
                                  {angle.label} <span className="text-danger">*</span>
                                </label>
                              </div>
                            ))}
                          </div>
                          <div className="w-100">
                            <small className="text-muted d-block mb-2">Optional</small>
                            {viewAngleOptions.filter(a => !a.required).map((angle) => (
                              <div className="form-check form-check-inline" key={angle.id}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`${key}-${angle.value}`}
                                  checked={(metalViewAngles[key] || []).includes(angle.value)}
                                  onChange={() => toggleOptionalViewAngle(key, angle.value)}
                                />
                                <label className="form-check-label text-black" htmlFor={`${key}-${angle.value}`}>
                                  {angle.label}
                                </label>
                              </div>
                            ))}
                          </div>
                          <small className="text-muted d-block mt-2">Angled view, Top view, and Side view are required. Images 1, 2, 3 are optional.</small>
                        </div>

                        {/* Image Upload for each Selected View Angle */}
                        <div className="mb-3">
                          <label className="form-label text-black">Upload Images</label>
                          {(metalViewAngles[key] || []).map((viewAngle) => {
                            const angleOption = viewAngleOptions.find(a => a.value === viewAngle);
                            if (!angleOption) return null;
                            return (
                              <div key={viewAngle} className="mb-3 p-2 bg-light rounded">
                                <label className="form-label text-black fw-semibold text-capitalize">
                                  {angleOption.label}
                                  {angleOption.required && <span className="text-danger"> *</span>}
                                </label>
                                <input
                                  type="file"
                                  className="form-control mb-2"
                                  accept="image/*"
                                  data-metal={key}
                                  data-angle={viewAngle}
                                  onChange={(e) => handleMetalImageUpload(key, viewAngle, e)}
                                />
                                <div className="image-preview">
                                  {metalImages[key]?.[viewAngle] && (
                                    <div className="image-box">
                                      <img src={URL.createObjectURL(metalImages[key][viewAngle])} alt={`${color} ${shape} ${viewAngle}`} />
                                      <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeMetalImage(key, viewAngle)}
                                      >
                                        ✖
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ))}
              </div>
            )}
            <div className="dropdown-multi">
              <div className="mb-3 ddr-width" ref={diamondDropdownRef}>
                <label className="dropdown-label text-black">Diamond Origin</label>
                <div className={`dropdown ${diamondDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setDiamondDropdownOpen(!diamondDropdownOpen)}
                  >
                    <span>
                      {diamondOrigin
                        ? (() => {
                          const selected = diamondOriginStatic.find((o) => o.value === diamondOrigin);
                          return selected ? selected.label : "Select...";
                        })()
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {diamondDropdownOpen && (
                    <div className="dropdown-list">
                      {diamondOriginStatic.map((origin) => (
                        <label className="dropdown-item" key={origin.id}>
                          <input
                            type="radio"
                            name="diamondOrigin"
                            value={origin.value}
                            checked={diamondOrigin === origin.value}
                            onChange={(e) => {
                              e.stopPropagation();
                              selectDiamondOrigin(origin);
                            }}
                          />
                          {origin.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3 ddr-width">
                <label className="dropdown-label text-black">Diamond Grading</label>
                <div className="d-flex gap-3 mt-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="diamondGrading"
                      id="gradingSingle"
                      value="single"
                      checked={diamondGrading === "single"}
                      onChange={() => {
                        setDiamondGrading("single");
                        setDiamondQualities([]);
                      }}
                    />
                    <label className="form-check-label text-black" htmlFor="gradingSingle">
                      Single Letter
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="diamondGrading"
                      id="gradingDouble"
                      value="double"
                      checked={diamondGrading === "double"}
                      onChange={() => {
                        setDiamondGrading("double");
                        setDiamondQualities([]);
                      }}
                    />
                    <label className="form-check-label text-black" htmlFor="gradingDouble">
                      Double Letter
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-3 ddr-width" ref={diamondQualityDropdownRef}>
                <label className="dropdown-label text-black">Diamond Quality</label>
                <div className={`dropdown ${diamondQualityDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setDiamondQualityDropdownOpen(!diamondQualityDropdownOpen)}
                  >
                    <span>
                      {diamondQualities.length
                        ? `Selected: ${diamondQualities.join(", ")}`
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {diamondQualityDropdownOpen && (
                    <div className="dropdown-list">
                      {diamondQualityOptions
                        .filter((option) => option.type === diamondGrading)
                        .map((quality) => (
                          <label className="dropdown-item" key={quality.label}>
                            <input
                              type="checkbox"
                              value={quality.fullLabel}
                              checked={diamondQualities.includes(quality.fullLabel)}
                              onChange={(e) => {
                                e.stopPropagation();
                                const val = quality.fullLabel;
                                setDiamondQualities((prev) =>
                                  prev.includes(val)
                                    ? prev.filter((q) => q !== val)
                                    : [...prev, val]
                                );
                              }}
                            />
                            {quality.fullLabel}
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Radio Button Fields - Single Select */}
            <div className="mb-3">
              <label className="form-label text-black">Setting Configurations *</label>
              <div>
                {settingConfigurationsData?.data?.map((item) => (
                  <div className="form-check form-check-inline" key={item._id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="settingConfigurations"
                      id={`settingConfig-${item._id}`}
                      value={item._id}
                      checked={settingConfigurations === item._id}
                      onChange={(e) => setSettingConfigurations(e.target.value)}
                    />
                    <label className="form-check-label text-black" htmlFor={`settingConfig-${item._id}`}>
                      {item.displayName}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-black">Carat Weight</label>
              <div className="w-100" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {caratWeightOptions.map((weight, index) => {
                  const isSelected = caratWeights.includes(weight);
                  const selectedSetting = settingConfigurationsData?.data?.find(item => item._id === settingConfigurations);
                  const isTrilogyOrToiEtMoi = selectedSetting?.displayName === "Trilogy Setting" || selectedSetting?.displayName === "Toi Et Moi Setting";

                  return (
                    <div className="d-flex flex-column gap-1" key={index} style={{ width: 'calc(25% - 8px)', minWidth: '150px', marginBottom: '10px' }}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`carat-${weight}`}
                          checked={isSelected}
                          onChange={() => toggleCaratWeight(weight)}
                        />
                        <label className="form-check-label text-black" htmlFor={`carat-${weight}`}>
                          {weight} ct
                        </label>
                      </div>
                      {isTrilogyOrToiEtMoi && isSelected && (
                        <div className="ms-4">
                          <label className="form-label text-black small mb-0">Minimum Stone Weight</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Min Weight"
                            value={caratMinWeights[weight] || ""}
                            onChange={(e) => setCaratMinWeights(prev => ({ ...prev, [weight]: e.target.value }))}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-black">Stone</label>
              <div className="w-100 half-divide">
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="stone-diamond"
                    checked={stones.includes("Diamond")}
                    onChange={() => toggleStone("Diamond")}
                  />
                  <label className="form-check-label text-black" htmlFor="stone-diamond">
                    Diamond
                  </label>
                </div>
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="stone-color-diamond"
                    checked={stones.includes("Color Diamond")}
                    onChange={() => toggleStone("Color Diamond")}
                  />
                  <label className="form-check-label text-black" htmlFor="stone-color-diamond">
                    Color Diamond
                  </label>
                </div>
              </div>
              <div className="w-100 half-divide">
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="stone-gemstone"
                    checked={stones.includes("Gemstone")}
                    onChange={() => toggleStone("Gemstone")}
                  />
                  <label className="form-check-label text-black" htmlFor="stone-gemstone">
                    Gemstone
                  </label>
                </div>
              </div>
            </div>

            {/* <div className="dropdown-multi">
              <div className="mb-3 ddr-width" ref={ringSizeDropdownRef}>
                <label className="dropdown-label text-black">Ring Size</label>
                <div className={`dropdown ${ringSizeDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setRingSizeDropdownOpen(!ringSizeDropdownOpen)}
                  >
                    <span>
                      {ringSizes.length
                        ? `Selected: ${ringSizes.join(", ")}`
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {ringSizeDropdownOpen && (
                    <div className="dropdown-list">
                      {ringSizeStatic.map((size) => (
                        <label className="dropdown-item" key={size}>
                          <input
                            type="checkbox"
                            value={size}
                            checked={ringSizes.includes(size)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleRingSize(size);
                            }}
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3 ddr-width" ref={necklaceSizeDropdownRef}>
                <label className="dropdown-label text-black">Necklace Size</label>
                <div className={`dropdown ${necklaceSizeDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setNecklaceSizeDropdownOpen(!necklaceSizeDropdownOpen)}
                  >
                    <span>
                      {necklaceSizes.length
                        ? `Selected: ${necklaceSizes.join(", ")}`
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {necklaceSizeDropdownOpen && (
                    <div className="dropdown-list">
                      {necklaceSizeStatic.map((size) => (
                        <label className="dropdown-item" key={size}>
                          <input
                            type="checkbox"
                            value={size}
                            checked={necklaceSizes.includes(size)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleNecklaceSize(size);
                            }}
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div> */}

            <div className="mb-3">
              <label className="form-label text-black">Gender</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="genderMale"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="genderMale">
                    Male
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="genderFemale"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="genderFemale">
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-black">Product Specials</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="productSpecials"
                    id="productSpecialsNewIn"
                    value="New In"
                    checked={productSpecials === "New In"}
                    onChange={(e) => setProductSpecials(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="productSpecialsNewIn">
                    New In
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="productSpecials"
                    id="productSpecialsBestsellers"
                    value="Bestsellers"
                    checked={productSpecials === "Bestsellers"}
                    onChange={(e) => setProductSpecials(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="productSpecialsBestsellers">
                    Bestsellers
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="productSpecials"
                    id="productSpecialsFeatured"
                    value="Featured"
                    checked={productSpecials === "Featured"}
                    onChange={(e) => setProductSpecials(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="productSpecialsFeatured">
                    Featured
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="productSpecials"
                    id="productSpecialsTrending"
                    value="Trending"
                    checked={productSpecials === "Trending"}
                    onChange={(e) => setProductSpecials(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="productSpecialsTrending">
                    Trending
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-black">Collections</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="collections"
                    id="collectionsCartier"
                    value="Cartier"
                    checked={collections === "Cartier"}
                    onChange={(e) => setCollections(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="collectionsCartier">
                    Cartier
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="collections"
                    id="collectionsVersace"
                    value="Versace"
                    checked={collections === "Versace"}
                    onChange={(e) => setCollections(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="collectionsVersace">
                    Versace
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="collections"
                    id="collectionsCK"
                    value="CK"
                    checked={collections === "CK"}
                    onChange={(e) => setCollections(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="collectionsCK">
                    CK
                  </label>
                </div>
              </div>
            </div>

            {/* <div className="mb-3">
              <label className="form-label text-black">Size Type</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="sizeTypeRing"
                    value="ring"
                    checked={sizeType === "ring"}
                    onChange={() => setSizeType("ring")}
                  />
                  <label className="form-check-label text-black" htmlFor="sizeTypeRing">
                    Ring Size
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="sizeTypeNecklace"
                    value="necklace"
                    checked={sizeType === "necklace"}
                    onChange={() => setSizeType("necklace")}
                  />
                  <label className="form-check-label text-black" htmlFor="sizeTypeNecklace">
                    Necklace Size
                  </label>
                </div>
              </div>
            </div> */}

            {/* Size dropdowns */}
            <div className="dropdown-multi">
              {/* Ring Size dropdown - only when Ring is selected */}
              {sizeType === "ring" && (
                <div className="mb-3 ddr-width" ref={ringSizeDropdownRef}>
                  <label className="dropdown-label text-black">Ring Size</label>
                  <div className={`dropdown ${ringSizeDropdownOpen ? "active" : ""}`}>
                    <div
                      className="dropdown-select"
                      onClick={() => setRingSizeDropdownOpen(!ringSizeDropdownOpen)}
                    >
                      <span>
                        {ringSizes.length
                          ? `Selected: ${ringSizes.join(", ")}`
                          : "Select..."}
                      </span>
                      <i className="dropdown-arrow"></i>
                    </div>
                    {ringSizeDropdownOpen && (
                      <div className="dropdown-list">
                        {ringSizeStatic.map((size) => (
                          <label className="dropdown-item" key={size}>
                            <input
                              type="checkbox"
                              value={size}
                              checked={ringSizes.includes(size)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleRingSize(size);
                              }}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Necklace Size dropdown - only when Necklace is selected */}
              {sizeType === "necklace" && (
                <div className="mb-3 ddr-width" ref={necklaceSizeDropdownRef}>
                  <label className="dropdown-label text-black">Necklace Size</label>
                  <div className={`dropdown ${necklaceSizeDropdownOpen ? "active" : ""}`}>
                    <div
                      className="dropdown-select"
                      onClick={() =>
                        setNecklaceSizeDropdownOpen(!necklaceSizeDropdownOpen)
                      }
                    >
                      <span>
                        {necklaceSizes.length
                          ? `Selected: ${necklaceSizes.join(", ")}`
                          : "Select..."}
                      </span>
                      <i className="dropdown-arrow"></i>
                    </div>
                    {necklaceSizeDropdownOpen && (
                      <div className="dropdown-list">
                        {necklaceSizeStatic.map((size) => (
                          <label className="dropdown-item" key={size}>
                            <input
                              type="checkbox"
                              value={size}
                              checked={necklaceSizes.includes(size)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleNecklaceSize(size);
                              }}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>



            <div className="mb-3">
              <label className="form-label text-black">Shank Configurations *</label>
              <div>
                {shankConfigurationsData?.data?.map((item) => (
                  <div className="form-check form-check-inline" key={item._id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="shankConfigurations"
                      id={`shankConfig-${item._id}`}
                      value={item._id}
                      checked={shankConfigurations === item._id}
                      onChange={(e) => setShankConfigurations(e.target.value)}
                    />
                    <label className="form-check-label text-black" htmlFor={`shankConfig-${item._id}`}>
                      {item.displayName}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-black">Holding Methods *</label>
              <div>
                {holdingMethodsData?.data?.map((item) => (
                  <div className="form-check form-check-inline" key={item._id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="holdingMethods"
                      id={`holdingMethod-${item._id}`}
                      value={item._id}
                      checked={holdingMethods === item._id}
                      onChange={(e) => setHoldingMethods(e.target.value)}
                    />
                    <label className="form-check-label text-black" htmlFor={`holdingMethod-${item._id}`}>
                      {item.displayName}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-black">Band Profile Shapes *</label>
              <div>
                {bandProfileShapesData?.data?.map((item) => (
                  <div className="form-check form-check-inline" key={item._id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="bandProfileShapes"
                      id={`bandProfileShape-${item._id}`}
                      value={item._id}
                      checked={bandProfileShapes === item._id}
                      onChange={(e) => setBandProfileShapes(e.target.value)}
                    />
                    <label className="form-check-label text-black" htmlFor={`bandProfileShape-${item._id}`}>
                      {item.displayName}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-black">Band Width Categories *</label>
              <div>
                {bandWidthCategoriesData?.data?.map((item) => (
                  <div className="form-check form-check-inline" key={item._id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="bandWidthCategories"
                      id={`bandWidthCategory-${item._id}`}
                      value={item._id}
                      checked={bandWidthCategories === item._id}
                      onChange={(e) => setBandWidthCategories(e.target.value)}
                    />
                    <label className="form-check-label text-black" htmlFor={`bandWidthCategory-${item._id}`}>
                      {item.displayName}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-black">Band Fits *</label>
              <div>
                {bandFitsData?.data?.map((item) => (
                  <div className="form-check form-check-inline" key={item._id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="bandFits"
                      id={`bandFit-${item._id}`}
                      value={item._id}
                      checked={bandFits === item._id}
                      onChange={(e) => setBandFits(e.target.value)}
                    />
                    <label className="form-check-label text-black" htmlFor={`bandFit-${item._id}`}>
                      {item.displayName}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Select Dropdown Fields */}
            <div className="dropdown-multi">
              <div className="mb-3 ddr-width" ref={shankTreatmentsDropdownRef}>
                <label className="dropdown-label text-black">Shank Treatments *</label>
                <div className={`dropdown ${shankTreatmentsDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setShankTreatmentsDropdownOpen(!shankTreatmentsDropdownOpen)}
                  >
                    <span>
                      {shankTreatments.length
                        ? `${shankTreatments.length} item${shankTreatments.length > 1 ? 's' : ''} selected`
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {shankTreatmentsDropdownOpen && (
                    <div className="dropdown-list">
                      {shankTreatmentsData?.data?.map((item) => (
                        <label className="dropdown-item" key={item._id}>
                          <input
                            type="checkbox"
                            value={item._id}
                            checked={shankTreatments.includes(item._id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleShankTreatment(item._id);
                            }}
                          />
                          {item.displayName}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3 ddr-width" ref={stylesDropdownRef}>
                <label className="dropdown-label text-black">Styles *</label>
                <div className={`dropdown ${stylesDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setStylesDropdownOpen(!stylesDropdownOpen)}
                  >
                    <span>
                      {styles.length
                        ? `${styles.length} item${styles.length > 1 ? 's' : ''} selected`
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {stylesDropdownOpen && (
                    <div className="dropdown-list">
                      {stylesData?.data?.map((item) => (
                        <label className="dropdown-item" key={item._id}>
                          <input
                            type="checkbox"
                            value={item._id}
                            checked={styles.includes(item._id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleStyle(item._id);
                            }}
                          />
                          {item.displayName}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="dropdown-multi">
              <div className="mb-3 ddr-width" ref={settingFeaturesDropdownRef}>
                <label className="dropdown-label text-black">Setting Features *</label>
                <div className={`dropdown ${settingFeaturesDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setSettingFeaturesDropdownOpen(!settingFeaturesDropdownOpen)}
                  >
                    <span>
                      {settingFeatures.length
                        ? `${settingFeatures.length} item${settingFeatures.length > 1 ? 's' : ''} selected`
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {settingFeaturesDropdownOpen && (
                    <div className="dropdown-list">
                      {settingFeaturesData?.data?.map((item) => (
                        <label className="dropdown-item" key={item._id}>
                          <input
                            type="checkbox"
                            value={item._id}
                            checked={settingFeatures.includes(item._id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSettingFeature(item._id);
                            }}
                          />
                          {item.displayName}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3 ddr-width" ref={motifThemesDropdownRef}>
                <label className="dropdown-label text-black">Motif Themes *</label>
                <div className={`dropdown ${motifThemesDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setMotifThemesDropdownOpen(!motifThemesDropdownOpen)}
                  >
                    <span>
                      {motifThemes.length
                        ? `${motifThemes.length} item${motifThemes.length > 1 ? 's' : ''} selected`
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {motifThemesDropdownOpen && (
                    <div className="dropdown-list">
                      {motifThemesData?.data?.map((item) => (
                        <label className="dropdown-item" key={item._id}>
                          <input
                            type="checkbox"
                            value={item._id}
                            checked={motifThemes.includes(item._id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleMotifTheme(item._id);
                            }}
                          />
                          {item.displayName}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="dropdown-multi">
              <div className="mb-3 ddr-width" ref={ornamentDetailsDropdownRef}>
                <label className="dropdown-label text-black">Ornament Details *</label>
                <div className={`dropdown ${ornamentDetailsDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setOrnamentDetailsDropdownOpen(!ornamentDetailsDropdownOpen)}
                  >
                    <span>
                      {ornamentDetails.length
                        ? `${ornamentDetails.length} item${ornamentDetails.length > 1 ? 's' : ''} selected`
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {ornamentDetailsDropdownOpen && (
                    <div className="dropdown-list">
                      {ornamentDetailsData?.data?.map((item) => (
                        <label className="dropdown-item" key={item._id}>
                          <input
                            type="checkbox"
                            value={item._id}
                            checked={ornamentDetails.includes(item._id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleOrnamentDetail(item._id);
                            }}
                          />
                          {item.displayName}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Engraving Checkbox */}
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="engraving"
                  checked={engraving}
                  onChange={(e) => setEngraving(e.target.checked)}
                />
                <label className="form-check-label text-black" htmlFor="engraving">
                  Engraving
                </label>
              </div>
            </div>
            {/* Gift Checkbox */}
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gift"
                  checked={gift}
                  onChange={(e) => setGift(e.target.checked)}
                />
                <label className="form-check-label text-black" htmlFor="gift">
                  Gift
                </label>
              </div>
            </div>
            <div className="mb-3 border rounded p-3">
              <div
                className="d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => setIsProductDetailsAccordionOpen(!isProductDetailsAccordionOpen)}
                style={{ cursor: 'pointer' }}
              >
                <h5 className="text-black mb-0">Product Details Configuration</h5>
                <i className={`fas fa-chevron-${isProductDetailsAccordionOpen ? 'up' : 'down'}`}></i>
              </div>

              {isProductDetailsAccordionOpen && (
                <div className="mt-3">
                  {/* 1. Product Details - Text input field */}
                  <div className="mb-3">
                    <label className="form-label text-black">Product Details</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Product Details..."
                      value={productDetails}
                      onChange={(e) => setProductDetails(e.target.value)}
                    />
                  </div>

                  {/* 2. Average Width - Integer input with 'mm' as default text */}
                  <div className="mb-3">
                    <label className="form-label text-black">Average Width (mm)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="mm"
                      value={averageWidth}
                      onChange={(e) => setAverageWidth(e.target.value)}
                    />
                  </div>

                  {/* 3. Rhodium Plate: Yes / No Radio button with yes defaulted */}
                  <div className="mb-3">
                    <label className="form-label text-black">Rhodium Plate</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rhodiumPlate"
                          id="rhodiumPlateYes"
                          value="Yes"
                          checked={rhodiumPlate === "Yes"}
                          onChange={(e) => setRhodiumPlate(e.target.value)}
                        />
                        <label className="form-check-label text-black" htmlFor="rhodiumPlateYes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rhodiumPlate"
                          id="rhodiumPlateNo"
                          value="No"
                          checked={rhodiumPlate === "No"}
                          onChange={(e) => setRhodiumPlate(e.target.value)}
                        />
                        <label className="form-check-label text-black" htmlFor="rhodiumPlateNo">
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 4. Setting Configurations: Copy from above */}
                  {/* <div className="mb-3">
                    <label className="form-label text-black">Setting Configurations *</label>
                    <div>
                      {settingConfigurationsData?.data?.map((item) => (
                        <div className="form-check form-check-inline" key={`pd-config-${item._id}`}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="productDetailsSettingConfigurations"
                            id={`pd-settingConfig-${item._id}`}
                            value={item._id}
                            checked={settingConfigurations === item._id}
                            onChange={(e) => setSettingConfigurations(e.target.value)}
                          />
                          <label className="form-check-label text-black" htmlFor={`pd-settingConfig-${item._id}`}>
                            {item.displayName}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </div>
              )}
            </div>
            <div className="mb-3 border rounded p-3">
              <div className="d-flex justify-content-between align-items-center">
                {/* Left side: Title + Accordion Toggle */}
                <div
                  className="d-flex justify-content-between align-items-center w-100 me-3"
                  onClick={() => {
                    if (!hasCenterStone) return; // ✅ prevent open/close when toggle is OFF
                    setIsCenterStoneAccordionOpen(!isCenterStoneAccordionOpen);
                  }}
                  style={{ cursor: hasCenterStone ? "pointer" : "not-allowed" }}
                >
                  <h5 className="text-black mb-0">Center Stone Details Configuration</h5>

                  {/* Chevron only visible when toggle is ON */}
                  {hasCenterStone && (
                    <i className={`fas fa-chevron-${isCenterStoneAccordionOpen ? "up" : "down"}`}></i>
                  )}
                </div>

                {/* Right side: Switch Toggle */}
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="centerStoneToggle"
                    checked={hasCenterStone}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setHasCenterStone(checked);

                      if (!checked) {
                        setIsCenterStoneAccordionOpen(false);
                      } else {
                        setIsCenterStoneAccordionOpen(true);
                      }
                    }}
                  />
                </div>
              </div>

              {/* ✅ Show section only if toggle ON AND accordion open */}
              {hasCenterStone && isCenterStoneAccordionOpen && (
                <div className="mt-3">
                  {/* 1. Add Stone - Synced with main Stone section (read-only) */}
                  <div className="mb-3">
                    <label className="form-label text-black">Stone</label>
                    <small className="text-muted d-block mb-2">(Select stones from the main Stone section above)</small>
                    <div className="w-100 half-divide">
                      <div className="form-check w-50">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="cs-stone-diamond"
                          checked={stones.includes("Diamond")}
                          disabled
                          readOnly
                        />
                        <label className="form-check-label text-black" htmlFor="cs-stone-diamond">
                          Diamond
                        </label>
                      </div>
                      <div className="form-check w-50">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="cs-stone-color-diamond"
                          checked={stones.includes("Color Diamond")}
                          disabled
                          readOnly
                        />
                        <label className="form-check-label text-black" htmlFor="cs-stone-color-diamond">
                          Color Diamond
                        </label>
                      </div>
                    </div>
                    <div className="w-100 half-divide">
                      <div className="form-check w-50">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="cs-stone-gemstone"
                          checked={stones.includes("Gemstone")}
                          disabled
                          readOnly
                        />
                        <label className="form-check-label text-black" htmlFor="cs-stone-gemstone">
                          Gemstone
                        </label>
                      </div>
                    </div>

                    {stones.map((stone) => (
                      <div key={stone} className="mb-4 p-3 border rounded bg-white shadow-sm">
                        <h6 className="text-black fw-bold mb-3 d-flex align-items-center">
                          <span className="badge bg-primary me-2">{stone}</span> Details
                        </h6>

                        {/* Diamond Origin - Hidden if stone is Gemstone */}
                        <div className="mb-3">
                          <label className="form-label text-black">Diamond Origin</label>
                          <div className="w-100">
                            {diamondOriginStatic.map((origin) => (
                              <div className="form-check form-check-inline" key={`ss-${stone}-origin-${origin.id}`}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`ss-${stone.replace(/\s+/g, "_")}-origin-${origin.value}`}
                                  value={origin.value}
                                  checked={(sideStonesData[stone]?.origins || []).includes(origin.value)}
                                  onChange={() => toggleSideStoneOrigin(stone, origin.value)}
                                />
                                <label
                                  className="form-check-label text-black"
                                  htmlFor={`ss-${stone.replace(/\s+/g, "_")}-origin-${origin.value}`}
                                >
                                  {origin.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label text-black">
                            {stone === "Gemstone" ? "Shape" : "Diamond Shape"}
                          </label>

                          <div className="d-flex flex-wrap gap-2">
                            {diamondShapeStatic.map((shape) => {
                              const selectedShapes = sideStonesData[stone]?.shapes || [];

                              return (
                                <div className="form-check form-check-inline" key={shape}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={`ss-${stone.replace(/\s+/g, "_")}-shapes`}
                                    id={`ss-${stone.replace(/\s+/g, "_")}-shape-${shape}`}
                                    value={shape}
                                    checked={selectedShapes.includes(shape)}
                                    onChange={(e) => {
                                      const value = e.target.value;

                                      const updatedShapes = selectedShapes.includes(value)
                                        ? selectedShapes.filter((s) => s !== value)
                                        : [...selectedShapes, value];

                                      updateSideStoneData(stone, "shapes", updatedShapes);
                                    }}
                                  />
                                  <label
                                    className="form-check-label text-black"
                                    htmlFor={`ss-${stone.replace(/\s+/g, "_")}-shape-${shape}`}
                                  >
                                    {shape}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {stone === "Gemstone" ? (
                          <>
                            <div className="mb-3">
                              <label className="form-label text-black">Dimensions</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Dimensions"
                                value={sideStonesData[stone]?.dimensions || ""}
                                onChange={(e) => updateSideStoneData(stone, "dimensions", e.target.value)}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label text-black">Gemstone Type</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Gemstone Type"
                                value={sideStonesData[stone]?.gemstoneType || ""}
                                onChange={(e) => updateSideStoneData(stone, "gemstoneType", e.target.value)}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="mb-3">
                            <label className="form-label text-black">Min Diamond Weight</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Min Diamond Weight"
                              value={sideStonesData[stone]?.minDiamondWeight || ""}
                              onChange={(e) => updateSideStoneData(stone, "minDiamondWeight", e.target.value)}
                            />
                          </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-3">
                          <label className="form-label text-black">Quantity</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder={`Enter Quantity for ${stone}`}
                            value={sideStonesData[stone]?.quantity || ""}
                            onChange={(e) => updateSideStoneData(stone, "quantity", e.target.value)}
                          />
                        </div>

                        {/* Average Color */}
                        <div className="mb-3">
                          <label className="form-label text-black">Average Color</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`Enter Average Color for ${stone}`}
                            value={sideStonesData[stone]?.avgColor || ""}
                            onChange={(e) => updateSideStoneData(stone, "avgColor", e.target.value)}
                          />
                        </div>

                        {/* Average Clarity */}
                        <div className="mb-3">
                          <label className="form-label text-black">Average Clarity</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`Enter Average Clarity for ${stone}`}
                            value={sideStonesData[stone]?.avgClarity || ""}
                            onChange={(e) => updateSideStoneData(stone, "avgClarity", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 3. IGI / GIA Certified: Yes / No Radio button */}
                  <div className="mb-3">
                    <label className="form-label text-black">IGI / GIA Certified</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="centerStoneCertified"
                          id="centerStoneCertifiedYes"
                          value="Yes"
                          checked={centerStoneCertified === "Yes"}
                          onChange={(e) => setCenterStoneCertified(e.target.value)}
                        />
                        <label className="form-check-label text-black" htmlFor="centerStoneCertifiedYes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="centerStoneCertified"
                          id="centerStoneCertifiedNo"
                          value="No"
                          checked={centerStoneCertified === "No"}
                          onChange={(e) => setCenterStoneCertified(e.target.value)}
                        />
                        <label className="form-check-label text-black" htmlFor="centerStoneCertifiedNo">
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 4. Diamond Shape */}
                  <div className="mb-3">
                    <label className="form-label text-black">Diamond Shape</label>
                    <div className="d-flex flex-wrap gap-2">
                      {diamondShapeStatic.map((shape) => (
                        <div className="form-check form-check-inline" key={shape}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="centerStoneShape"
                            id={`cs-shape-${shape}`}
                            value={shape}
                            checked={centerStoneShape === shape}
                            onChange={(e) => setCenterStoneShape(e.target.value)}
                          />
                          <label className="form-check-label text-black" htmlFor={`cs-shape-${shape}`}>
                            {shape}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 6. Color */}
                  <div className="mb-3">
                    <label className="form-label text-black">Color</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Color"
                      value={centerStoneColor}
                      onChange={(e) => setCenterStoneColor(e.target.value)}
                    />
                  </div>

                  {/* 7. Color Quality - Read Only */}
                  <div className="mb-3">
                    <label className="form-label text-black">Color Quality (Derived)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Select Diamond Quality"
                      value={centerStoneColorQuality}
                      readOnly
                    />
                  </div>

                  {/* 8. Clarity - Read Only */}
                  <div className="mb-3">
                    <label className="form-label text-black">Clarity (Derived)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Select Diamond Quality"
                      value={centerStoneClarity}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>



            <div className={`mb-3 border rounded p-3 ${!hasSideStone ? 'bg-light' : ''}`}>
              <div
                className="d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-3">
                  <h5 className="text-black mb-0">Side Stone Details Configuration</h5>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="sideStoneToggle"
                      checked={hasSideStone}
                      onChange={(e) => {
                        setHasSideStone(e.target.checked);
                        if (!e.target.checked) setIsSideStoneAccordionOpen(false);
                        else setIsSideStoneAccordionOpen(true);
                      }}
                    />
                  </div>
                </div>
                {hasSideStone && (
                  <div
                    onClick={() => setIsSideStoneAccordionOpen(!isSideStoneAccordionOpen)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`fas fa-chevron-${isSideStoneAccordionOpen ? 'up' : 'down'}`}></i>
                  </div>
                )}
              </div>

              {hasSideStone && (
                <div className="mt-3">
                  {/* 1. Stone - Independent selection for side stones */}
                  <div className="mb-3">
                    <label className="form-label text-black">Stone</label>
                    <div className="w-100 half-divide">
                      <div className="form-check w-50">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="ss-stone-diamond"
                          checked={sideStones.includes("Diamond")}
                          onChange={() => toggleSideStone("Diamond")}
                        />
                        <label className="form-check-label text-black" htmlFor="ss-stone-diamond">
                          Diamond
                        </label>
                      </div>
                      <div className="form-check w-50">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="ss-stone-color-diamond"
                          checked={sideStones.includes("Color Diamond")}
                          onChange={() => toggleSideStone("Color Diamond")}
                        />
                        <label className="form-check-label text-black" htmlFor="ss-stone-color-diamond">
                          Color Diamond
                        </label>
                      </div>
                    </div>
                    <div className="w-100 half-divide">
                      <div className="form-check w-50">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="ss-stone-gemstone"
                          checked={sideStones.includes("Gemstone")}
                          onChange={() => toggleSideStone("Gemstone")}
                        />
                        <label className="form-check-label text-black" htmlFor="ss-stone-gemstone">
                          Gemstone
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Sub-form for each selected side stone */}
                  {sideStones.map((stone) => (
                    <div key={stone} className="mb-4 p-3 border rounded bg-white shadow-sm">
                      <h6 className="text-black fw-bold mb-3 d-flex align-items-center">
                        <span className="badge bg-primary me-2">{stone}</span> Details
                      </h6>

                      {/* Diamond Origin - Hidden if stone is Gemstone */}
                      {(
                        <div className="mb-3">
                          <label className="form-label text-black">Diamond Origin</label>
                          <div className="w-100">
                            {diamondOriginStatic.map((origin) => (
                              <div className="form-check form-check-inline" key={`ss-${stone}-origin-${origin.id}`}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`ss-${stone.replace(/\s+/g, '_')}-origin-${origin.value}`}
                                  value={origin.value}
                                  checked={(sideStonesData[stone]?.origins || []).includes(origin.value)}
                                  onChange={() => toggleSideStoneOrigin(stone, origin.value)}
                                />
                                <label className="form-check-label text-black" htmlFor={`ss-${stone.replace(/\s+/g, '_')}-origin-${origin.value}`}>
                                  {origin.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label text-black">
                          {stone === "Gemstone" ? "Shape" : "Diamond Shape"}
                        </label>

                        <div className="d-flex flex-wrap gap-2">
                          {diamondShapeStatic.map((shape) => {
                            const selectedShapes = sideStonesData[stone]?.shapes || [];

                            return (
                              <div className="form-check form-check-inline" key={shape}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name={`ss-${stone.replace(/\s+/g, "_")}-shapes`}
                                  id={`ss-${stone.replace(/\s+/g, "_")}-shape-${shape}`}
                                  value={shape}
                                  checked={selectedShapes.includes(shape)}
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    const updatedShapes = selectedShapes.includes(value)
                                      ? selectedShapes.filter((s) => s !== value)
                                      : [...selectedShapes, value];

                                    updateSideStoneData(stone, "shapes", updatedShapes);
                                  }}
                                />
                                <label
                                  className="form-check-label text-black"
                                  htmlFor={`ss-${stone.replace(/\s+/g, "_")}-shape-${shape}`}
                                >
                                  {shape}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {stone === "Gemstone" ? (
                        <>
                          <div className="mb-3">
                            <label className="form-label text-black">Dimensions</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Dimensions"
                              value={sideStonesData[stone]?.dimensions || ""}
                              onChange={(e) => updateSideStoneData(stone, "dimensions", e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label text-black">Gemstone Type</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Gemstone Type"
                              value={sideStonesData[stone]?.gemstoneType || ""}
                              onChange={(e) => updateSideStoneData(stone, "gemstoneType", e.target.value)}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="mb-3">
                          <label className="form-label text-black">Min Diamond Weight</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Min Diamond Weight"
                            value={sideStonesData[stone]?.minDiamondWeight || ""}
                            onChange={(e) => updateSideStoneData(stone, "minDiamondWeight", e.target.value)}
                          />
                        </div>
                      )}

                      {/* Quantity */}
                      <div className="mb-3">
                        <label className="form-label text-black">Quantity</label>
                        <input
                          type="number"
                          className="form-control"


                          placeholder={`Enter Quantity for ${stone}`}
                          value={sideStonesData[stone]?.quantity || ""}
                          onChange={(e) => updateSideStoneData(stone, "quantity", e.target.value)}
                        />
                      </div>

                      {/* Average Color */}
                      <div className="mb-3">
                        <label className="form-label text-black">Average Color</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Enter Average Color for ${stone}`}
                          value={sideStonesData[stone]?.avgColor || ""}
                          onChange={(e) => updateSideStoneData(stone, "avgColor", e.target.value)}
                        />
                      </div>

                      {/* Average Clarity */}
                      <div className="mb-3">
                        <label className="form-label text-black">Average Clarity</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Enter Average Clarity for ${stone}`}
                          value={sideStonesData[stone]?.avgClarity || ""}
                          onChange={(e) => updateSideStoneData(stone, "avgClarity", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>



            <div className={`mb-3 border rounded p-3 ${!hasStoneDetailsForm ? 'bg-light' : ''}`}>
              <div
                className="d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-3">
                  <h5 className="text-black mb-0">Stone Details form</h5>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="stoneDetailsFormToggle"
                      checked={hasStoneDetailsForm}
                      onChange={(e) => {
                        setHasStoneDetailsForm(e.target.checked);
                        if (!e.target.checked) setIsStoneDetailsFormAccordionOpen(false);
                        else setIsStoneDetailsFormAccordionOpen(true);
                      }}
                    />
                  </div>
                </div>
                {hasStoneDetailsForm && (
                  <div
                    onClick={() => setIsStoneDetailsFormAccordionOpen(!isStoneDetailsFormAccordionOpen)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`fas fa-chevron-${isStoneDetailsFormAccordionOpen ? 'up' : 'down'}`}></i>
                  </div>
                )}
              </div>

              {hasStoneDetailsForm && (
                <div className="mt-3">
                  {/* IGI / GIA Certified Field */}
                  <div className="mb-3">
                    <label className="form-label text-black">IGI / GIA Certified</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="stoneDetailsCertified"
                          id="sd-certified-yes"
                          value="Yes"
                          checked={stoneDetailsCertified === "Yes"}
                          onChange={(e) => setStoneDetailsCertified(e.target.value)}
                        />
                        <label className="form-check-label text-black" htmlFor="sd-certified-yes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="stoneDetailsCertified"
                          id="sd-certified-no"
                          value="No"
                          checked={stoneDetailsCertified === "No"}
                          onChange={(e) => setStoneDetailsCertified(e.target.value)}
                        />
                        <label className="form-check-label text-black" htmlFor="sd-certified-no">
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Color Field */}
                  <div className="mb-3">
                    <label className="form-label text-black">Color</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Color"
                      value={stoneDetailsColor}
                      onChange={(e) => setStoneDetailsColor(e.target.value)}
                    />
                  </div>

                  {/* 1. Stone selection - Synced with main Stone section (read-only) */}
                  <div className="mb-3">
                    <label className="form-label text-black">Stone</label>
                    <small className="text-muted d-block mb-2">(Select stones from the main Stone section above)</small>
                    <div className="w-100 half-divide">
                      <div className="form-check w-50">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="sd-stone-diamond"
                          checked={stones.includes("Diamond")}
                          disabled
                          readOnly
                        />
                        <label className="form-check-label text-black" htmlFor="sd-stone-diamond">
                          Diamond
                        </label>
                      </div>
                      <div className="form-check w-50">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="sd-stone-color-diamond"
                          checked={stones.includes("Color Diamond")}
                          disabled
                          readOnly
                        />
                        <label className="form-check-label text-black" htmlFor="sd-stone-color-diamond">
                          Color Diamond
                        </label>
                      </div>
                    </div>
                    <div className="w-100 half-divide">
                      <div className="form-check w-50">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="sd-stone-gemstone"
                          checked={stones.includes("Gemstone")}
                          disabled
                          readOnly
                        />
                        <label className="form-check-label text-black" htmlFor="sd-stone-gemstone">
                          Gemstone
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Sub-form for each selected stone */}
                  {stones.map((stone) => (
                    <div key={stone} className="mb-4 p-3 border rounded bg-white shadow-sm">
                      <h6 className="text-black fw-bold mb-3 d-flex align-items-center">
                        <span className="badge bg-primary me-2">{stone}</span> Details
                      </h6>

                      {/* Diamond Origin - Hidden if stone is Gemstone */}
                      {(
                        <div className="mb-3">
                          <label className="form-label text-black">Diamond Origin</label>
                          <div className="w-100">
                            {diamondOriginStatic.map((origin) => (
                              <div className="form-check form-check-inline" key={`sd-${stone}-origin-${origin.id}`}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`sd-${stone.replace(/\s+/g, '_')}-origin-${origin.value}`}
                                  value={origin.value}
                                  checked={(stoneDetailsData[stone]?.origins || []).includes(origin.value)}
                                  onChange={() => toggleStoneDetailOrigin(stone, origin.value)}
                                />
                                <label className="form-check-label text-black" htmlFor={`sd-${stone.replace(/\s+/g, '_')}-origin-${origin.value}`}>
                                  {origin.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label text-black">
                          {stone === "Gemstone" ? "Shape" : "Diamond Shape"}
                        </label>

                        <div className="d-flex flex-wrap gap-2">
                          {diamondShapeStatic.map((shape) => {
                            const selectedShapes = stoneDetailsData[stone]?.shapes || [];

                            return (
                              <div className="form-check form-check-inline" key={shape}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name={`sd-${stone.replace(/\s+/g, "_")}-shapes`}
                                  id={`sd-${stone.replace(/\s+/g, "_")}-shape-${shape}`}
                                  value={shape}
                                  checked={selectedShapes.includes(shape)}
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    const updatedShapes = selectedShapes.includes(value)
                                      ? selectedShapes.filter((s) => s !== value)
                                      : [...selectedShapes, value];

                                    updateStoneDetailData(stone, "shapes", updatedShapes);
                                  }}
                                />
                                <label
                                  className="form-check-label text-black"
                                  htmlFor={`sd-${stone.replace(/\s+/g, "_")}-shape-${shape}`}
                                >
                                  {shape}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {stone === "Gemstone" ? (
                        <>
                          <div className="mb-3">
                            <label className="form-label text-black">Dimensions</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Dimensions"
                              value={stoneDetailsData[stone]?.dimensions || ""}
                              onChange={(e) => updateStoneDetailData(stone, "dimensions", e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label text-black">Gemstone Type</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Gemstone Type"
                              value={stoneDetailsData[stone]?.gemstoneType || ""}
                              onChange={(e) => updateStoneDetailData(stone, "gemstoneType", e.target.value)}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="mb-3">
                          <label className="form-label text-black">Min Diamond Weight</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Min Diamond Weight"
                            value={stoneDetailsData[stone]?.minDiamondWeight || ""}
                            onChange={(e) => updateStoneDetailData(stone, "minDiamondWeight", e.target.value)}
                          />
                        </div>
                      )}

                      {/* Quantity */}
                      <div className="mb-3">
                        <label className="form-label text-black">Quantity</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Quantity for ${stone}`}
                          value={stoneDetailsData[stone]?.quantity || ""}
                          onChange={(e) => updateStoneDetailData(stone, "quantity", e.target.value)}
                        />
                      </div>

                      {/* Average Color */}
                      <div className="mb-3">
                        <label className="form-label text-black">Average Color</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Enter Average Color for ${stone}`}
                          value={stoneDetailsData[stone]?.avgColor || ""}
                          onChange={(e) => updateStoneDetailData(stone, "avgColor", e.target.value)}
                        />
                      </div>

                      {/* Average Clarity */}
                      <div className="mb-3">
                        <label className="form-label text-black">Average Clarity</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Enter Average Clarity for ${stone}`}
                          value={stoneDetailsData[stone]?.avgClarity || ""}
                          onChange={(e) => updateStoneDetailData(stone, "avgClarity", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* <div className="mb-3">
              <label className="form-label text-black">Stone Details</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Enter Stone Details..."
                value={stoneDetails}
                onChange={(e) => setStoneDetails(e.target.value)}
              ></textarea>
            </div> */}
            <div className="mb-3">
              <label className="form-label text-black">Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="mb-3">
              <h5 className="text-black mt-4">Product Variant Configuration</h5>
              <p className="text-muted">
                Variants are generated from Stone Type (Diamond Origin), Carat Weight, Gold Type (Metal Type) and Diamond Quality.
              </p>

              <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={handleGenerateVariants}
              >
                Generate Variants
              </button>

              {variants.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Stone</th>
                        <th>Carat</th>
                        <th>Gold</th>
                        <th>Diamond Quality</th>
                        <th>Shape</th>
                        <th>Price (₹)</th>
                        <th>Discounted Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v, index) => (
                        <tr key={index}>
                          <td>{v.stone_type}</td>
                          <td>{v.carat_weight}</td>
                          <td>{v.gold_type}</td>
                          <td>{v.diamond_quality}</td>
                          <td>{v.shape}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter price"
                              min="0"
                              value={v.price}
                              onChange={(e) =>
                                handleVariantChange(index, "price", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter discounted price"
                              min="0"
                              value={v.discounted_price}
                              onChange={(e) =>
                                handleVariantChange(index, "discounted_price", e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>



            <button
              className="btn w-100 mt-3 submit-background"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}


export default AddProduct
