const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Faq Schema
const faqSchema = new Schema({
  faq: {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  category: {
    type: String,
    required: true,
  },
  pinned: {
    type: Boolean,
    required: true,
    // this is possible enum: ['test','wwaiter']
  },
});

const Faq = mongoose.model("Faq", faqSchema);
module.exports = Faq;
