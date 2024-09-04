const User = require("../models/User");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const https = require("https");
// const axiosInstance = axios.create({
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false, // Set this to false to ignore certificate errors
//   }),
// });

let refreshTokens = [];

const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const testUser = await User.findOne({ username: req.body.username });
      const testEmail = await User.findOne({ email: req.body.email });
      
      if (testUser !== null) {
        return res.status(401).json({
          success: false,
          message: "Username is duplicated!",
          data: {},
        });
      }

      if (testEmail !== null && testEmail.loginMethod === 'AUTHENTICATION') {
        return res.status(403).json({
          success: false,
          message: "Email is duplicated!",
          data: {},
        });
      }
      else if(testEmail !== null && testEmail.loginMethod === 'GOOGLE'){
        const updateUser = await User.findByIdAndUpdate(testEmail._id, {
          username: req.body.username,
          fullname: req.body.fullname,
          password: hashed,
          idGoogle: '',
          loginMethod: 'AUTHENTICATION'
        }, { new: true });
        return res.status(200).json({
          success: true,
          message: "Register successfully !",
          data: updateUser,
        });
      }

      //Create new user
      const newUser = await new User({
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashed,
        loginMethod: req.body.loginMethod
      });

      //Save user to DB
      const user = await newUser.save();

      return res.status(200).json({
        success: true,
        message: "Register successfully !",
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
        data: {},
      });
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Incorrect email",
          data: {},
        });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(404).json({
          success: false,
          message: "Incorrect password",
          data: {},
        });
      }

      if (user && validPassword) {
        //Generate access token
        const accessToken = await authController.generateAccessToken(user);
        //Generate refresh token
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure:false,
          path: "/",
          sameSite: "strict",
        });

        const { password, ...others } = user._doc;

        return res.status(200).json({
          success: true,
          message: "Log in successfully !",
          data: { ...others, accessToken },
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: {},
      });
    }
  },

  requestRefreshToken: async (req, res) => {
    //Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    //Send error if token is not valid
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      //create new access token, refresh token and send to user
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },
  
  //LOG OUT
  logOut: async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  },

  //UPDATE USER
  updateUser: async (req, res) => {
    try {
      const updateUser = {
        fullname: req.body.fullname,
      };

      // Update the user using findByIdAndUpdate
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateUser,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: {},
        });
      }

      res.status(200).json({
        success: true,
        message: "Edit successfully!",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: {},
      });
    }
  },
};

module.exports = authController;
