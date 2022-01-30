const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("./src/routes/pins");

dotenv.config();

app.use(express.json())

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MongoDB connected!");
    });

app.use("/pins", pinRoute);

app.listen(3001, () => {
    console.log("Backend server is running!");
})