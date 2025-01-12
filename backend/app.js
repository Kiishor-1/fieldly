if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const port = process.env.PORT || 8080;

const authRoutes = require('./routes/authRoutes');
const fieldRoute = require('./routes/fieldRoutes')

const FRONT_ENDS = process.env.FRONT_ENDS.split(',');

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || FRONT_ENDS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Standard root");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/fields", fieldRoute);
app.post("/api/v1/generate-analysis", (req, res) => {
    try {
        const { cost, stock, growth, analytics } = req.body;

        // Simulating AI response based on input variables
        const response = `
        Based on the given data: 
        - Cost is ${cost}.
        - Stock availability is ${stock}.
        - Growth rate is ${growth}.
        - Analytics indicate ${analytics}.
        
        Recommendations:
        - Optimize the cost by focusing on high-yield crops.
        - Manage stock levels to reduce waste.
        - Monitor growth with advanced irrigation methods.
        - Leverage analytics to predict future trends.`;

        // Send the generated response
        res.status(200).json({
            success: true,
            message: 'Analysis done',
            generatedText: response
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

app.all("*", (req, res, next) => {
    const error = new Error("No such routes available");
    error.statusCode = 404;
    next(error);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
});

app.listen(port, () => {
    console.log(`Server is up at port ${port}`);
    connectDB()
        .then(() => {
            console.log('Connected to Database');
        })
        .catch((error) => {
            console.error('Database connection failed:', error);
        });
});
