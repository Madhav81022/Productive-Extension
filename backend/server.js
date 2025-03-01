require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema for user productivity data
const siteSchema = new mongoose.Schema({
  site: String,
  timeSpent: Number,
});

const SiteData = mongoose.model("SiteData", siteSchema);

// API to store time spent on websites
app.post("/track", async (req, res) => {
  const { site, timeSpent } = req.body;
  await SiteData.findOneAndUpdate(
    { site },
    { $inc: { timeSpent } },
    { upsert: true }
  );
  res.send({ message: "Data saved!" });
});

// API to get productivity reports
app.get("/report", async (req, res) => {
  const data = await SiteData.find();
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));