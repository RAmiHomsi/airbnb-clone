const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "name required"],
  },
  email: { type: String, unique: true, required: [true, "email required"] },
  password: {
    type: String,
    required: [true, "password required"],
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  // Hashing user password
  this.password = await bcrypt.hashSync(this.password, 12);
  next();
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
