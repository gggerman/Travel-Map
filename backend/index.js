const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const pinRoute = require("./src/routes/pins");
const userRoute = require("./src/routes/users");

dotenv.config();

app.use(express.json())

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.SERVER);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MongoDB connected!");
    });

app.use("/pins", pinRoute);
app.use("/users", userRoute);

app.listen(process.env.PORT || 3001,'0.0.0.0', () => {
    console.log("Backend server is running!");
})