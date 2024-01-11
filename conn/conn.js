const mongoose = require("mongoose");

const conn = async (req, res) => {
  try {
    await mongoose
      .connect("mongodb+srv://arvindgta:agta1234@cluster0.ngyriot.mongodb.net/")
      .then(() => console.log("DB connection successfull!"));
  } catch (error) {
    console.log("error", error)
  }
};

conn();
