const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const CampGround = require("../models/cmapGround");

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
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const sedDb = async () => {
  await CampGround.deleteMany({}); //its danger dode
  for (let i = 0; i <= 50; i++) {
    const random100 = Math.floor(Math.random() * 100);
    const camp = new CampGround({
      location: `${cities[random100].city},${cities[random100].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};
sedDb()
  .then(() => console.log("inser data done"))
  .then(() => mongoose.connection.close());
