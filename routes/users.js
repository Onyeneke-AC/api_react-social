const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.send("hey it's users route");
})

// update user

router.put("/:id", async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account has been updated");
        } catch(err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can update only your account");
    }

})

// delete user

router.delete("/:id", async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch(err) {
            return res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can delete only your account");
    }

})

// get a user

router.get("/:id", async (req, res) => {
    try {
        // find the user
        const user = await User.findById(req.params.id);
        // leave out the properties not needed
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other)
    } catch(err) {
        res.status(500).json(err);
    }
});

// follow a user

router.put("/:id/follow", async (req, res) => {
    //check if users are the same
    if (req.body.userId !== req.params.id){
        try {
            //found this user which has the id above
            const user = await User.findById(req.params.id);
            //also found the one trying to make request
            const currentUser = await User.findById(req.body.userId);

            // check if current user  is already following that user
            if(!user.followers.includes(req.body.userId)){
                //if they're not, add them to the array of followers and save it in the database
                await user.updateOne({$push: {followers: req.body.userId}});
                //also add to the array of followings and save to the database
                await currentUser.updateOne({$push: {followings: req.params.id}});
                res.status(200).json("User has been followed");
            }else {
                res.status(409).json("You already follow this user");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot follow yourself");
    }
})

// unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    //check if users are the same
    if (req.body.userId !== req.params.id){
        try {
            //found this user which has the id above
            const user = await User.findById(req.params.id);
            //also found the one trying to make request
            const currentUser = await User.findById(req.body.userId);

            // check if current user is already following that user
            if(user.followers.includes(req.body.userId)){
                // if they are, use the pull method to pull them from the array of followers 
                await user.updateOne({$pull: {followers: req.body.userId}});
                // if they are, use the pull method to pull them from the array of followers
                await currentUser.updateOne({$pull: {followings: req.params.id}});
                res.status(200).json("User has been unfollowed");
            }else {
                res.status(409).json("You are not currently following this user");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot unfollow yourself");
    }
})

module.exports = router;