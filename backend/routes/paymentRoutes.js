const express = require("express");
const { addFund, fundTransfer } = require("../controllers/paymentController");
const { authProtect } = require("../middleware/authProtect");
const router = express.Router();

// Define the add fund route
router.post("/add-fund", authProtect, addFund);
router.post("/transfer", authProtect, fundTransfer)

module.exports = router;
