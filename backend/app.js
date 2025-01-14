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
const subscriptionRoutes = require('./routes/subscriptionRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')

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
    res.status(200).json({
        root:"Standard root",
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/fields", fieldRoute);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

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
