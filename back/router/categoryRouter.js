const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const validator = require("../middlewares/validator");
const { idChecker, nameChecker } = require("../validations/categories");

router.post("/", validator(nameChecker), tagController.store);

router.get("/", tagController.index);

router.get("/:id", validator(idChecker), tagController.show);

router.put(
  "/:id",
  validator(idChecker),
  validator(nameChecker),
  tagController.update
);

router.delete("/:id", validator(idChecker), tagController.destroy);

module.exports = router;