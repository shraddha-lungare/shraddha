// server.js
const cors=require("cors");
const path=require("path");
const express = require("express");
const mongoose=require("mongoose");
const app = express();
const uploadRoute=require("./Route/upload");
const PORT = 5000;
// Middleware to parse JSON
app.use(express.json());
// MongoDB connection
const MongoURL = "mongodb+srv://Shraddha:Shraddha123@cluster0.gyfsrut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MongoURL)
  .then(() => console.log(" MongoDB connected"))
  .catch(() => console.log(" MongoDB connection failed"));

const useroutes=require("./Route/useroutes");
app.use("/api",useroutes);

app.use("/uploads",express.static("uploads"));
app.use("/api/uploads",uploadRoute);
app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
  res.send("Api is working fine");
});
app.get("/test", (req, res) => {
  res.send("Server is working!");
});


// Start the server
app.listen(PORT, () => {
  console.log("hello Server running on http://localhost:${PORT}");
});