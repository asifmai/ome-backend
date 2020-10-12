const express = require("express");
const passport = require("passport");
const router = express.Router();

const authController = require("../controllers/authController");
const meController = require("../controllers/meController");
const groupsController = require("../controllers/groupsController.js");
const plaidController = require("../controllers/plaidController.js");
const reimbursementController = require("../controllers/reimbController.js");
const transactionController = require("../controllers/transactionController.js");
const notificationController = require("../controllers/notificationController");
const passportService = require("../config/passport");

const login = passport.authenticate("local", { session: false });
const apiAuth = passport.authenticate("jwt", { session: false });

// Auth Routes
router.post("/auth/register-phone", authController.register_phone);
router.post("/auth/verify-phone", authController.verify_phone);
router.post("/auth/resend-code", authController.resend_code);
router.post("/auth/register", authController.register);
router.post("/auth/check-email", authController.check_email_post);
router.post("/auth/login", login, authController.login);

// Main Routes
router.get("/me", apiAuth, meController.me_get);
router.post(
  "/me/update-passenabled",
  apiAuth,
  meController.update_passenabled_post
);
router.post("/me/updatename", apiAuth, meController.updatename_post);
router.post("/me/updateimage", apiAuth, meController.updateimage_post);
router.get("/me/deleteuser", apiAuth, meController.deleteuser_get);
router.post("/me/updatepassword", apiAuth, meController.updatepassword_post);

// Group Routes
router.get("/groups", apiAuth, groupsController.groups_get);
router.post(
  "/groups/create-group",
  apiAuth,
  groupsController.create_group_post
);
router.get(
  "/groups/delete-group/:groupid",
  apiAuth,
  groupsController.delete_group_get
);
router.post(
  "/groups/update-group",
  apiAuth,
  groupsController.update_group_post
);
router.post(
  "/groups/add-transaction",
  apiAuth,
  groupsController.add_transaction_post
);

// Plaid Routes
router.get(
  "/plaid/create-link-token",
  apiAuth,
  plaidController.create_link_token_get
);
router.post(
  "/plaid/add-checking-account",
  apiAuth,
  plaidController.add_checking_account_post
);

// Transaction Routes
router.get("/transactions", apiAuth, transactionController.transactions_get);
router.post(
  "/transactions/add",
  apiAuth,
  transactionController.addtransaction_get
);

// Reimbursement Routes
router.get(
  "/reimbursement",
  apiAuth,
  reimbursementController.reimbursement_get
);
router.post(
  "/reimbursement/add",
  apiAuth,
  reimbursementController.addreimb_post
);
router.post(
  "/reimbursement/updatecompleted",
  apiAuth,
  reimbursementController.updatecompleted_post
);

// Notifications Routes
router.get("/notifications", apiAuth, notificationController.notifications_get);
router.post(
  "/notifications/save",
  apiAuth,
  notificationController.notifications_post
);

module.exports = router;
