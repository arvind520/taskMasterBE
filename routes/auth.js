const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// email pass
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
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
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(200)
        .json({ message: "Please enter correct password!" });
    }
    const { password, ...others } = user._doc;
    console.log(process.env.JWT_SECRET)
    jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, user: user._id, message: "Login successfull!", expiresTime: 120*60000 }); //120min
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({
          message: "No account with this email address exists.",
          found: false,
        });
    }
    res.status(200).send({ email, found: true });
  } catch (error) {
    console.log("Forget password failed");
  }
});

router.put("/resetpassword", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({
          message: "No account with this email address exists.",
          found: false,
        });
    }
    user.password = bcrypt.hashSync(password, 10);
    await user.save();
    res
      .status(200)
      .send({ message: "User Password has been reset.", success: true });
  } catch (error) {
    return res
      .status(200)
      .send({ message: "Password Reset Failed", success: false });
  }
});

module.exports = router;
