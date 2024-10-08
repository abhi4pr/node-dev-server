const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const validation = require("../helper/validation");
const accountMaster = require("../controllers/accounts/accountMasterController");
const accountType = require("../controllers/accounts/accountTypeController");
const accountCompanyTypeController = require("../controllers/accounts/accountCompanyTypeController");
const accountPoc = require("../controllers/accounts/accountPocController")
const accountDocumentMaster = require("../controllers/accounts/accountDocumentMasterController");
const accountDocumentOverview = require("../controllers/accounts/accountDocumentOverviewController");
const accountDepartmentController = require("../controllers/accounts/accountDepartmentController");
const brandCategoryController = require("../controllers/accounts/brandCategoryController");
const brandController = require("../controllers/accounts/brandController");

router.get("/accounts", (req, res) => {
    res.send({ message: "Welcome to Account module." });
});

/**
 * account master routes
 */
router.post("/accounts/add_account", verifyToken, accountMaster.addAccountDetails);
router.put("/accounts/edit_account/:id", verifyToken, accountMaster.editAccountDetails);
router.get("/accounts/get_all_account", verifyToken, accountMaster.getAllAccountDetails);
router.get("/accounts/get_single_account/:id", verifyToken, accountMaster.getSingleAccountDetails);
router.delete("/accounts/delete_account/:id", verifyToken, accountMaster.deleteAccountDetails);
//billing get data
router.get("/accounts/get_all_account_billing", verifyToken, accountMaster.getAllAccountBillingDetails);
router.get("/accounts/get_single_account_billing/:id", verifyToken, accountMaster.getSingleAccountBillingDetails);

/**
 * account type routes
 */
router.post("/accounts/add_account_type", verifyToken, validation.accountTypeValidation,
    accountType.addAccountType);
router.get("/accounts/get_account_type/:id", verifyToken, accountType.getAccountTypeData);
router.put("/accounts/update_account_type/:id", verifyToken, validation.accountTypeValidation,
    accountType.updateAccountTypeData);
router.get("/accounts/get_account_type_list", verifyToken, accountType.getAccountTypeList);
router.delete("/accounts/delete_account_type/:id", verifyToken, accountType.deleteAccountType);

/**
 * account poc routes
 */
router.post("/accounts/add_account_poc", verifyToken, accountPoc.addAccountPoc);
router.put("/accounts/update_account_poc/:id", verifyToken, accountPoc.updateAccountPoc);
router.get("/accounts/get_account_poc/:id", verifyToken, accountPoc.getAccountPocDetails);
router.get("/accounts/get_account_poc_list", verifyToken, accountPoc.getAccountPocList);
router.delete("/accounts/delete_account_poc/:id", verifyToken, accountPoc.deleteAccountPoc);
router.put("/accounts/update_multiple_account_poc/:id", verifyToken, accountPoc.updateMultipleAccountPoc);

/**
 * account company type routes update_multiple_account_poc
 */
router.post("/accounts/add_account_company_type", verifyToken, validation.accountCompanyTypeValidation,
    accountCompanyTypeController.addAccountCompanyType);
router.put("/accounts/edit_account_company_type/:id", verifyToken, validation.accountCompanyTypeValidation,
    accountCompanyTypeController.editAccountCompanyType);
router.get("/accounts/get_all_account_company_type", verifyToken, accountCompanyTypeController.getAllAccountCompanyType);
router.get("/accounts/get_single_account_company_type/:id", verifyToken, accountCompanyTypeController.getSingleAccountCompanyType);
router.delete("/accounts/delete_account_company_type/:id", verifyToken, accountCompanyTypeController.deleteAccountCompanyType);

/**
 * account document master routes
 */
router.post("/accounts/add_document_master", verifyToken, validation.accountDocumentMasterValidation,
    accountDocumentMaster.addDocumentMaster);
router.put("/accounts/update_document_master/:id", verifyToken, validation.accountDocumentMasterValidation,
    accountDocumentMaster.updateDocumentMaster);
router.get("/accounts/get_document_master/:id", verifyToken, accountDocumentMaster.getDocumentMasterDetails);
router.get("/accounts/get_document_master_list", verifyToken, accountDocumentMaster.getDocumentMasterList);
router.delete("/accounts/delete_document_master/:id", verifyToken, accountDocumentMaster.deleteDocumentMaster);

/**
 * account document overview routes
 */
router.post("/accounts/add_document_overview", verifyToken, validation.accountDocumentOverviewValidation,
    accountDocumentOverview.addDocumentOverview);
router.put("/accounts/update_document_overview", verifyToken, validation.accountDocumentOverviewValidation,
    accountDocumentOverview.updateDocumentOverview);
router.get("/accounts/get_document_overview/:id", verifyToken, accountDocumentOverview.getDocumentOverviewDetails);
router.get("/accounts/get_document_overview_list", verifyToken, accountDocumentOverview.getDocumentOverviewList);
router.delete("/accounts/delete_document_overview_list/:id", verifyToken, accountDocumentOverview.deleteDocumentOverview);

/**
 * account Department routes
 */
router.post("/accounts/department", verifyToken, accountDepartmentController.createDepartmentDetails);
router.put("/accounts/department/:id", verifyToken, accountDepartmentController.updateDepartmentDetails);
router.get("/accounts/department/:id", verifyToken, accountDepartmentController.getDepartmentDetails);
router.get("/accounts/department", verifyToken, accountDepartmentController.getDepartmentList);
router.delete("/accounts/department/:id", verifyToken, accountDepartmentController.deleteDepartment);

/**
 * account brand category routes
 */
router.post("/accounts/brand_category", verifyToken, brandCategoryController.createBrandCategory);
router.put("/accounts/brand_category/:id", verifyToken, brandCategoryController.updateBrandCategory);
router.get("/accounts/brand_category/:id", verifyToken, brandCategoryController.getBrandCategoryDetails);
router.get("/accounts/brand_category", verifyToken, brandCategoryController.getBrandCategoryList);
router.delete("/accounts/brand_category/:id", verifyToken, brandCategoryController.deleteBrandCategory);

/**
 * account brand routes
 */
router.post("/accounts/brand", verifyToken, brandController.createBrandDetails);
router.put("/accounts/brand/:id", verifyToken, brandController.updateBrandDeatil);
router.get("/accounts/brand/:id", verifyToken, brandController.getBrandDetail);
router.get("/accounts/brand", verifyToken, brandController.getBrandList);
router.delete("/accounts/brand/:id", verifyToken, brandController.deleteBrandDetails);

module.exports = router; 