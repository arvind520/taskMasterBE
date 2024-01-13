const mongoose = require("mongoose");

const conn = async (req, res) => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log("DB connection successfull!"));
  } catch (error) {
    console.log("error", error)
  }
};

conn();
