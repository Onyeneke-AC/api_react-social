const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("hey it's users route");
})

// update user

// delete user

// get a user

// follow a user

// unfollow a user

module.exports = router;