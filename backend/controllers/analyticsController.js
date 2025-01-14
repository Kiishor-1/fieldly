const Field = require('../models/Field')


const userFieldsAnalysis = async (req, res) => {
    try {
        Field.countDocuments().then(function (totalFields) {

            Field.aggregate([
                { $unwind: "$cropType" },
                { $group: { _id: "$cropType", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]).then(function (cropTypes) {
                var cropTypesCount = cropTypes.reduce(function (acc, crop) {
                    acc[crop._id] = crop.count;
                    return acc;
                }, {});

                Field.aggregate([
                    { $group: { _id: "$areaSize", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ]).then(function (areaSizeData) {
                    var areaSizeDataMapped = areaSizeData.reduce(function (acc, area) {
                        acc[area._id] = area.count;
                        return acc;
                    }, {});

                    res.status(200).json({
                        totalFields: totalFields,
                        cropTypesCount: cropTypesCount || {},
                        areaSizeData: areaSizeDataMapped || {},
                        message: 'Fetched analysis successfully',
                        success: true,
                    });
                }).catch(function (error) {
                    console.error("Error in area size aggregation:", error);
                    res.status(500).json({ message: "Error in area size aggregation", success: false });
                });

            }).catch(function (error) {
                console.error("Error in crop types aggregation:", error);
                res.status(500).json({ message: "Error in crop types aggregation", success: false });
            });

        }).catch(function (error) {
            console.error("Error in counting fields:", error);
            res.status(500).json({ message: "Error fetching total fields", success: false });
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "Unexpected error occurred", success: false });
    }
}


const generateAnalysis = async (req, res) => {
    try {
        const { id } = req.params;
        const field = await Field.findById(id);

        if (!field) {
            return res.status(404).json({
                success: false,
                message: "Field not found",
            });
        }

        const { totalCost, averageGrowth, marketTrends, totalStock } = field.analytics;

        const response = `
        Analysis for the (${field.name}):
        - Total Cost: $${totalCost.toFixed(2)}
        - Average Growth Rate: ${averageGrowth}
        - Market Trends: ${marketTrends}
        - Total Stock: ${totalStock} units
        
        Recommendations:
        - Consider reducing costs by optimizing resource allocation and using cost-effective farming techniques.
        - Focus on improving growth rate by utilizing modern agricultural methods.
        - Leverage positive market trends to enhance profitability.
        - Ensure efficient stock management to minimize waste.`;

        res.status(200).json({
            success: true,
            message: "Analysis generated successfully",
            generatedText: response,
        });
    } catch (err) {
        console.error("Error generating analysis:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


const adminAnalyltics = async (req, res) => {
    try {
        const fields = await Field.find();
        const totalLand = fields.reduce((sum, field) => sum + field.areaSize, 0);
        const cropTypesCount = {};
        fields.forEach((field) => {
            field.cropType.forEach((crop) => {
                cropTypesCount[crop] = (cropTypesCount[crop] || 0) + 1;
            });
        });

        const cropTypes = Object.entries(cropTypesCount).map(([type, count]) => ({
            type,
            count,
        }));
        const yieldData = fields
            .flatMap((field) => field.harvestData)
            .reduce((acc, curr) => {
                const existing = acc.find((data) => data.month === curr.month);
                if (existing) {
                    existing.yield += curr.yield;
                } else {
                    acc.push({ month: curr.month, yield: curr.yield });
                }
                return acc;
            }, []);

        // Calculate market trends (Positive vs Negative)
        const trendCount = fields.reduce(
            (acc, field) => {
                if (field.analytics.marketTrends === "Negative") {
                    acc.negative++;
                } else {
                    acc.positive++;
                }
                return acc;
            },
            { positive: 0, negative: 0 }
        );

        const marketTrends = trendCount.negative > trendCount.positive ? "Negative" : "Positive";

        // Respond with analytics data
        res.json({
            totalLand,
            cropTypes,
            yieldData,
            marketTrends, // dynamic market trend calculation
            fields: fields.map((field) => ({
                location: field.location,
                name: field.name,
            })),
        });
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        res.status(500).json({ message: "Failed to fetch analytics data" });
    }
};




module.exports = {
    userFieldsAnalysis,
    generateAnalysis,
    adminAnalyltics
}