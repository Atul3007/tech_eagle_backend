const { userModel } = require("./../models/userModel");
const { hashpass, comparePass } = require("../helper/authHelper");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, phone, password, address} = req.body;
     //console.log({req:req.body})
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !address
    ) {
      res.send({ error: "All fields required" });
    } else {
      const uniqueEmail = await userModel.findOne({ email });
      if (uniqueEmail) {
        res.send({
          message: "All ready registered, Please login",
        });
      } else {
        const hashPassword = await hashpass(password);
        const newUserData = new userModel({
          name,
          email,
          phone,
          password: hashPassword,
          address
        });
        await newUserData.save();

        res.status(201).json({ message: "data inserted successfully" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in registration",
      sucess: false,
    });
  }
};

//login
const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(200).json({ message: "email and password required" });
  } else {
    const user = await userModel.findOne({ email });
    const compare = await comparePass(password, user.password);
    //console.log(user)
    if (compare) {
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ id: user._id }, jwtSecretKey);
      res.status(200).json({ message: "login success", token, user });
    } else {
      res.status(400).json({ message: "login failed" });
    }
  }
};

module.exports = {
  registerController,
  loginController,
};
