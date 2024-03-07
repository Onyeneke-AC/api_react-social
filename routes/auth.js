const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {

    try{
        // Generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const  newUser = new User({

            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,

        });

        // Save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err);
    } 

});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        // check if email is available
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json("user not found");

        // check if password is correct
        const isValid = await bcrypt.compare(req.body.password, user.password);
        !isValid && res.status(400).json("wrong password");

        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;