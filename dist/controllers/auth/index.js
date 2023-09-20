"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _nodemailer = require('nodemailer'); var _nodemailer2 = _interopRequireDefault(_nodemailer);
var _boom = require('boom'); var _boom2 = _interopRequireDefault(_boom);
var _user = require('../../models/user'); var _user2 = _interopRequireDefault(_user);




var _jwt = require('../../helpers/jwt');
var _validations = require('./validations'); var _validations2 = _interopRequireDefault(_validations);

const transport = _nodemailer2.default.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "vittorio.tezza93@gmail.com",
    pass: "vuzhilddcxtqrbjv",
  },
});

const Register = async (req, res, next) => {
  const input = req.body;

  const { error } = _validations2.default.validate(input);

  if (error) {
    return next(_boom2.default.badRequest(error.details[0].message));
  }

  try {
    const isExists = await _user2.default.findOne({ email: input.email });

    if (isExists) {
      return next(_boom2.default.conflict("This e-mail is already in use."));
    }

    const user = new (0, _user2.default)(input);
    const data = await user.save();
    const userData = data.toObject();

    delete userData.password;
    delete userData.__v;

    const accessToken = await _jwt.signAccessToken.call(void 0, {
      user_id: user._id,
      role: user.role,
    });
    const refreshToken = await _jwt.signRefreshToken.call(void 0, user._id);

    res.json({
      user: userData,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    next(e);
  }
};

const Login = async (req, res, next) => {
  const input = req.body;

  const { error } = _validations2.default.validate(input);

  if (error) {
    return next(_boom2.default.badRequest(error.details[0].message));
  }

  try {
    const user = await _user2.default.findOne({ email: input.email });

    if (!user) {
      throw _boom2.default.notFound("The email address was not found.");
    }

    const isMatched = await user.isValidPass(input.password);
    if (!isMatched) {
      throw _boom2.default.unauthorized("Email or password is not correct.");
    }

    const accessToken = await _jwt.signAccessToken.call(void 0, {
      user_id: user._id,
      role: user.role,
    });
    const refreshToken = await _jwt.signRefreshToken.call(void 0, user._id);

    const userData = user.toObject();
    delete userData.password;
    delete userData.__v;

    res.json({ user: userData, accessToken, refreshToken });
  } catch (e) {
    return next(e);
  }
};

const RefreshToken = async (req, res, next) => {
  const { refresh_token } = req.body;

  try {
    if (!refresh_token) {
      throw _boom2.default.badRequest("Refresh token is missing.");
    }

    const user_id = await _jwt.verifyRefreshToken.call(void 0, refresh_token);
    const accessToken = await _jwt.signAccessToken.call(void 0, user_id);
    const refreshToken = await _jwt.signRefreshToken.call(void 0, user_id);

    res.json({ accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
};

const Logout = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      throw _boom2.default.badRequest("Refresh token is missing.");
    }

    res.json({ message: "Logout successful" });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

const Me = async (req, res, next) => {
  const { user_id } = req.payload;

  try {
    const user = await _user2.default.findById(user_id).select("-password -__v");

    res.json(user);
  } catch (e) {
    next(e);
  }
};

const GetAllUsers = async (req, res, next) => {
  try {
    const users = await _user2.default.find({}, "-password -__v");
    res.json(users);
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await _user2.default.findById(userId);
    if (!user) {
      return next(_boom2.default.notFound("User not found"));
    }

    const mailOptions = {
      from: "tienda <tienda@gmail.com>",
      to: user.email,
      subject: "Usuario Eliminado",
      text: "Se ha eliminado su usuario.",
    };

    const result = await transport.sendMail(mailOptions);
    console.log(
      `Correo electrónico enviado a ${user.email}: ${result.response}`
    );

    const resultDelete = await _user2.default.deleteOne({ _id: userId });
    if (resultDelete.deletedCount === 1) {
      res.json({ message: "User deleted successfully" });
    } else {
      next(_boom2.default.notFound("User not found"));
    }
  } catch (e) {
    next(e);
  }
};

const changeUserRole = async (req, res, next) => {
  const userId = req.params.userId;
  const newRole = req.body.role;

  try {
    const user = await _user2.default.findById(userId);
    if (!user) {
      return next(_boom2.default.notFound("User not found"));
    }

    user.role = newRole;
    await user.save();

    res.json({ message: "User role updated successfully" });
  } catch (e) {
    next(e);
  }
};

const deleteInactiveUsers = async () => {
  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

  try {
    const deletedUsers = await _user2.default.find({
      lastActivityDate: { $lt: fortyEightHoursAgo },
    });

    const result = await _user2.default.deleteMany({
      lastActivityDate: { $lt: fortyEightHoursAgo },
    });

    console.log(`Deleted ${result.deletedCount} inactive users.`);

    for (const user of deletedUsers) {
      const mailOptions = {
        from: "test@gmail.com",
        to: user.email,
        subject: "Notificación de eliminación de cuenta",
        text: "Tu cuenta ha sido eliminada debido a la inactividad en nuestro sistema.",
      };

      try {
        const info = await emailTransporter.sendMail(mailOptions);
        console.log(
          `Correo electrónico enviado a ${user.email}: ${info.response}`
        );
      } catch (error) {
        console.error(
          `Error al enviar correo electrónico a ${user.email}: ${error}`
        );
      }
    }
  } catch (e) {
    console.error("Error deleting inactive users:", e);
  }
};

exports. default = {
  Register,
  Login,
  RefreshToken,
  Logout,
  Me,
  GetAllUsers,
  deleteInactiveUsers,
  deleteUser,
  changeUserRole,
};
