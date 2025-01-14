const express = require("express");
const { getUserOwnedFields, createField, getFieldById, updateField, deleteField, addFieldData } = require("../controllers/fieldController");
const authMiddleware = require("../middlewares/authMiddleware");
const { isUser } = require("../middlewares/isUser");

const router = express.Router();

router.get("/", authMiddleware, isUser, getUserOwnedFields);
router.get("/:id", authMiddleware, isUser, getFieldById);
router.post("/", authMiddleware, isUser, createField);
router.put("/:id", authMiddleware, isUser, updateField);
router.delete("/:id", authMiddleware, isUser, deleteField);
router.post("/add-field-data/:id", authMiddleware, isUser, addFieldData);

module.exports = router;