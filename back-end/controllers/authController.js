import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (name.length < 3)
      return res
        .status(400)
        .json({ message: "Name should be atleast 3 characters long" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password should be atleast 6 characters long" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    res.status(200).json({ message: "User has been created", user:newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", err: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name: name });
    if (!user)
      return res.status(404).json({ message: "Invalid userName or password" });

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch)
      return res.status(404).json({ message: "Invalid userName or password" });

    const userObj = user.toObject();
    delete userObj.password;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      .status(200)
      .json({ userObj });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", err: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
      });
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none"
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { id: savedUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES }
      );
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", err: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
    });
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", err: error.message });
  }
};
