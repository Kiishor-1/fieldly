const Field = require("../models/Field");

// Get all fields
const getAllFields = async (req, res) => {
  try {
    const fields = await Field.find();
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

// Get a single field by ID
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

// Create a new field
const createField = async (req, res) => {
  try {
    const { name, cropType, areaSize, location } = req.body;

    // Validate location format
    if (!Array.isArray(location) || location.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Location must be an array with two elements [longitude, latitude].",
      });
    }

    const field = await Field.create({ name, cropType, areaSize, location });
    res.status(201).json({
      success: true,
      message: "Field created successfully",
      data: field,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: "Error creating field",
      error: err.message,
    });
  }
};

// Update a field
const updateField = async (req, res) => {
  try {
    const { location } = req.body;

    // Validate location format if provided
    if (location && (!Array.isArray(location) || location.length !== 2)) {
      return res.status(400).json({
        success: false,
        message: "Location must be an array with two elements [longitude, latitude].",
      });
    }

    const field = await Field.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensures the updated data complies with the schema
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

// Delete a field
const deleteField = async (req, res) => {
  try {
    const field = await Field.findByIdAndDelete(req.params.id);
    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }
    res.json({
      success: true,
      message: "Field deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting field",
      error: err.message,
    });
  }
};

module.exports = {
  getAllFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
};
