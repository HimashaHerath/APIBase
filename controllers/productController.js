const Product = require('../models/Product');
const logger = require('../utils/logger');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const newProduct = new Product({ name, description, price, category, stock, imageUrl });
    await newProduct.save();
    logger.info(`Product created: ${newProduct._id}`);
    res.status(201).json(newProduct);
  } catch (error) {
    logger.error(`Product creation failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.warn(`Get product failed - product not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Product not found' });
    }
    logger.info(`Product retrieved: ${product._id}`);
    res.status(200).json(product);
  } catch (error) {
    logger.error(`Get product failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    logger.info(`All products retrieved, count: ${products.length}`);
    res.status(200).json(products);
  } catch (error) {
    logger.error(`Get all products failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      imageUrl
    } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      logger.warn(`Update product failed - product not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Product not found' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (imageUrl) product.imageUrl = imageUrl;

    await product.save();
    logger.info(`Product updated: ${product._id}`);
    res.status(200).json(product);
  } catch (error) {
    logger.error(`Update product failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      logger.warn(`Delete product failed - product not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Product not found' });
    }
    logger.info(`Product deleted: ${product._id}`);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    logger.error(`Delete product failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
