const express = require("express");
const router = express.Router();
// importo i mid di validazione
const authController = require("../controllers/authController");
const validator = require("../middlewares/validator");
const {registerChecker,loginChecker} = require("../validations/auths");
const tokenAuthenticator = require("../middlewares/tokenAuthenticator");

// imposto le routes


// per la registrazione
router.post("/register", validator(registerChecker), authController.register);

// per il login
router.post("/login", tokenAuthenticator, validator(loginChecker), authController.login);


module.exports = router;