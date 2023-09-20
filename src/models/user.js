const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    toJSON: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  lastActivityDate: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(this.password, salt);
      this.password = hashed;
    }

    next();
  } catch (e) {
    next(e);
  }
});

UserSchema.methods.isValidPass = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
