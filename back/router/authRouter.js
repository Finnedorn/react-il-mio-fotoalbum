// inizializzo express
const express = require("express");
// uso il metodo router di express per creare un nuovo oggetto router
const router = express.Router();
// importo i mid di validazione
const authController = require("../controllers/authController");
const validator = require("../middlewares/validator");
const {registerChecker,loginChecker} = require("../validations/auths");

// imposto le routes

// per la registrazione
router.post("/register", validator(registerChecker), authController.register);

// per il login
router.post("/login", validator(loginChecker), authController.login);


// esporto il modulo per poterlo importare in app
module.exports = router;