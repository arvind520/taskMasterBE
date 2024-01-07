const mongoose = require("mongoose");

const conn = async (req, res) => {
  try {
    await mongoose
      .connect("db url")
      .then(() => console.log("DB connection successfull!"));
  } catch (error) {
    console.log("error", error)
  }
};

conn();
