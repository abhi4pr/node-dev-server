const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/Sales/dashboardController");
const { verifyToken } = require("../../middleware/auth");

/**
 * User Dashboard routes
 */
router.get("/sales/top20_account_list/", verifyToken, dashboardController.getTop20AccountList);
router.get("/sales/weekly_monthly_quarterly_list/", verifyToken, dashboardController.getWeeklyMonthlyQuarterlyList);

module.exports = router; 