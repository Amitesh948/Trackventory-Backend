const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 }, 
  category: { type: String, required: true, trim: true },
  image: { type: String, default: null },
  stock: { type: Number, required: true, min: 0 }, 
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
