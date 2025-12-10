import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/Slice";
import { toast } from "react-hot-toast";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";
import cakeVideo from "../../assets/Gallery/cake.mp4";

const API_BASE = "http://localhost:5000/api/product";

export default function FilterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [weights, setWeights] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 10000,
    sort: "",
    weight: "",
    flavor: "",
  });

  // Auto-slide interval ref
  const slideIntervalRef = useRef(null);

  // Fetch featured products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API_BASE}/featured`);
        if (res.data.success) {
          setFeaturedProducts(res.data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };
    fetchFeatured();
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          limit: 1000, // Get all products
        };
        const res = await axios.get(`${API_BASE}`, { params });
        if (res.data.success) {
          const products = res.data.products || [];
          setAllProducts(products);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(products.map((p) => p.category).filter(Boolean)),
          ];
          setCategories(uniqueCategories);

          // Extract flavors from tags and descriptions
          const flavorKeywords = [
            "chocolate",
            "vanilla",
            "strawberry",
            "red velvet",
            "butterscotch",
            "pineapple",
            "mango",
            "coffee",
            "caramel",
            "blueberry",
            "black forest",
            "white forest",
            "fruit",
            "cream",
          ];
          const extractedFlavors = new Set();
          products.forEach((p) => {
            const text = `${p.name} ${p.description} ${(p.tags || []).join(
              " "
            )}`.toLowerCase();
            flavorKeywords.forEach((flavor) => {
              if (text.includes(flavor)) {
                extractedFlavors.add(
                  flavor.charAt(0).toUpperCase() + flavor.slice(1)
                );
              }
            });
          });
          setFlavors(Array.from(extractedFlavors).sort());

          // Extract weights from tags and descriptions
          const weightPatterns = [
            "0.5kg",
            "0.5 kg",
            "1kg",
            "1 kg",
            "2kg",
            "2 kg",
            "3kg",
            "3 kg",
            "4kg",
            "4 kg",
            "5kg",
            "5 kg",
          ];
          const extractedWeights = new Set();
          products.forEach((p) => {
            const text = `${p.name} ${p.description} ${(p.tags || []).join(
              " "
            )}`.toLowerCase();
            weightPatterns.forEach((weight) => {
              if (text.includes(weight.toLowerCase())) {
                extractedWeights.add(weight);
              }
            });
          });
          setWeights(Array.from(extractedWeights).sort());

          // Find max price
          const prices = products.map((p) => p.price).filter(Boolean);
          const maxProductPrice =
            prices.length > 0 ? Math.max(...prices) : 10000;
          setMaxPrice(Math.ceil(maxProductPrice / 1000) * 1000);
          setPriceRange([0, Math.ceil(maxProductPrice / 1000) * 1000]);
          setFilters((prev) => ({
            ...prev,
            maxPrice: Math.ceil(maxProductPrice / 1000) * 1000,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...allProducts];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Price filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Weight filter
    if (filters.weight) {
      filtered = filtered.filter((p) => {
        const text = `${p.name} ${p.description} ${(p.tags || []).join(
          " "
        )}`.toLowerCase();
        return text.includes(filters.weight.toLowerCase());
      });
    }

    // Flavor filter
    if (filters.flavor) {
      filtered = filtered.filter((p) => {
        const text = `${p.name} ${p.description} ${(p.tags || []).join(
          " "
        )}`.toLowerCase();
        return text.includes(filters.flavor.toLowerCase());
      });
    }

    // Sort
    if (filters.sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "name_asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: newest first
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  }, [allProducts, filters]);

  // Auto-slide featured products carousel
  useEffect(() => {
    if (featuredProducts.length > 0) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [featuredProducts.length]);

  // Group products by category
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      minPrice: 0,
      maxPrice: maxPrice,
      sort: "",
      weight: "",
      flavor: "",
    });
    setPriceRange([0, maxPrice]);
    setShowFilters(false); // Close sidebar
  };

  const applyFilters = () => {
    setShowFilters(false); // Close sidebar
  };

  const handlePriceRangeChange = (newRange) => {
    // Ensure min doesn't exceed max
    const [min, max] = newRange;
    const validMin = Math.min(min, max);
    const validMax = Math.max(min, max);
    const finalRange = [validMin, validMax];

    setPriceRange(finalRange);
    setFilters((prev) => ({
      ...prev,
      minPrice: finalRange[0],
      maxPrice: finalRange[1],
    }));
  };

  const handleAddToCart = (e, product) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: getImageUrl(product.images?.[0]),
        qty: 1,
      })
    );

    toast.success(`${product.name} added to cart!`);
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleBuyNow = (e, product) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    // Add to cart first
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: getImageUrl(product.images?.[0]),
        qty: 1,
      })
    );

    setShowProductModal(false);
    setSelectedProduct(null);
    // Redirect to order page
    navigate("/order");
    toast.success("Redirecting to checkout...");
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
  };

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/400x400?text=No+Image";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8b5e3c] mx-auto mb-4"></div>
          <p className="text-xl text-[#8b5e3c]">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f4] pt-20">
      {/* Hero Video Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={cakeVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>

        {/* Content - Left Aligned */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl text-left"
              >
                Fresh Baked
                <span className="block text-[#f3d2ae] mt-2">Every Day</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-white/95 mb-4 drop-shadow-lg text-left font-medium"
              >
                Indulge in Our Artisan Creations
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-lg text-white/85 mb-8 drop-shadow-md text-left leading-relaxed"
              >
                Handcrafted with Love • Premium Ingredients • Made Fresh Daily
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-left"
              >
                <Link to="/menu">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-[#dda56a] to-[#e8b381] text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all"
                  >
                    Explore Our Menu
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <section className="relative bg-gradient-to-br from-[#e2bf9d] to-[#d4a574] py-12 md:py-16 overflow-hidden">
          <div className="w-full px-0 mx-0">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#8b5e3c] mb-8 md:mb-12 drop-shadow-sm"
            >
              Featured Products
            </motion.h2>

            <div className="relative max-w-4xl mx-auto px-4">
              {/* Card Slider */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="h-56 sm:h-64 md:h-80 bg-gradient-to-br from-[#fff9f4] to-[#f0e3d6] overflow-hidden">
                      <img
                        src={getImageUrl(
                          featuredProducts[currentSlide]?.images?.[0]
                        )}
                        alt={featuredProducts[currentSlide]?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-7 md:p-10 flex flex-col justify-center">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#8b5e3c] mb-3">
                        {featuredProducts[currentSlide]?.name}
                      </h3>

                      <p className="text-[#6f472b] mb-4 text-sm sm:text-base line-clamp-3">
                        {featuredProducts[currentSlide]?.description ||
                          "Delicious bakery item made with love"}
                      </p>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i <
                                Math.floor(
                                  featuredProducts[currentSlide]?.rating || 0
                                )
                                  ? "fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({featuredProducts[currentSlide]?.reviewsCount || 0}{" "}
                          reviews)
                        </span>
                      </div>

                      {/* Price + Buttons */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-3">
                        <span className="text-2xl sm:text-3xl font-bold text-[#8b5e3c]">
                          ₹{featuredProducts[currentSlide]?.price}
                        </span>

                        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                          {featuredProducts[currentSlide]?.stock > 0 ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const product =
                                    featuredProducts[currentSlide];
                                  handleAddToCart(e, product);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#8b5e3c] text-white text-sm sm:text-base font-semibold rounded-full shadow-lg hover:bg-[#6f472b]"
                              >
                                <FaShoppingCart />
                                <span className="hidden sm:inline">
                                  Add to Cart
                                </span>
                                <span className="sm:hidden">Cart</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleBuyNow(
                                    e,
                                    featuredProducts[currentSlide]
                                  );
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-[#c85a32] to-[#d78f52] text-white font-semibold text-sm sm:text-base rounded-full shadow-lg"
                              >
                                Buy Now
                              </button>
                            </>
                          ) : (
                            <p className="text-red-500 text-sm font-medium">
                              Out of Stock
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* --- ARROWS OUTSIDE CARD --- */}
              {featuredProducts.length > 1 && (
                <>
                  {/* DESKTOP: Left & Right of card */}
                  <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
                    <button
                      onClick={prevSlide}
                      className="pointer-events-auto bg-white hover:bg-gray-100 text-[#8b5e3c] p-3 rounded-full shadow-md"
                    >
                      <FaChevronLeft className="text-xl" />
                    </button>

                    <button
                      onClick={nextSlide}
                      className="pointer-events-auto bg-white hover:bg-gray-100 text-[#8b5e3c] p-3 rounded-full shadow-md"
                    >
                      <FaChevronRight className="text-xl" />
                    </button>
                  </div>

                  {/* MOBILE: Arrows below card */}
                  <div className="flex md:hidden justify-center gap-6 mt-6">
                    <button
                      onClick={prevSlide}
                      className="bg-white hover:bg-gray-100 text-[#8b5e3c] p-3 rounded-full shadow-md"
                    >
                      <FaChevronLeft className="text-lg" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="bg-white hover:bg-gray-100 text-[#8b5e3c] p-3 rounded-full shadow-md"
                    >
                      <FaChevronRight className="text-lg" />
                    </button>
                  </div>
                </>
              )}

              {/* Dots */}
              {featuredProducts.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? "bg-[#8b5e3c] w-6"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="w-full px-4 py-4 h-full">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter Sidebar */}
          {/* Mobile Overlay */}
          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilters(false)}
            />
          )}

          <aside
            className={`lg:w-80 flex-shrink-0 ${
              showFilters
                ? "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-80 lg:w-auto"
                : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 h-full lg:max-h-[90vh] lg:sticky lg:top-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-[#8b5e3c] flex items-center gap-2">
                  <FaFilter className="text-[#8b5e3c]" /> Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close filters"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Search
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dda56a] focus:border-[#dda56a] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Price Range Slider - Dual Range */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹
                  {priceRange[1].toLocaleString()}
                </label>
                <div className="relative h-8">
                  {/* Track Background */}
                  <div className="absolute w-full h-2 bg-gray-200 rounded-lg top-1/2 -translate-y-1/2"></div>

                  {/* Active Range */}
                  <div
                    className="absolute h-2 bg-[#8b5e3c] rounded-lg top-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
                    style={{
                      left: `${(priceRange[0] / maxPrice) * 100}%`,
                      width: `${
                        ((priceRange[1] - priceRange[0]) / maxPrice) * 100
                      }%`,
                    }}
                  ></div>

                  {/* Min Range Input */}
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step={Math.max(100, Math.floor(maxPrice / 100))}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const newMin = Math.min(
                        Number(e.target.value),
                        priceRange[1]
                      );
                      handlePriceRangeChange([newMin, priceRange[1]]);
                    }}
                    className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
                  />

                  {/* Max Range Input */}
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step={Math.max(100, Math.floor(maxPrice / 100))}
                    value={priceRange[1]}
                    onChange={(e) => {
                      const newMax = Math.max(
                        Number(e.target.value),
                        priceRange[0]
                      );
                      handlePriceRangeChange([priceRange[0], newMax]);
                    }}
                    className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20"
                  />

                  {/* Min/Max Labels */}
                  <div className="flex justify-between text-xs text-gray-500 pt-4">
                    <span className="font-medium">₹0</span>
                    <span className="font-medium">
                      ₹{maxPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weight Filter - Buttons */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Weight (KG)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange("weight", "")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.weight === ""
                        ? "bg-[#8b5e3c] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    All
                  </button>
                  {(weights.length > 0
                    ? weights
                    : ["0.5kg", "1kg", "2kg", "3kg", "4kg", "5kg"]
                  ).map((weight) => (
                    <button
                      key={weight}
                      onClick={() =>
                        handleFilterChange(
                          "weight",
                          filters.weight === weight ? "" : weight
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.weight === weight
                          ? "bg-[#8b5e3c] text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor Filter - Buttons */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Flavor
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange("flavor", "")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.flavor === ""
                        ? "bg-[#8b5e3c] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    All
                  </button>
                  {(flavors.length > 0
                    ? flavors
                    : [
                        "Chocolate",
                        "Vanilla",
                        "Strawberry",
                        "Red Velvet",
                        "Butterscotch",
                      ]
                  ).map((flavor) => (
                    <button
                      key={flavor}
                      onClick={() =>
                        handleFilterChange(
                          "flavor",
                          filters.flavor === flavor ? "" : flavor
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.flavor === flavor
                          ? "bg-[#8b5e3c] text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply and Clear Filters */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={applyFilters}
                  className="flex-1 py-2.5 px-4 bg-[#8b5e3c] hover:bg-[#6f472b] text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all font-medium border border-gray-200 hover:border-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Sort and Filter Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md text-[#8b5e3c] font-medium hover:bg-gray-50"
              >
                <FaFilter /> {showFilters ? "Hide" : "Show"} Filters
              </button>

              <div className="flex items-center gap-3 flex-1 sm:justify-end">
                <span className="text-sm font-medium text-gray-700">
                  Sort by:
                </span>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dda56a] focus:border-transparent bg-white shadow-sm"
                >
                  <option value="">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
            </div>

            {/* Products by Category */}
            {Object.keys(productsByCategory).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <p className="text-xl text-gray-600 mb-4">No products found</p>
                <p className="text-gray-500">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(productsByCategory).map(
                  ([category, products]) => (
                    <motion.section
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
                    >
                      <h2 className="text-2xl md:text-3xl font-bold text-[#8b5e3c] mb-6 pb-3 border-b-2 border-[#e2bf9d]">
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                          <motion.div
                            key={product._id}
                            whileHover={{ y: -5 }}
                            onClick={() => handleProductClick(product)}
                            className="bg-gradient-to-br from-[#fff9f4] to-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-transparent hover:border-[#c89f7a]/60 flex flex-col cursor-pointer"
                          >
                            <div className="flex-shrink-0">
                              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#f0e3d6] to-[#fff9f4]">
                                <img
                                  src={getImageUrl(product.images?.[0])}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/400x400?text=No+Image";
                                  }}
                                />
                                {product.isFeatured && (
                                  <span className="absolute top-2 right-2 bg-[#8b5e3c] text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                              <h3 className="text-lg font-bold text-[#8b5e3c] mb-2 line-clamp-2 hover:text-[#6f472b] transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xl font-bold text-[#8b5e3c]">
                                  ₹{product.price}
                                </span>
                                {product.rating > 0 && (
                                  <div className="flex items-center gap-1">
                                    <FaStar className="text-yellow-400 text-sm" />
                                    <span className="text-sm text-gray-600">
                                      {product.rating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {product.stock <= 0 ? (
                                <p className="text-red-500 text-sm mb-3 text-center py-2 bg-red-50 rounded">
                                  Out of Stock
                                </p>
                              ) : (
                                <div className="flex flex-col gap-2 mt-auto pt-3">
                                  <button
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#8b5e3c] text-white rounded-lg hover:bg-[#6f472b] transition-colors font-medium text-sm shadow-md hover:shadow-lg"
                                  >
                                    <FaShoppingCart className="text-sm" />
                                    Add to Cart
                                  </button>
                                  <button
                                    onClick={(e) => handleBuyNow(e, product)}
                                    className="w-full px-4 py-2.5 bg-gradient-to-r from-[#dda56a] to-[#e8b381] text-white rounded-lg hover:from-[#c8955a] hover:to-[#d8a371] transition-all font-medium text-sm shadow-md hover:shadow-lg"
                                  >
                                    Buy Now
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.section>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <motion.div
            key="product-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowProductModal(false);
              setSelectedProduct(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden bg-gradient-to-br from-[#fff9f4] to-[#f0e3d6]">
                  <img
                    src={getImageUrl(selectedProduct.images?.[0])}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                  />
                  {selectedProduct.isFeatured && (
                    <span className="absolute top-4 right-4 bg-[#8b5e3c] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      Featured
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setShowProductModal(false);
                      setSelectedProduct(null);
                    }}
                    className="absolute top-4 left-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all"
                    aria-label="Close modal"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex flex-col">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#8b5e3c] mb-3">
                    {selectedProduct.name}
                  </h2>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl md:text-4xl font-bold text-[#8b5e3c]">
                      ₹{selectedProduct.price}
                    </span>
                    {selectedProduct.rating > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < Math.floor(selectedProduct.rating || 0)
                                  ? "fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({selectedProduct.reviewsCount || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </h3>
                    <span className="inline-block px-3 py-1 bg-[#e2bf9d] text-[#8b5e3c] rounded-full text-sm font-medium">
                      {selectedProduct.category || "Uncategorized"}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProduct.description ||
                        "Delicious bakery item made with love and premium ingredients."}
                    </p>
                  </div>

                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-4 space-y-3">
                    {selectedProduct.stock <= 0 ? (
                      <p className="text-red-500 text-center py-3 bg-red-50 rounded-lg font-medium">
                        Out of Stock
                      </p>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAddToCart(null, selectedProduct)}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8b5e3c] text-white rounded-lg hover:bg-[#6f472b] transition-colors font-semibold text-base shadow-lg hover:shadow-xl"
                        >
                          <FaShoppingCart />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow(null, selectedProduct)}
                          className="w-full px-6 py-3 bg-gradient-to-r from-[#dda56a] to-[#e8b381] text-white rounded-lg hover:from-[#c8955a] hover:to-[#d8a371] transition-all font-semibold text-base shadow-lg hover:shadow-xl"
                        >
                          Buy Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
