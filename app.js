const express = require("express");
var methodOverride = require("method-override");
const mongoose = require("mongoose");
const CampGround = require("./models/cmapGround");
const path = require("path");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true, //no longer supported base stack overflow
  useUnifiedTopology: true, //no longer supported base stack overflow
  family: 4,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connecting error"));
db.once("open", () => {
  console.log("database Connected");
});

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //parser methode is importend or you will be creazy
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("Home");
});

app.get("/camp-ground", async (req, res) => {
  const campGrounds = await CampGround.find({});
  res.render("CampGround/index", { campGrounds });
});
app.post("/camp-ground", async (req, res) => {
  const reciveCampGround = req.body.campGround; // it's array we make to save input from form
  const newCampGround = new CampGround(reciveCampGround);
  newCampGround.save();
  res.send(newCampGround);
});
app.get("/camp-ground/new", async (req, res) => {
  const campGrounds = await CampGround.find({});
  res.render("CampGround/new", { campGrounds });
});
app.get("/camp-ground/:id", async (req, res) => {
  const campGroundDetail = await CampGround.findById(req.params.id);
  res.render("CampGround/show", { campGroundDetail });
});
app.put("/camp-ground/:id", async (req, res) => {
  const { id } = req.params;
  const reciveCampGround = req.body.campGround;
  const campGroundDetail = await CampGround.findByIdAndUpdate(id, {
    ...reciveCampGround,
  });
  res.redirect(`${campGroundDetail._id}`);
});
app.delete("/camp-ground/:id", async (req, res) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  res.redirect("/camp-ground");
});
app.get("/camp-ground/:id/edit", async (req, res) => {
  const campGroundDetail = await CampGround.findById(req.params.id);
  res.render("CampGround/edit", { campGroundDetail });
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
