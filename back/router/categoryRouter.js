// inizializzo express
const express = require("express");
// uso il metodo router di express per creare un nuovo oggetto router
const router = express.Router();
// importo il controller con le funzioni di CRUD
const categoryController = require("../controllers/categoryController");
// importo i mid di validazzione
const validator = require("../middlewares/validator");
const { idChecker, nameChecker } = require("../validations/categories");

// imposto le routes


// route di index
router.get("/", categoryController.index);

// route di show
router.get("/:id", validator(idChecker), categoryController.show);

// la route di creazione di una categoria 
router.post("/", validator(nameChecker), categoryController.store);

// la route di update per la singola categoria
router.put(
  "/:id",
  validator(idChecker),
  validator(nameChecker),
  categoryController.update
);

// la route di delete di una categoria
router.delete("/:id", validator(idChecker), categoryController.destroy);


// esporto il modulo per poterlo importare in app
module.exports = router;