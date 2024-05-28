const mongoose = require("mongoose");
const category = require("./category");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  description: { type: String, required: true, minLength: 10, maxLength: 1000 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Schema.Types.Decimal128, required: true },
  numberInStock: { type: Number, required: true },
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
