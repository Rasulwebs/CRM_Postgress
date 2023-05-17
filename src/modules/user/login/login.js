import { SIGN, VERIFY } from "../../../utils/jwt.js";
import sha256 from "sha256";
import UsersModel from "../../../schemas/user.model.js";

export const userLogin = async (req, res) => {
  try {
    let { email, contact } = req.body;
    if (!email || !contact) {
      throw new Error(`Malumot toliq emas😕 email, contact yuboring`);
    } else {
      let findUser = await UsersModel.findOne({
        where: { email, contact },
        raw: true,
      });
      if (findUser != undefined) {
        let token = SIGN({ user_id: await findUser.user_id });
        res.send({
          token,
          status: 201,
          message: "Authorization was successfuly 😎👌",
          user: findUser,
        });
      } else {
        throw new Error(
          `Not Found User with email -> ${email} and contact -> ${contact} `
        );
      }
    }
  } catch (error) {
    res.send({ msg: error.message, status: 401 });
  }
};
