const User = require("../models/user");
const List = require("../models/list");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }
  let token = bearerHeader.split(" ")[1]; // Bearer <token>
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    } else {
      next();
    }
  });
}

//create
router.post("/todo", async (req, res) => {
  try {
    const { title, body, id, status } = req.body;
    const foundUser = await User.findById({ _id: id });
    if (!foundUser) {
      return res
        .status(401)
        .json({ msg: "No user with that email was found." });
    }
    const newTodo = new List({
      title,
      body,
      status,
      user: foundUser._id,
    });
    await newTodo.save(); //saving todo in list
    foundUser.list.push(newTodo._id);
    await foundUser.save(); // saving users with added todoID
    res.status(200).json(newTodo); // Respond with the created todo
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Something went wrong" });
  }
});

//read
router.get("/todos/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const foundUser = await User.findById({ _id: id }).populate({
    path: "list",
    sort: { date: -1 },
  });
  if (!foundUser) {
    return res.status(200).json({ msg: "User not found!" });
  }
  res.status(200).json(foundUser.list);
});

//update
router.put("/todo", (req, res) => {
  const { id, title, body, status } = req.body;
  List.findByIdAndUpdate(id, { title, body, status })
    .then(() => res.send("updated"))
    .catch((e) => console.log(e));
});

router.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task by its ID
    const list = await List.findOne({ _id: id });
    if (!list) {
      return res.status(400).json({ msg: "Task not found in the database." });
    }

    // Find the user associated with the task
    const user = await User.findOne({ _id: list.user });
    if (!user) {
      return res.status(400).json({ msg: "User not found in the database." });
    }

    // Remove the task ID from the user's list array
    user.list = user.list.filter((taskId) => !taskId.equals(id));
    await user.save();

    // Delete the task
    await List.deleteOne({ _id: id });

    res.status(200).json({ msg: "Task has been deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
