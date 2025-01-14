const express = require("express");
const { getUserOwnedFields, createField, getFieldById, updateField, deleteField, addFieldData } = require("../controllers/fieldController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/",authMiddleware, getUserOwnedFields);
router.get("/:id",authMiddleware, getFieldById);
router.post("/", authMiddleware,createField);
router.put("/:id", authMiddleware,updateField);
router.delete("/:id",authMiddleware, deleteField);
router.post("/add-field-data/:id",authMiddleware, addFieldData);

module.exports = router;