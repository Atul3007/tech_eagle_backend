const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  weight:{
    type:Number,
    required:true
  },
  photo:{ 
    data:Buffer
  },
  shipping:{
    type:Boolean
  }
},{timestamps:true});

const productModel = mongoose.model("tech_products", productSchema);

module.exports = {
  productModel,
};
