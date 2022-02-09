const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("./src/routes/pins");
const userRoute = require("./src/routes/users");

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
app.use("/users", userRoute);

app.listen(process.env.PORT || 3001, () => {
    console.log("Backend server is running!");
})