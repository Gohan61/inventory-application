#! /usr/bin/env node

console.log(
  'This script populates some test categories and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the Mechanical genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const categorydetail = { name: name, description: description };

  const category = new Category(categorydetail);

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  numberInStock
) {
  const itemdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    numberInStock: numberInStock,
  };

  const item = new Item(itemdetail);

  await item.save();
  items[index] = item;
  console.log(`Added item: ${item}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Mechanical keyboards",
      "Keyboards with mechanical switches which result in a superior typing experience"
    ),
    categoryCreate(
      1,
      "Membrane keyboards",
      "Keyboards with a membrane below the keys which lead to a mushy experience"
    ),
    categoryCreate(
      2,
      "Scissor keyboards",
      "Keyboards with a scissor like mechanism under the keys pressing a rubber dome with a mediocre experience but slim profile"
    ),
  ]);
}

async function createItems() {
  console.log("Adding item");
  await Promise.all([
    itemCreate(
      0,
      "Chronokey - brown",
      "Tactile keys that have a satisfying bump when typing, suitable for gaming + office",
      categories[0],
      132.0,
      3
    ),
    itemCreate(
      1,
      "Chronokey - blue",
      "Clicky keys that make a click sound and are very loud, suitable for home use",
      categories[0],
      155.0,
      6
    ),
    itemCreate(
      2,
      "Chronokey - mushy",
      "Membrane keyboard for a cost effective entry level option",
      categories[1],
      20.0,
      13
    ),
    itemCreate(
      3,
      "Chronokey - scissor",
      "Minimalist ultra-slim keyboard for typing and looks",
      categories[2],
      80.0,
      5
    ),
  ]);
}
