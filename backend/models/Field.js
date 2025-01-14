const mongoose = require("mongoose");

const HarvestDataSchema = new mongoose.Schema({
  month: { type: String, required: true },
  yield: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
});

const MonitoringDataSchema = new mongoose.Schema({
  date: { type: String, required: true },
  status: { type: String, required: true },
  growth: { type: String, required: true },
});

const FieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Field name is required"],
      trim: true,
    },
    cropType: {
      type: [String],
      required: [true, "Crop type is required"],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Crop type must be a non-empty array.",
      },
    },
    areaSize: {
      type: Number,
      required: [true, "Area size is required"],
      min: [0, "Area size must be greater than or equal to 0"],
    },
    location: {
      type: [Number],
      required: [true, "Location is required"],
      validate: {
        validator: function (value) {
          return value.length === 2 && value.every((num) => typeof num === "number");
        },
        message: "Location must be an array of two numbers: [longitude, latitude]",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    monitoringData: { type: [MonitoringDataSchema], default: [] },
    harvestData: { type: [HarvestDataSchema], default: [] },
    analytics: {
      type: {
        totalCost: { type: Number, default: 0 },
        averageGrowth: { type: String, default: "0" },
        marketTrends: { type: String, default: "Negative" },
        totalStock: { type: Number, default: 0 },
      },
      default: {
        totalCost: 0,
        averageGrowth: "0",
        marketTrends: "Negative",
        totalStock: 0,
      },
    },    
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Field", FieldSchema);
