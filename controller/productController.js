const { productModel } = require("../models/productModel");
const { orderModel } = require("../models/OrderModel");
const fs = require("fs");


const createProduct = async (req, res) => {
  try {
    const { name, description, price, weight, quantity } =
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

const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await productModel
      .findById(id)
      .select("-photo");
    if (!product) {
      res.status(401).send({
        success: false,
        error: error.message,
        message: "product not exist",
      });
      return;
    } else {
      res.status(200).send({
        success: true,
        message: product,
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error in getting single product",
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const id = req.params.pid;
    const { name ,description, price, weight, quantity } =
      req.fields;
    const { photo } = req.files;
    console.log(id, name, photo);
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
    const product = await productModel.findByIdAndUpdate(id, {
      ...req.fields
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

  const cod = async (req, res) => {
    try {
      const { cart, id } = req.body; 
      const order1 = await new orderModel({
        products: cart,
        buyer: id,
      }).save();

      const order = await orderModel.findById(order1._id);

      for (const orderProduct of order.products) {
        const { _id, quantity } = orderProduct;
    
        const product = await productModel.findOne({ _id });
    
        if (product) {
          product.quantity -= quantity;
          await product.save();
        } else {
          console.log(`Product with ID ${_id} not found in the product model`);
        }
      }
    
      // Now you have updated the quantities in the product model based on the order
      console.log('Product quantities updated successfully');

      res.status(200).send({
        success: true,
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        error: error.message,
        message: "Error in cod payment",
      });
    }
  };

  const productQuantity = async (req,res)=>{
    try {
      const {id} = req.params;
      const {quantity} = req.body;
      const updateProduct = await productModel.findByIdAndUpdate(id,{quantity});
      if (updateProduct) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ success: false, message: 'Product not found' });
      }
    } catch (error) {
      res.status(400).send({
        success: false,
        error: error.message,
        message: "Error in updating quantity",
      });
    }
  }

module.exports = {
  cod,
  updateStatus,
  allOrder,
  order,
  createProduct,
  updateProduct,
  getProduct,
  getProductPhoto,
  deleteProduct,
  getSingleProduct,
  productQuantity
};
