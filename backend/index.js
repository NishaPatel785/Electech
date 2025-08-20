import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoute from "./route/category.route.js";
import subcategoryRoute from "./route/sub_category.route.js"
import brandRoute from "./route/brand.route.js"
import productRoute from "./route/product.route.js"
import userRoute from "./route/user.route.js"
import wishRoute from "./route/wishlist.route.js"
import CartRoute from "./route/addToCart.route.js"
import CheckOutRoute from "./route/checkout.route.js"
import contactRoute from"./route/contact.route.js"
import reviewRoute from "./route/review.route.js"
import paymentRoute from "./route/payment.route.js"
import orderRoute from "./route/order.route.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PRO_PORT || 6001;

app.use('/node-files',express.static("uploads"))
app.listen(PORT, () => {
    console.log(` Server running on port: ${PORT}`);
});




app.use("/api/v1", categoryRoute);
app.use("/api/v1", subcategoryRoute);
app.use("/api/v1", brandRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", wishRoute);
app.use("/api/v1", CartRoute);
app.use("/api/v1", CheckOutRoute);
app.use("/api/v1", contactRoute);
app.use("/api/v1", reviewRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1",orderRoute)
