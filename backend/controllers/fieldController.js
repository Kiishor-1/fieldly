const Field = require("../models/Field");
const User = require('../models/User')

const getUserOwnedFields = async (req, res) => {
  try {
    const fields = await Field.find({ owner: req.user.id }).populate("owner", "name email");

    res.json({
      success: true,
      message: "Fields fetched successfully",
      data: fields,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching fields",
      error: err.message,
    });
  }
};


const getFieldById = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }
    res.json({
      success: true,
      message: "Field fetched successfully",
      data: field,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching field",
      error: err.message,
    });
  }
};

const createField = async (req, res) => {
  try {
    const { name, cropType, areaSize, location } = req.body;

    if (!Array.isArray(location) || location.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Location must be an array with two elements [longitude, latitude].",
      });
    }

    const field = await Field.create({
      name,
      cropType,
      areaSize,
      location,
      owner: req.user.id, 
    });

    const user = await User.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.fields.push(field._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Field created successfully",
      data: field,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error creating field",
      error: err.message,
    });
  }
};

const updateField = async (req, res) => {
  try {
    const { location } = req.body;

    console.log(req.body)

    if (location && (!Array.isArray(location) || location.length !== 2)) {
      return res.status(400).json({
        success: false,
        message: "Location must be an array with two elements [longitude, latitude].",
      });
    }

    const field = await Field.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }
    res.json({
      success: true,
      message: "Field updated successfully",
      data: field,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating field",
      error: err.message,
    });
  }
};

const deleteField = async (req, res) => {
  console.log('id toh hai kya',req.params.id)
  try {
    const field = await Field.findById(req.params.id);
    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    if (field.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this field.",
      });
    }

    await Field.findByIdAndDelete(req.params.id)

    const user = await User.findById(req.user.id);
    if (user) {
      user.fields = user.fields.filter(
        (fieldId) => fieldId.toString() !== field._id.toString()
      );
      await user.save();
    }

    res.json({
      success: true,
      message: "Field deleted successfully",
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: "Error deleting field",
      error: err.message,
    });
  }
};

module.exports = {
  getUserOwnedFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
};
