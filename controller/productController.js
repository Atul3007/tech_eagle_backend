const { productModel } = require("../models/productModel");
const { orderModel } = require("../models/OrderModel");
const fs = require("fs");


const createProduct = async (req, res) => {
  try {
    const { name, description, price, weight, shipping, quantity } =
      req.fields;
    const { photo } = req.files;
    // console.log(req.files,req.fields)
    if (
      !name ||
      !description ||
      !price ||
      !weight ||
      !quantity ||
      !photo ||
      photo.size > 1000000
    ) {
      return res.status(400).send({
        message: "all fields required and pic size should be less than 1mb",
      });
    }
    const product = new productModel({ ...req.fields });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error in creating product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const { name ,description, price, category, shipping, quantity } =
      req.fields;
    const { photo } = req.files;
    console.log(id, name, photo);
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !shipping ||
      !quantity ||
      !photo ||
      photo.size > 1000000
    ) {
      return res.status(400).send({
        message: "all fields required and pic size should be less than 1mb",
      });
    }
    const product = await productModel.findByIdAndUpdate(id, {
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error in updating product",
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .limit(10)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: product,
      total_count: product.length,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error in getting product",
    });
  }
};

const getProductPhoto = async (req, res) => {
  try {
    const id = req.params.pid;
    const ProductPhoto = await productModel.findById(id).select("photo");
    // console.log(ProductPhoto.photo.data)
    if (ProductPhoto.photo.data) {
      res.set("Content-type", ProductPhoto.photo.contentType);
      return res.status(200).send(ProductPhoto.photo.data);
    } else {
      console.log("error");
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error in getting product photo",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const deleteProduct = await productModel
      .findByIdAndDelete(id)
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error in deleting product",
    });
  }
};


const order = async (req, res) => {
  const { id } = req.params;
  // console.log(id)
  try {
    const orders = await orderModel
      .find({ buyer: id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.status(200).send({
      success: true,
      orders,
    });
    //console.log(orders)
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error in getting order",
    });
  }
};

const allOrder = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createAt: "-1" });

      res.status(200).send({
        success: true,
        orders
      });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error in getting all order",
    });
  }
};

const updateStatus=async(req,res)=>{
  try {
    const {status}=req.body;
    const {orderId}=req.params;
    console.log({status,orderId})
    const order = await orderModel.findByIdAndUpdate({_id:orderId},{status},{new:true});
    res.status(200).send({
        success: true,
        message:"Status updated successfully"  
      });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error in updating order",
    });
  }}


module.exports = {
  updateStatus,
  allOrder,
  order,
  createProduct,
  updateProduct,
  getProduct,
  getProductPhoto,
  deleteProduct,
};
