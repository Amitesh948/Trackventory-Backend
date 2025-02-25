require("dotenv").config();


console.log("MongoDB URI:", process.env.MONGO_URI); 

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require('./routes/product.route'); 

const app = express();
app.use(express.json());
connectDB();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api/products', productRoutes);
app.use("/api/auth", require("./routes/auth"));

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
