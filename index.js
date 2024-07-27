require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require("./middlewares/errorHandler");
const apiLimiter = require("./utils/rateLimiter");

const app = express();
app.use(bodyParser.json());
app.use(cors());

connectDB();

app.use("/api/", apiLimiter);
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
