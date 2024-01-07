const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");
// email pass
// email pass 
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    console.log(existingUser)
    if (existingUser) {
      return res.status(201).json({ message: "User Already Exists!" });
    }
    // If the email doesn't exist, proceed to create a new user
    const hash = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();
    res.status(201).json({ message: "User Register Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ message: "User not found!" });
    }
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(200).json({ message: "Please enter correct password!" });
    }
    const { password, ...others } = user._doc;
    return res.status(200).json({ user: user._id, message: "Login successfull!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
