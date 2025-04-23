const { User, Basket } = require("../models/model");
const ApiError = require("../error/apiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "4d" });
};
class UserController {
  // async registration(req, res, next) {
  //     try {
  //         const { email, password, role } = req.body;

  //         if (!email || !password) {
  //             return next(ApiError.badRequest('Email ýa-da açar söz giriz!'));
  //         }
  //         const user = await User.findOne({ where: { email } });
  //         if (user) {
  //             return next(ApiError.badRequest(`${email} email ulgamda hasaba alnan!`));
  //         }
  //         const hashPassword = await bcrypt.hash(password, 3);
  //         const candidate = await User.create({ email, role, password: hashPassword });
  //         await Basket.create({ userId: candidate.id });

  //         const jsonwebt = generateJwt(candidate.id,user.email,user.role)

  //         return res.json({ jsonwebt });
  //     } catch (error) {
  //         console.log(error);

  //         next(ApiError.badRequest(error));
  //     }
  // }
  async registration(req, res, next) {
    try {
      const { email, role, password } = req.body; // Added password to destructuring

      if (!password || !email) {
        return next(ApiError.badRequest("Açar söz ýa-da email giriz!"));
      }

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return next(ApiError.badRequest(`${email} ulgamda hasaba alnan!`));
      }

      const hashPassword = await bcrypt.hash(password, 3);

      const candidate = await User.create({
        email,
        role,
        password: hashPassword,
      });

      // Generate JWT
      const jsonwebt = generateJwt(
        candidate.id,
        candidate.email,
        candidate.role
      );

      return res.status(201).json({ token: jsonwebt });
    } catch (error) {
      console.error(error);
      next(ApiError.badRequest("Something went wrong during registration"));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(ApiError.badRequest("Poçta ýa-da açar söz giriz!"));
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.badRequest("Ulanyjy ýok!"));
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return next(ApiError.badRequest("Açar söz nädogry!"));
      }

      const jsonwebt = generateJwt(user.id, user.email, user.role);

      const { password: removed, ...userWithoutPassword } = user.dataValues;

      return res.json({ token: jsonwebt, user: userWithoutPassword });
    } catch (error) {
      console.error(error);
      next(ApiError.badRequest(error.message));
    }
  }
  async check(req, res, next) {
    const { id } = req.query;
    if (!id) {
      return next(ApiError.badRequest("Ýalňyş id"));
    }
    res.json(id);
  }
}
module.exports = new UserController();
