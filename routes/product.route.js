const express = require('express');
const multer = require('multer');
const Product = require('../models/product.model');
const productMiddleware = require('../middleware/productMiddleware');
const router = express.Router();
const productController = require('../controller/productController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/', productMiddleware,productController.getProducts);
router.post('/add',productMiddleware, upload.single('image')  ,productController.addProduct);

router.get("/:id", productController.getProductById);


// router.get('/:id', productMiddleware, async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     res.json(product);
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     res.status(500).json({ error: 'Failed to fetch product' });
//   }
// });

router.put('/update/:id', productMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, image: imageUrl, stock },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/delete/:id', productMiddleware, async (req, res) => {
  try {
    console.log('Deleting product with ID:', req.params.id);
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
