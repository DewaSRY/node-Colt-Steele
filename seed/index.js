const mongoose = require("mongoose");
const campGround = require("../models/campground");
const cities = require("./seed");
const { places, descriptors } = require("./seedHelpers");

main()
  .then(() =>
    console.log("MOngoose  was delete and working_______________________")
  )
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelpCamp", {
    family: 4,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await campGround.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random100 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campGround({
      author: "63a13df29691462037778162",
      location: `${cities[random100].city},${cities[random100].state}`,
      title: `${sample(descriptors)},${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price: price,
    });

    await camp.save();
  }
};
seedDB().then((data) => console.log("i wass save everythings"));
