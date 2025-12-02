const User = require("../models/User");

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.status(200).json({ success: true, data: user });
};

exports.updateMe = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  res.status(200).json({ success: true, data: updated });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.status(200).json({ success: true, count: users.length, data: users });
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  res.status(200).json({ success: true, data: user });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "User deleted" });
};
