const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register

router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

    try {
        //Generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email
        })

        //Save user and send response
        const user = await newUser.save();
        res.status(200).json(user._id);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Login

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        //Find user 
        const user = await User.findOne({username});
        
        !user && res.status(400).json("Wrong username or password!");

        //Validate password
        const validPassword = await bcrypt.compare(password, user.password)

        !validPassword && res.status(400).json("Wrong username or password!");

        //Send response
        res.status(200).json({_id: user._id, username: user.username});
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;