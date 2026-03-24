import Product from "../models/Product.js";

const generateUniqueSlug = async (slug, excludeId = null) => {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existing = await Product.findOne({ slug: uniqueSlug });
    if (!existing || (excludeId && existing._id.toString() === excludeId))
      break;
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    let { name, slug, description, price, salePrice, countInStock, image } =
      req.body;

    slug = await generateUniqueSlug(slug);

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      salePrice: salePrice || null,
      countInStock: countInStock || 0,
      image: image || "",
    });

    res.status(201).json({ message: "Product created successfully.", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, salePrice, countInStock, image } =
      req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found." });

    if (slug && slug !== product.slug) {
      product.slug = await generateUniqueSlug(slug, id);
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.salePrice =
      salePrice !== undefined ? salePrice || null : product.salePrice;
    product.countInStock = countInStock ?? product.countInStock;
    product.image = image !== undefined ? image : product.image;

    await product.save();
    res.status(200).json({ message: "Product updated successfully.", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
