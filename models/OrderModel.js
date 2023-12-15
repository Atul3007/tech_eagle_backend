const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  products: [],
  buyer: { type: mongoose.ObjectId, ref: "tech_users" },
  status:{
    type:String,
    default:"Not Process",
    enum:["Not Process","Processing","Shipped","Not Delivered","Delivered","Cancelled"]
  }
},{timestamps:true});

const orderModel = mongoose.model("orders_tech", orderSchema);

module.exports = {
  orderModel,
};
