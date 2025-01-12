const express = require("express");
const { getAllFields, createField,getFieldById, updateField , deleteField} = require("../controllers/fieldController");

const router = express.Router();

router.get("/", getAllFields);
router.get("/:id", getFieldById);
const mid = (req,res, next)=>{
    console.log(req.body);
    next();
}
router.post("/", createField);
router.put("/:id", updateField);
router.delete("/:id", deleteField);

module.exports = router;
