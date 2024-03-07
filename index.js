const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

mongoose.set('strictQuery', false);

// Connect to MongoDB database using Mongoose
mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Conneted to MongoDB");
});

//middleware
app.use(express.json())
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// app.get("/", (req, res) => {
//     res.send("welcome to homepage")
// })

// app.get("/users", (req, res) => {
//     res.send("welcome to homepage users")
// })

app.listen(8800, () => {
    console.log("Back-end server is running very well");
}) 