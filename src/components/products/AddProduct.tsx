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
  const [metalTypes, setMetalTypes] = useState<string[]>([]);
  
  // Metal Images: { [metalType]: { [viewAngle]: File } } - single image per view angle
  const [metalImages, setMetalImages] = useState<Record<string, Record<string, File>>>({});
  
  // Metal View Angles: { [metalType]: string[] } - all 3 view angles are required
  const [metalViewAngles, setMetalViewAngles] = useState<Record<string, string[]>>({});

  // Diamond fields
  const [diamondOrigins, setDiamondOrigins] = useState<string[]>([]);
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

  // Dropdown open states for multi-select
  const [shankTreatmentsDropdownOpen, setShankTreatmentsDropdownOpen] = useState(false);
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

  // Check if selected category is one that doesn't need subcategory/sub-subcategory
  const shouldDisableSubCategories = useMemo(() => {
    if (!selectedCategory) return false;
    const selectedCat = categories.find((cat) => getCategoryId(cat) === selectedCategory);
    if (!selectedCat) return false;
    const categoryName = getCategoryName(selectedCat);
    return categoryName === "Engagement Rings" || categoryName === "Wedding Bands & Anniversary Bands";
  }, [selectedCategory, categories]);

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
    "0.25","0.5","0.75","1","1.25","1.5","1.75","2","2.25","2.5","2.75","3","3.25","3.5","3.75","4","4.25","4.5","4.75","5",
    "5.5","6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","11.5","12","12.5","13","13.5","14","14.5","15",
    "16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"
  ];

  const viewAngleOptions = [
    { id: 1, label: "Angled view", value: "Angled view" },
    { id: 2, label: "Top view", value: "Top view" },
    { id: 3, label: "Side view", value: "Side view" },
  ];

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

  // Toggle diamond origin
  const toggleDiamondOrigin = (origin: { value: string }) => {
    setDiamondOrigins((prev) =>
      prev.includes(origin.value)
        ? prev.filter((o) => o !== origin.value)
        : [...prev, origin.value]
    );
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

  // Toggle metal type
  const toggleMetalType = (type: string) => {
    setMetalTypes((prev) => {
      const isRemoving = prev.includes(type);
      if (isRemoving) {
        // Remove metal type and its associated data
        setMetalImages((imgPrev) => {
          const newImages = { ...imgPrev };
          delete newImages[type];
          return newImages;
        });
        setMetalViewAngles((anglePrev) => {
          const newAngles = { ...anglePrev };
          delete newAngles[type];
          return newAngles;
        });
        return prev.filter((t) => t !== type);
      } else {
        // Add metal type with all 3 view angles required
        const allViewAngles = viewAngleOptions.map(a => a.value);
        setMetalImages((imgPrev) => ({
          ...imgPrev,
          [type]: {}
        }));
        setMetalViewAngles((anglePrev) => ({
          ...anglePrev,
          [type]: allViewAngles
        }));
        return [...prev, type];
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
    setMetalTypes([]);
    setMetalImages({});
    setMetalViewAngles({});
    setDiamondOrigins([]);
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
    
    // Validate metal images - all 3 view angles must have images for each metal type
    if (metalTypes.length > 0) {
      const allViewAngles = viewAngleOptions.map(a => a.value);
      for (const metalType of metalTypes) {
        const selectedAngles = metalViewAngles[metalType] || [];
        if (selectedAngles.length !== allViewAngles.length) {
          toast.error(`Please ensure all 3 view angles are selected for ${metalType}`);
          return;
        }
        for (const viewAngle of allViewAngles) {
          if (!metalImages[metalType]?.[viewAngle]) {
            toast.error(`Please upload an image for ${viewAngle} of ${metalType}`);
            return;
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
      
      // Metal Images - send single file per view angle
      // Format: metal_images_${metalType}_${viewAngle}
      metalTypes.forEach((metalType) => {
        const viewAngles = metalViewAngles[metalType] || [];
        viewAngles.forEach((viewAngle) => {
          const imageFile = metalImages[metalType]?.[viewAngle];
          if (imageFile) {
            const fieldName = `metal_images_${metalType.replace(/\s+/g, '_')}_${viewAngle.replace(/\s+/g, '_')}`;
            formData.append(fieldName, imageFile);
          }
        });
      });

      // Diamond fields
      diamondOrigins.forEach((origin) => formData.append("diamond_origin", origin));
      diamondQualities.forEach((quality) => formData.append("diamond_quality", quality));
      caratWeights.forEach((weight) => formData.append("carat_weight", weight));

      // Stone
      stones.forEach((stone) => formData.append("stone", stone));

      // Sizes
      ringSizes.forEach((size) => formData.append("ring_size", size));
      necklaceSizes.forEach((size) => formData.append("necklace_size", size));

      // Text areas
      formData.append("engraving_allowed", engraving.toString());
      formData.append("gift", gift.toString());
      if (productDetails.trim()) formData.append("product_details", productDetails.trim());
      if (centerStoneDetails.trim()) formData.append("center_stone_details", centerStoneDetails.trim());
      if (sideStoneDetails.trim()) formData.append("side_stone_details", sideStoneDetails.trim());
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

  // Generate all combinations of Stone (diamondOrigins) × Carat × Gold (metalTypes)
  const handleGenerateVariants = () => {
    if (diamondOrigins.length === 0) {
      toast.error("Please select at least one Stone Type (Diamond Origin)");
      return;
    }
    if (caratWeights.length === 0) {
      toast.error("Please select at least one Carat Weight");
      return;
    }
    if (metalTypes.length === 0) {
      toast.error("Please select at least one Gold Type (Metal Type)");
      return;
    }

    const rows: VariantRow[] = [];

    diamondOrigins.forEach(stone => {
      caratWeights.forEach(carat => {
        metalTypes.forEach(gold => {
          rows.push({
            stone_type: stone,
            carat_weight: `${carat}ct`,
            gold_type: gold,
            price: "",
            discounted_price: "",
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



  return (
    <Modal centered show={show} onHide={handleClose} size="lg" className="modal-parent">
      <Modal.Body className="modal-body-scrollable">
        <div className="custom-form-container">
          <h3 className="mb-4 fw-bold text-center text-black">Add New Product</h3>
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
            <div className="mb-3">
              <label className="form-label text-black">Discount Label</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 20% off"
                value={discountLabel}
                onChange={(e) => setDiscountLabel(e.target.value)}
              />
            </div>
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
                            const selectedCat = categories.find((cat) => getCategoryId(cat) === selectedCategory);
                            return selectedCat ? getCategoryName(selectedCat) : "Select...";
                          })()
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {categoryDropdownOpen && (
                    <div className="dropdown-list">
                      {categories.length > 0 ? (
                        categories.map((category) => {
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


           

            {/* Checkboxes */}
            <div className="mb-3">
              <label className="form-label text-black">Metal Type</label>
              <div className="w-100 half-divide">
             
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="metal1"
                    checked={metalTypes.includes("14K White Gold")}
                    onChange={() => toggleMetalType("14K White Gold")}
                  />
                  <label className="form-check-label text-black" htmlFor="metal1">14K White Gold</label>
                </div>
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="metal2"
                    checked={metalTypes.includes("14K Yellow Gold")}
                    onChange={() => toggleMetalType("14K Yellow Gold")}
                  />
                  <label className="form-check-label text-black" htmlFor="metal2">14K Yellow Gold</label>
                </div>
              </div>
              <div className="w-100 half-divide">
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="metal3"
                    checked={metalTypes.includes("14K Rose Gold")}
                    onChange={() => toggleMetalType("14K Rose Gold")}
                  />
                  <label className="form-check-label text-black" htmlFor="metal3">14K Rose Gold</label>
                </div>
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="metal4"
                    checked={metalTypes.includes("18K White Gold")}
                    onChange={() => toggleMetalType("18K White Gold")}
                  />
                  <label className="form-check-label text-black" htmlFor="metal4">18K White Gold</label>
                </div>
              </div>
              <div className="w-100 half-divide">
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="metal5"
                    checked={metalTypes.includes("18K Yellow Gold")}
                    onChange={() => toggleMetalType("18K Yellow Gold")}
                  />
                  <label className="form-check-label text-black" htmlFor="metal5">18K Yellow Gold</label>
                </div>
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="metal6"
                    checked={metalTypes.includes("18K Rose Gold")}
                    onChange={() => toggleMetalType("18K Rose Gold")}
                  />
                  <label className="form-check-label text-black" htmlFor="metal6">18K Rose Gold</label>
                </div>
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="metal7"
                    checked={metalTypes.includes("Platinum")}
                    onChange={() => toggleMetalType("Platinum")}
                  />
                  <label className="form-check-label text-black" htmlFor="metal7">Platinum</label>
                </div>
              </div>
            </div>

            {/* View Angle and Image Upload per Metal Type */}
            {metalTypes.length > 0 && (
              <div className="mb-3">
                <label className="form-label text-black fw-bold">View Angle & Image Upload (per Metal Type)</label>
                {metalTypes.map((metalType) => (
                  <div key={metalType} className="mb-4 p-3 border rounded">
                    <h6 className="text-black mb-3">{metalType}</h6>
                    
                    {/* View Angle Selection - All 3 Required */}
                    <div className="mb-3">
                      <label className="form-label text-black">View Angles <span className="text-danger">*</span></label>
                      <div className="w-100">
                        {viewAngleOptions.map((angle) => (
                          <div className="form-check form-check-inline" key={angle.id}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`${metalType}-${angle.value}`}
                              checked={(metalViewAngles[metalType] || []).includes(angle.value)}
                              disabled
                              readOnly
                            />
                            <label className="form-check-label text-black" htmlFor={`${metalType}-${angle.value}`}>
                              {angle.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <small className="text-muted">All view angles are required</small>
                    </div>
                    
                    {/* Image Upload for each View Angle - Single Image Required */}
                    <div className="mb-3">
                      <label className="form-label text-black">Upload Images <span className="text-danger">*</span></label>
                      {viewAngleOptions.map((angle) => (
                        <div key={angle.id} className="mb-3 p-2 bg-light rounded">
                          <label className="form-label text-black fw-semibold">{angle.label} <span className="text-danger">*</span></label>
                          <input
                            type="file"
                            className="form-control mb-2"
                            accept="image/*"
                            data-metal={metalType}
                            data-angle={angle.value}
                            onChange={(e) => handleMetalImageUpload(metalType, angle.value, e)}
                          />
                          <div className="image-preview">
                            {metalImages[metalType]?.[angle.value] && (
                              <div className="image-box">
                                <img src={URL.createObjectURL(metalImages[metalType][angle.value])} alt={`${metalType} ${angle.value}`} />
                                <button
                                  type="button"
                                  className="remove-btn"
                                  onClick={() => removeMetalImage(metalType, angle.value)}
                                >
                                  ✖
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                      {diamondOrigins.length
                        ? `Selected: ${diamondOrigins.join(", ")}`
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {diamondDropdownOpen && (
                    <div className="dropdown-list">
                      {diamondOriginStatic.map((origin) => (
                        <label className="dropdown-item" key={origin.id}>
                          <input
                            type="checkbox"
                            value={origin.value}
                            checked={diamondOrigins.includes(origin.value)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleDiamondOrigin(origin);
                            }}
                          />
                          {origin.label}
                        </label>
                      ))}
                    </div>
                  )}
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
                      {diamondQualityStatic.map((quality) => (
                        <label className="dropdown-item" key={quality.id}>
                          <input
                            type="checkbox"
                            value={quality.value}
                            checked={diamondQualities.includes(quality.value)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleDiamondQuality(quality);
                            }}
                          />
                          {quality.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Carat Weight</label>
              <div className="w-100" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {caratWeightOptions.map((weight, index) => (
                  <div className="form-check" key={index} style={{ width: 'calc(12.5% - 8px)', minWidth: '100px' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`carat-${weight}`}
                      checked={caratWeights.includes(weight)}
                      onChange={() => toggleCaratWeight(weight)}
                    />
                    <label className="form-check-label text-black" htmlFor={`carat-${weight}`}>
                      {weight} ct
                    </label>
                  </div>
                ))}
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
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="stone-none"
                    checked={stones.includes("None")}
                    onChange={() => toggleStone("None")}
                  />
                  <label className="form-check-label text-black" htmlFor="stone-none">
                    None
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
                    id="productSpecialsNewArrivals"
                    value="New Arrivals"
                    checked={productSpecials === "New Arrivals"}
                    onChange={(e) => setProductSpecials(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="productSpecialsNewArrivals">
                    New Arrivals
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="productSpecials"
                    id="productSpecialsTopSellers"
                    value="Top Sellers"
                    checked={productSpecials === "Top Sellers"}
                    onChange={(e) => setProductSpecials(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="productSpecialsTopSellers">
                    Top Sellers
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="productSpecials"
                    id="productSpecialsFeaturedRings"
                    value="Featured Rings"
                    checked={productSpecials === "Featured Rings"}
                    onChange={(e) => setProductSpecials(e.target.value)}
                  />
                  <label className="form-check-label text-black" htmlFor="productSpecialsFeaturedRings">
                    Featured Rings
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

            <div className="mb-3">
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
            </div>

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
            <div className="mb-3">
              <label className="form-label text-black">Product Details</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Enter Product Details..."
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Center Stone Details</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Enter Center Stone Details..."
                value={centerStoneDetails}
                onChange={(e) => setCenterStoneDetails(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Side Stone Details</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Enter Side Stone Details..."
                value={sideStoneDetails}
                onChange={(e) => setSideStoneDetails(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Stone Details</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Enter Stone Details..."
                value={stoneDetails}
                onChange={(e) => setStoneDetails(e.target.value)}
              ></textarea>
            </div>
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
                Variants are generated from Stone Type (Diamond Origin), Carat Weight and Gold Type (Metal Type).
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
