import UsersModel from "../schemas/user.model.js";
import { VERIFY } from "../utils/jwt.js";

export const checkAdmin = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (token) {
      const findAdmin = await UsersModel.findOne({ where: { email : 'boyqoziyevs0@gmail.com', contact : "+998901234567" } });
      let admin = await findAdmin;
      let verifyed = VERIFY(token);
      let { user_id } = verifyed;
      if (user_id == admin.user_id) {
        next();
      } else {
        throw new Error("You are not admin");
      }
    } else {
      throw new Error("You are not sent token from headers");
    }
  } catch (error) {
    res.send({ msg: error.message, status: 400 }).status(400);
  }
};
