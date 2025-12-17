import React, { useState, useEffect, useRef, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCreateProductMutation } from "../../store/api/productApi";
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  console.log(categories, subCategories);
  // Category and SubCategory
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] = useState(false);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  // Metal Type
  const [metalTypes, setMetalTypes] = useState<string[]>([]);

  // Diamond fields
  const [diamondOrigins, setDiamondOrigins] = useState<string[]>([]);
  const [diamondQualities, setDiamondQualities] = useState<string[]>([]);
  const [diamondDropdownOpen, setDiamondDropdownOpen] = useState(false);
  const [diamondQualityDropdownOpen, setDiamondQualityDropdownOpen] = useState(false);

  // Carat Weight
  const [caratWeights, setCaratWeights] = useState<string[]>([]);

  // Ring Size and Necklace Size
  const [ringSizes, setRingSizes] = useState<string[]>([]);
  const [necklaceSizes, setNecklaceSizes] = useState<string[]>([]);
  const [ringSizeDropdownOpen, setRingSizeDropdownOpen] = useState(false);
  const [necklaceSizeDropdownOpen, setNecklaceSizeDropdownOpen] = useState(false);

  // Text areas
  const [engraving, setEngraving] = useState<string>("");
  const [productDetails, setProductDetails] = useState<string>("");
  const [centerStoneDetails, setCenterStoneDetails] = useState<string>("");
  const [sideStoneDetails, setSideStoneDetails] = useState<string>("");
  const [stoneDetails, setStoneDetails] = useState<string>("");
  const [sizeType, setSizeType] = useState<"ring" | "necklace">("ring");
  // Status
  const [status, setStatus] = useState<string>("active");

  // Loading state
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const subCategoryDropdownRef = useRef<HTMLDivElement>(null);
  const diamondDropdownRef = useRef<HTMLDivElement>(null);
  const diamondQualityDropdownRef = useRef<HTMLDivElement>(null);
  const ringSizeDropdownRef = useRef<HTMLDivElement>(null);
  const necklaceSizeDropdownRef = useRef<HTMLDivElement>(null);
  // Filter subcategories based on selected categories
  const filteredSubCategories = useMemo(() => {
    if (selectedCategories.length === 0) {
      return subCategories;
    }
    return subCategories.filter((subCat) => {
      const categoryId = typeof subCat?.categoryId === 'object'
        ? subCat?.categoryId?._id
        : subCat?.categoryId;
      return selectedCategories.includes(categoryId);
    });
  }, [subCategories, selectedCategories]);

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

  const diamondOriginStatic = [
    { id: 1, label: "Natural", value: "natural" },
    { id: 2, label: "Lab Grown", value: "lab grown" },
    { id: 3, label: "Other", value: "other" },
  ];

  const diamondQualityStatic = [
    { id: 1, label: "Excellent", value: "excellent" },
    { id: 2, label: "Very Good", value: "very good" },
    { id: 3, label: "Good", value: "good" },
    { id: 4, label: "Fair", value: "fair" },
  ];

  const ringSizeStatic = ["4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const necklaceSizeStatic = ["16\"", "18\"", "20\"", "22\"", "24\""];
  const caratWeightOptions = ["0.5", "1", "1.5", "2", "2.5", "3", "4", "5"];

  // Handle file selection
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []) as File[];
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // Remove image
  const removeImage = (index: number) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  // Toggle category selection
  const toggleCategory = (category: any) => {
    const categoryId = getCategoryId(category);
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // Remove category and also remove subcategories that belong to this category
        const updated = prev.filter((c) => c !== categoryId);
        // Remove subcategories that belong to the removed category
        setSelectedSubCategories((prevSub) => {
          return prevSub.filter((subId) => {
            const subCat = subCategories.find((sc) => getSubCategoryId(sc) === subId);
            if (!subCat) return true;
            const subCatCategoryId = typeof subCat.categoryId === 'object'
              ? subCat.categoryId._id
              : subCat.categoryId;
            return subCatCategoryId !== categoryId;
          });
        });
        return updated;
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Toggle subcategory selection
  const toggleSubCategory = (subCategory: any) => {
    const subCategoryId = getSubCategoryId(subCategory);
    setSelectedSubCategories((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((c) => c !== subCategoryId)
        : [...prev, subCategoryId]
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
    setMetalTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Toggle carat weight
  const toggleCaratWeight = (weight: string) => {
    setCaratWeights((prev) =>
      prev.includes(weight)
        ? prev.filter((w) => w !== weight)
        : [...prev, weight]
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
    setSelectedFiles([]);
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setMetalTypes([]);
    setDiamondOrigins([]);
    setDiamondQualities([]);
    setCaratWeights([]);
    setRingSizes([]);
    setNecklaceSizes([]);
    setEngraving("");
    setProductDetails("");
    setCenterStoneDetails("");
    setSideStoneDetails("");
    setStoneDetails("");
    setStatus("active");
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
    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error("Please select at least one Category");
      return;
    }
    if (selectedSubCategories.length === 0) {
      toast.error("Please select at least one Sub Category");
      return;
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

      // Categories
      selectedCategories.forEach((catId) => formData.append("categoryId", catId));
      selectedSubCategories.forEach((subCatId) => formData.append("subCategoryId", subCatId));

      // Metal types
      metalTypes.forEach((type) => formData.append("metal_type", type));

      // Diamond fields
      diamondOrigins.forEach((origin) => formData.append("diamond_origin", origin));
      diamondQualities.forEach((quality) => formData.append("diamond_quality", quality));
      caratWeights.forEach((weight) => formData.append("carat_weight", weight));

      // Sizes
      ringSizes.forEach((size) => formData.append("ring_size", size));
      necklaceSizes.forEach((size) => formData.append("necklace_size", size));

      // Text areas
      if (engraving.trim()) formData.append("engraving_text", engraving.trim());
      if (productDetails.trim()) formData.append("product_details", productDetails.trim());
      if (centerStoneDetails.trim()) formData.append("center_stone_details", centerStoneDetails.trim());
      if (sideStoneDetails.trim()) formData.append("side_stone_details", sideStoneDetails.trim());
      if (stoneDetails.trim()) formData.append("stone_details", stoneDetails.trim());

      // Status
      formData.append("status", status);
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

      // Images
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

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
            {/* Multi-Select Dropdown */}
            <div className="dropdown-multi">
              <div className="mb-3 ddr-width" ref={categoryDropdownRef}>
                <label className="dropdown-label text-black">Category *</label>
                <div className={`dropdown ${categoryDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  >
                    <span>
                      {selectedCategories.length
                        ? `${selectedCategories.length} category${selectedCategories.length > 1 ? 'ies' : ''} selected`
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
                            <label className="dropdown-item" key={categoryId}>
                              <input
                                type="checkbox"
                                value={categoryId}
                                checked={selectedCategories.includes(categoryId)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleCategory(category);
                                }}
                              />
                              {categoryName}
                            </label>
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
                <label className="dropdown-label text-black">Sub Category *</label>
                <div className={`dropdown ${subCategoryDropdownOpen ? "active" : ""}`}>
                  <div
                    className="dropdown-select"
                    onClick={() => {
                      if (selectedCategories.length === 0) {
                        toast.error("Please select a category first");
                        return;
                      }
                      setSubCategoryDropdownOpen(!subCategoryDropdownOpen);
                    }}
                  >
                    <span>
                      {selectedSubCategories.length
                        ? `${selectedSubCategories.length} subcategory${selectedSubCategories.length > 1 ? 'ies' : ''} selected`
                        : "Select..."}
                    </span>
                    <i className="dropdown-arrow"></i>
                  </div>
                  {subCategoryDropdownOpen && (
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
                          {selectedCategories.length === 0
                            ? "Please select a category first"
                            : "No subcategories available for selected categories"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label className="form-label text-black">Upload Images</label>
              <input
                type="file"
                className="form-control"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div id="preview" className="image-preview">
                {selectedFiles.map((file, index) => (
                  <div className="image-box" key={index}>
                    <img src={URL.createObjectURL(file)} alt="preview" />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeImage(index)}
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
                    checked={metalTypes.includes("15K White Gold")}
                    onChange={() => toggleMetalType("15K White Gold")}
                  />
                  <label className="form-check-label text-black" htmlFor="metal1">15K White Gold</label>
                </div>
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="metal2"
                    checked={metalTypes.includes("15K Yellow Gold")}
                    onChange={() => toggleMetalType("15K Yellow Gold")}
                  />
                  <label className="form-check-label text-black" htmlFor="metal2">15K Yellow Gold</label>
                </div>
              </div>
              <div className="w-100 half-divide">
                <div className="form-check w-50">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="metal3"
                    checked={metalTypes.includes("15K Rose Gold")}
                    onChange={() => toggleMetalType("15K Rose Gold")}
                  />
                  <label className="form-check-label text-black" htmlFor="metal3">15K Rose Gold</label>
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
              </div>
            </div>
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
              <div className="w-100 half-divide">
                {caratWeightOptions.map((weight, index) => (
                  <div className="form-check w-50" key={index}>
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



            {/* Text Areas */}
            <div className="mb-3">
              <label className="form-label text-black">Engraving</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Enter Engraving..."
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
              ></textarea>
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
