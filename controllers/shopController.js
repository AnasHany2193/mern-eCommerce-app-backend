import Product from "../models/Product.js";

export const getFilteredProducts = async (req, res) => {
  try {
    // Extract query parameters
    const {
      Category = "",
      Brand = "",
      sortBy = "price-lowtohigh",
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query = {};
    if (Category)
      query.category = { $in: Category.split(",").map((c) => c.trim()) };
    if (Brand) query.brand = { $in: Brand.split(",").map((b) => b.trim()) };

    // Define sorting options
    const sortOptions = {
      "price-lowtohigh": { price: 1 },
      "price-hightolow": { price: -1 },
      "title-atoz": { title: 1 },
      "title-ztoa": { title: -1 },
    };

    // Set default sort if none provided
    const sort = sortOptions[sortBy] || { price: 1 };

    // Fetch products
    const products = await Product.find(query).sort(sort);

    const totalCount = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to fetch product.",
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string" || keyword.trim().length < 3)
      return res.status(400).json({
        success: false,
        error:
          "Search keyword must be a non-empty string with at least 3 characters",
      });

    const sanitizedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regEx = new RegExp(sanitizedKeyword, "i");

    const searchQuery = {
      $or: [
        { title: regEx },
        { brand: regEx },
        { category: regEx },
        { description: regEx },
      ],
    };

    const searchResult = await Product.find(searchQuery).limit(50);

    res.status(200).json({
      success: true,
      data: searchResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
