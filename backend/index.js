require("dotenv").config(); // At the top of the file, before any other imports

const express = require("express");
const userRoutes = require("./routes/userRoutes"); // Import user routes only
const paymentRoutes = require("./routes/paymentRoutes");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Use the user routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/payments", paymentRoutes); // Add missing slash here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
