const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Field name is required"],
      trim: true,
    },
    cropType: {
      type: String,
      required: [true, "Crop type is required"],
      trim: true,
    },
    areaSize: {
      type: Number,
      required: [true, "Area size is required"],
      min: [0, "Area size must be greater than or equal to 0"],
    },
    location: {
      type: [Number], // Array of numbers: [longitude, latitude]
      required: [true, "Location is required"],
      validate: {
        validator: function (value) {
          return value.length === 2 && 
                 value.every((num) => typeof num === "number");
        },
        message: "Location must be an array of two numbers: [longitude, latitude]",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Field", FieldSchema);

