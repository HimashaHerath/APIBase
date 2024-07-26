const express = require('express');
const {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router.post('/', createProduct);
router.get('/:id', getProductById);
router.get('/', getAllProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
