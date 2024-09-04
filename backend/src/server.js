const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
// const https = require("https");
// const fs = require("fs");

const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");
const authRoute = require("./routes/auth");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const paymentRoute = require("./routes/payment");

const productAdminRoute = require("./routes/Admin/product");
// const userAdminRoute = require("./routes/Admin/user");
const categoryAdminRoute = require("./routes/Admin/category.js");
const couponAdminRoute = require("./routes/Admin/coupon.js");
const analysisAdminRoute = require("./routes/Admin/analysis.js");
require("./passport.js");

const conecctToDB = require("./configs/db");

const PORT = process.env.PORT || 3000;

const app = express();

//CONNECT DATABASE
conecctToDB();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:8000",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// //ROUTES
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/auth", authRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/payment", paymentRoute);

// //ADMIN
app.use("/api/admin/product", productAdminRoute);
// app.use("/api/admin/user", userAdminRoute);
app.use("/api/admin/category", categoryAdminRoute);
app.use("/api/admin/coupon", couponAdminRoute);
app.use("/api/admin/analysis", analysisAdminRoute);

app.listen(PORT, () => {
  console.log(`App listening at https://localhost:${PORT}`);
})
