const express = require('express');
const cors = require('cors');
// const path = require('path')
const auth = require('./routes/auth');
const list = require('./routes/list');
const app = express();

//DB connection
require("./conn/conn");

app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => {
//     app.use(express.static(path.resolve(__dirname, "frontend", "build")));
//     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
// })
app.use("/api/v1", auth)
app.use("/api/v2", list)


app.listen(1000, () => {
    console.log("Server is started!")
})