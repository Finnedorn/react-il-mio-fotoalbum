const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const validator = require("../middlewares/validator");
const { idChecker, nameChecker } = require("../validations/categories");

router.post("/", validator(nameChecker), categoryController.store);

router.get("/", categoryController.index);

router.get("/:id", validator(idChecker), categoryController.show);

router.put(
  "/:id",
  validator(idChecker),
  validator(nameChecker),
  categoryController.update
);

router.delete("/:id", validator(idChecker), categoryController.destroy);

module.exports = router;