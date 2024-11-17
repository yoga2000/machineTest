const { User } = require("../models/users");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const usr = await User.find({ name });

    if (!usr[0] || usr[0].password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const accessToken = jwt.sign({ email: usr[0].email }, process.env.ACCESS_SECRET_KEY, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      data: usr[0],
      message: "success",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { login };
