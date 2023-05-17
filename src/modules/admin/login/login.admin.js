import { SIGN, VERIFY } from "../../../utils/jwt.js";
import sha256 from "sha256";
import sendMail from "../../../nodemailer/mail.js";
import UsersModel from "../../../schemas/user.model.js";

let findAdmin = UsersModel.findOne({
  where: { email: "boyqoziyevs0@gmail.com", contact: "+998901234567" },
  raw: true,
});
let admin = await findAdmin;

let tasdiqlashKodi = sha256(`${Math.random() * 100000}`);

let a = "boyqoziyevs0@gmail.com";
let b = "+998901234567";

export const AdminLogin = async (req, res) => {
  try {
    const { contact, email } = req.body;
    if (!contact || !email) throw new Error("Malumot to'liq emas");
    if (admin.email == email && admin.contact == contact) {
      sendMail(email, tasdiqlashKodi);
      res.send({
        message: `${email}- emailingizga tasdiqlash kodi yubordik! kodni http://localhost:5000/pass/code ga bodydan pass klyuch ostida yuboring !`,
        status: 200,
        link: "http://localhost:5000/pass/code",
      });
    } else {
      throw new Error("you are not admin");
    }
  } catch (error) {
    res.send({ msg: error.message, status: 400 });
  }
};

export const passCode = (req, res) => {
  try {
    const { pass } = req.body;
    if (pass == tasdiqlashKodi) {
      let token = SIGN({ user_id: admin.user_id });
      res
        .send({
          token,
          message: "Ok",
        })
        .status(200);
    }
  } catch (error) {
    res.send({ msg: error.message, status: 400 });
  }
};
