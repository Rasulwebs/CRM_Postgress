import UsersModel from "../../../schemas/user.model.js";
import { VERIFY } from "../../../utils/jwt.js";
import sequelize from "../../../utils/sequelize.js";
import IncomesModel from "../../../schemas/incomes.model.js";
import OutlayModel from "../../../schemas/outlay.model.js";
import ChecksModel from "../../../schemas/checks.model.js";
import e from "express";

const getUsers = async (req, res) => {
  let { token } = req.headers;
  try {
    let { group, onsite, username, contact, gender } = req.query;
    if (!token) {
      throw new Error(`You are not sent token from headers`);
    } else {
      let { user_id } = VERIFY(token);
      let findUserById = await UsersModel.findOne({
        where: { user_id: user_id },
        raw: true,
      });

      if (findUserById.pos_ref_id == 1) {
        if (
          group &&
          onsite &&
          !isNaN(group * 1) &&
          isNaN(onsite * 1) &&
          onsite == "off"
        ) {
          let notStudying = await sequelize.query(
            `SELECT * FROM users u JOIN groups g ON g.gr_id = u.group_ref_id WHERE u.left_date IS NOT NULL AND g.gr_id = ${group}`
          );
          if (notStudying[0][0] == undefined) {
            throw new Error(`Bu guruhda chiqib ketgan user yo'q`);
          } else {
            res.send(notStudying[0]);
          }
        } else if (
          group &&
          onsite &&
          !isNaN(group * 1) &&
          isNaN(onsite * 1) &&
          onsite == "on"
        ) {
          let studyNow = await sequelize.query(
            `SELECT * FROM users u JOIN groups g ON g.gr_id = u.group_ref_id WHERE u.left_date IS  NULL AND g.gr_id = ${group}`
          );
          if (!studyNow[0].length) {
            throw new Error("Bu guruhda user mavjud emas");
          } else {
            res.send(studyNow[0]);
          }
        } else if (group && !isNaN(group * 1)) {
          let studyNow = await sequelize.query(
            `SELECT * FROM users u JOIN groups g ON g.gr_id = u.group_ref_id WHERE u.left_date IS  NULL AND g.gr_id = ${group}`
          );
          if (!studyNow[0].length) {
            throw new Error("Bu guruhda user mavjud emas");
          } else {
            res.send(studyNow[0]);
          }
        } else if (username && isNaN(username * 1)) {
          let findUserByUsername = await sequelize.query(
            `SELECT u.first_name,u.last_name, u.email,u.contact, u.gender , p.pos_name  FROM users u JOIN positions p ON p.pos_id = u.pos_ref_id WHERE u.left_date IS NULL  AND  u.first_name ilike '%${username}%'  `
          );
          if (findUserByUsername[0].length) {
            res.send(findUserByUsername[0]).status(200);
          } else {
            throw new Error(`Bunday usernamelik user mavjud emas`);
          }
        } else if (contact) {
          let findUserByContact = await sequelize.query(
            `SELECT u.first_name,u.last_name, u.email,u.contact, u.gender , p.pos_name FROM users u JOIN positions p ON p.pos_id = u.pos_ref_id WHERE u.contact ilike '%${contact}%' AND u.left_date IS NULL`
          );
          if (findUserByContact[0].length) {
            res.send(findUserByContact[0]);
          } else {
            throw new Error(`Not Found ${contact} -  lik User`);
          }
        } else if ((gender && gender == "male") || gender == 1) {
          let findMale = await sequelize.query(
            `SELECT u.first_name,u.last_name, u.email,u.contact, u.gender , p.pos_name FROM users u JOIN positions p ON p.pos_id = u.pos_ref_id WHERE u.gender = 1 AND u.left_date IS NULL`
          );
          res.send(findMale[0].length ? findMale[0] : "Not Found male");
        } else if ((gender && gender == "female") || gender == 2) {
          let findFemale = await sequelize.query(
            `SELECT * FROM users WHERE gender = 2 AND left_date IS NULL`
          );
          res.send(findFemale[0].length ? findFemale[0] : "Not Found female");
        } else {
          let users = await sequelize.query(
            `SELECT u.user_id, u.first_name, u.last_name, u.gender, u.email, u.contact, g.gr_id, g.gr_number FROM users u  LEFT JOIN groups  g  ON u.group_ref_id= g.gr_id WHERE g.end_date IS NULL AND u.left_date IS NULL`
          );
          if (users[0]) {
            res.send(users[0]);
          } else {
            throw new Error("Not Found User");
          }
        }
      } else if (findUserById.pos_ref_id == 2) {
        let teacherProfile = await sequelize.query(
          `SELECT u.first_name, u.last_name, u.gender, u.contact, u.email,p.salary oylik_maosh ,d.dir_name  yonalish, g.gr_number guruh_raqami  FROM positions p JOIN users u ON p.pos_id = u.pos_ref_id LEFT JOIN groups g ON g.gr_id = u.group_ref_id  JOIN directions d ON d.dir_id = g.dir_ref_id WHERE p.pos_id = 2 AND u.user_id = ${user_id} `
        );
        res.send({
          profile: teacherProfile[0][0],
        });
      } else if (findUserById.pos_ref_id == 4) {
        let usersProfile = await sequelize.query(
          `SELECT d.dir_name direction_name, u.user_id,u.left_date,  u.first_name, u.last_name, u.gender, u.email, u.contact , p.pos_name, g.gr_number FROM users u LEFT  JOIN incomes i on i.user_ref_id = u.user_id  JOIN positions p ON p.pos_id = u.pos_ref_id LEFT JOIN groups g ON g.gr_id = u.group_ref_id LEFT JOIN directions d ON d.dir_id = g.dir_ref_id WHERE p.pos_id = 4 AND u.user_id = ${user_id}`
        );
        let userPayment = await sequelize.query(
          "SELECT sum(amount) FROM incomes i JOIN users u ON i.user_ref_id = u.user_id WHERE user_id = 3"
        );
        let up = await usersProfile[0][0];

        let result = {
          user_id: up?.user_id,
          first_name: up?.first_name,
          last_name: up?.last_name,
          gender: up?.gender == 1 ? "male" : up?.gender == 2 ? "female" : null,
          email: up?.email,
          contact: up?.contact,
          position: up?.pos_name,
          group_num: up?.gr_number,
          jami_tolovlari: await userPayment[0][0].sum,
          on: up?.left_date ? "chopilgan yoki tugatgan vakazo" : "o'qiyapti",
        };
        res.send({
          profile: result,
        });
      }
    }
  } catch (error) {
    res.send({ msg: `Error : ${error.message}`, status: 404, success: false });
  }
};

const getGroups = async (req, res) => {
  try {
    let { token } = req.headers;
    let { id } = req.params;
    if (!token) {
      throw new Error(`You are not sent token from headers`);
    }
    let { user_id } = VERIFY(token);
    let findUserById = await UsersModel.findOne({
      where: { user_id: user_id },
      raw: true,
    });
    if (findUserById.pos_ref_id == 1) {
      if (id) {
        let teachers = await sequelize.query(
          `SELECT * FROM users u JOIN positions p ON u.pos_ref_id = p.pos_id WHERE p.pos_id = 2 AND u.group_ref_id = ${id}`
        );

        let groupsById = await sequelize.query(
          `SELECT g.gr_id, g.gr_number,  g.begin_date, u.first_name, u.last_name, u.email,u.gender, u.contact, d.dir_name, d.duration FROM directions d JOIN groups g ON d.dir_id = g.dir_ref_id LEFT JOIN users u on u.group_ref_id = g.gr_id WHERE g.gr_id = ${id}`
        );
        let studentsNum = await sequelize.query(
          `SELECT count(*) from users u JOIN groups g ON  u.group_ref_id = g.gr_id WHERE g.gr_id = ${id} AND  u.pos_ref_id = 4`
        );
        let all_res = {
          ustoz: {
            first_name: teachers[0][0].first_name,
            last_name: teachers[0][0].last_name,
          },
          yonalish: groupsById[0][0].dir_name,
          guruh_raqam: groupsById[0][0].gr_number,
          students_count: studentsNum[0][0].count,
          dars_vaqti: groupsById[0][0].duration,
        };
        if (all_res != undefined) {
          res.send(all_res);
        } else {
          throw new Error(`Not Found ${id} - group`);
        }
      } else {
        let groups = await sequelize.query(
          `SELECT g.*, d.dir_name as course_name FROM groups g join directions d on g.dir_ref_id=d.dir_id WHERE d.end_date IS NULL AND g.end_date IS NULL`
        );
        res.send(groups[0] ? groups[0] : "Not Found Groups");
      }
    } else if (findUserById.pos_ref_id == 2) {
      let studentsNum = await sequelize.query(
        `SELECT count(*) from users u JOIN groups g ON  u.group_ref_id = g.gr_id WHERE g.gr_id = ${findUserById.group_ref_id} AND  u.pos_ref_id = 4`
      );
      let teacherGroup = await sequelize.query(
        `SELECT * FROM directions d JOIN groups g ON d.dir_id = g.dir_ref_id JOIN users u ON u.group_ref_id = g.gr_id WHERE u.user_id = ${user_id} AND u.pos_ref_id = 2`
      );
      let tr = await teacherGroup[0][0];

      let teacher_group = {
        teacher_group: tr?.first_name,
        guruh_raqam: tr?.gr_number,
        direction: tr?.dir_name,
        oylik_tolov: tr?.salary,
        student_count: studentsNum[0][0].count,
      };
      if (teacher_group != undefined) {
        res.send(teacher_group).status(200);
      } else {
        throw new Error(`Not Found`);
      }
    } else {
      throw new Error(`Bu Route faqat Teacherlar va Admin uchun`);
    }
  } catch (error) {
    res.send({ msg: `Error : ${error.message}`, status: 404, success: false });
  }
};

const getIncomesForOnlyAccountant = async (req, res) => {
  try {
    let { month } = req.query;
    let { token } = req.headers;
    if (!token) {
      throw new Error(`You are not sent token from headers`);
    }
    let { user_id } = VERIFY(token);

    let findUserById = await UsersModel.findOne({
      where: { user_id: user_id },
      raw: true,
    });

    if (findUserById.pos_ref_id == 3) {
      if (month) {
        let monthAgoIncomes = await sequelize.query(
          `SELECT i.incom_id, i.reason, i.amount, i.inc_time, u.first_name, u.last_name, u.gender, u.email FROM incomes i  LEFT JOIN users u ON i.user_ref_id = u.user_id WHERE i.inc_time = (select now()::date-INTERVAL '1 month') `
        );
        if (!monthAgoIncomes.length) {
          throw new Error(`${month} -oldingi kirimlar mavjud emas`);
        } else {
          res.send(await monthAgoIncomes[0]);
        }
      } else {
        let incomesForOnlyAccountant = await sequelize.query(
          `SELECT * FROM incomes i  LEFT JOIN users u ON i.user_ref_id = u.user_id`
        );
        let all_kirim = await sequelize.query(
          `SELECT sum(i.amount) FROM incomes i  LEFT JOIN users u ON i.user_ref_id = u.user_id`
        );
        let full_res = {
          barcha_kirimlar: all_kirim[0][0].sum,
          data: await incomesForOnlyAccountant[0],
        };
        res.send(await full_res).status(200);
      }
    } else {
      throw new Error(
        `Faqatgina Accountant kirimlar haqida malumot olishi mumkin`
      );
    }
  } catch (error) {
    res.send({ msg: `Error : ${error.message}`, status: 404, success: false });
  }
};

const getOutlayForOnlyAccountant = async (req, res) => {
  try {
    let { token } = req.headers;
    let { month } = req.query;
    if (!token) {
      throw new Error(`You are not sent token from headers`);
    }
    let { user_id } = VERIFY(token);

    let findUserById = await UsersModel.findOne({
      where: { user_id: user_id },
      raw: true,
    });
    if (findUserById.pos_ref_id == 3) {
      if (month) {
        let monthAgoOutlay = await sequelize.query(
          `SELECT * FROM outlay WHERE out_time = (select now()::date-INTERVAL '1 month')`
        );
        let all_chiqimMonthAgo = await sequelize.query(
          `SELECT sum(amount) FROM outlay WHERE out_time = (select now()::date-INTERVAL '${month} month')`
        );
        res.send({
          chiqimlar_summasi: all_chiqimMonthAgo[0][0].sum,
          chiqimlar: monthAgoOutlay[0],
        });
      } else {
        let all_outlays = await sequelize.query(`SELECT * FROM outlay`);
        let all_outlay_sum = await sequelize.query(
          `SELECT sum(amount) FROM outlay`
        );
        const respons = {
          barcha_chiqimlar_puli: all_outlay_sum[0][0].sum,
          data: all_outlays[0],
        };
        if (respons != undefined) {
          res.send(await respons);
        } else {
          throw new Error(`Chiqmlar mavjud emas`);
        }
      }
    } else {
      throw new Error(
        `Faqatgina Accountant chiqimlar haqida malumot olishi mumkin`
      );
    }
  } catch (error) {
    res.send({ msg: `Error : ${error.message}`, status: 404, success: false });
  }
};

const addIncomesForOnlyAccountant = async (req, res) => {
  try {
    let { token } = req.headers;
    let { user_id } = VERIFY(token);
    let { reason, amount, inc_time, user_ref_id } = req.body;
    if (!reason || !amount || !inc_time || !user_ref_id) {
      throw new Error(
        `Malumot To'liq emas reson, amount, inc_time, user_ref_id yuboring!😕`
      );
    }
    let findUserById = await UsersModel.findOne({
      where: { user_id: user_id },
      raw: true,
    });

    if (findUserById.pos_ref_id == 3) {
      let newIncomes = await IncomesModel.create({
        reason,
        amount,
        inc_time,
        user_ref_id,
      });
      res.send(
        newIncomes == undefined
          ? "Qo'shilmadi"
          : {
              message: "Incomes Added Was Successfuly 🥳✅",
              status: 201,
              added_incomes: await newIncomes,
            }
      );
    } else {
      throw new Error(
        `Faqatgina Accountant Kirimlar va Chiqimlar qo'sha oladi`
      );
    }
  } catch (error) {
    res.send({ msg: `Error : ${error.message}`, status: 404, success: false });
  }
};

const addOutlayForOnlyAccountant = async (req, res) => {
  try {
    let { token } = req.headers;
    let { user_id } = VERIFY(token);
    let { reason, amount, out_time } = req.body;
    if (!reason || !amount || !out_time) {
      throw new Error(
        `Malumot To'liq emas reson, amount, out_time yuboring!😕`
      );
    }
    let findUserById = await UsersModel.findOne({
      where: { user_id: user_id },
      raw: true,
    });

    if (findUserById.pos_ref_id == 3) {
      let newOutlay = await OutlayModel.create({
        reason,
        amount,
        out_time,
      });
      res.send(
        newOutlay == undefined
          ? "Qo'shilmadi"
          : {
              message: "Outlay Added Was Successfuly 🥳✅",
              status: 201,
              added_outlay: await newOutlay,
            }
      );
    } else {
      throw new Error(
        `Faqatgina Accountant Kirimlar va Chiqimlar qo'sha oladi`
      );
    }
  } catch (error) {
    res.send({ msg: `Error : ${error.message}`, status: 404, success: false });
  }
};

const addCheckForOnlyTeacher = async (req, res) => {
  try {
    let { token } = req.headers;
    let { user_id } = VERIFY(token);
    let { gr_ref_id, not_in_class } = req.body;
    let findUserById = await UsersModel.findOne({
      where: { user_id },
      raw: true,
    });
    if (!gr_ref_id || !not_in_class) {
      throw new Error(`Malumot to'liq emas gr_ref_id, not_in_class yuboring`);
    }
    if (findUserById.pos_ref_id == 2) {
      let findStudent = await sequelize.query(
        `SELECT user_id FROM users u JOIN groups g ON u.group_ref_id = g.gr_id WHERE u.pos_ref_id = 4 AND g.gr_id = ${gr_ref_id}`
      );

      let isArrayInclude = (originalArr, checkArr) => {
        return checkArr.every((val) => originalArr.includes(val));
      };

      let el_user_id = findStudent[0].map((el) => {
        return el.user_id;
      });

      if (findUserById.group_ref_id != gr_ref_id) {
        throw new Error(`Bu sizning guruhingiz emas`);
      } else {
        if (!isArrayInclude(el_user_id, not_in_class)) {
          throw new Error(`Bunday id lik o'quvchingiz mavjud emas`);
        } else {
          let newChecks = await ChecksModel.create({
            gr_ref_id: findUserById.group_ref_id,
            user_ref_id: findUserById.user_id,
            not_in_class,
          });
          res.send({
            status: 201,
            message: "Checked added✅",
            added_checks: await newChecks,
          });
        }
      }
    } else {
      throw new Error(`Faqat ustozlar uchun`);
    }
  } catch (error) {
    res.send({ msg: `Error : ${error.message}`, status: 404, success: false });
  }
};

// Update Methods

const UptadeIncomes = async (req, res) => {
  try {
    let { id } = req.params;
    let { token } = req.headers;
    let { user_ref_id, reason, amount, inc_time } = req.body;
    let { user_id } = VERIFY(token);
    let findUserById = await UsersModel.findOne({
      where: { user_id },
      raw: true,
    });
    if (!user_id && !reason && !amount && !inc_time) {
      throw new Error(`You are not sent data`);
    }
    if (findUserById.pos_ref_id == 3) {
      let findIncomentById = await IncomesModel.findOne({
        where: { incom_id: id },
      });
      if (findIncomentById == undefined) {
        throw new Error(`Not Found ${id} - incomes`);
      } else {
        let updated_incom = await IncomesModel.update(
          {
            user_ref_id,
            reason,
            amount,
            inc_time,
          },
          { returning: true, where: { incom_id: id } }
        );
        res.send(
          (await updated_incom[1][0]) == undefined
            ? "Not Updated"
            : {
                status: 200,
                success: true,
                message: "Updated Was Successfuly",
                updated_incom: updated_incom[1][0],
              }
        );
      }
    } else {
      throw new Error(`Incomeslarni faqatgina Accountant update qila oladi`);
    }
  } catch (error) {
    res.send({ msg: error.message, status: 404, success: false }).status(404);
  }
};

const UptadeOutlay = async (req, res) => {
  try {
    let { id } = req.params;
    let { token } = req.headers;
    let { reason, amount, out_time } = req.body;
    let { user_id } = VERIFY(token);
    let findUserById = await UsersModel.findOne({
      where: { user_id },
      raw: true,
    });
    if (!reason && !amount && !out_time) {
      throw new Error(`You are not sent data`);
    }
    if (findUserById.pos_ref_id == 3) {
      let findIncomentById = await OutlayModel.findOne({
        where: { outlay_id: id },
      });
      if (findIncomentById == undefined) {
        throw new Error(`Not Found ${id} - incomes`);
      } else {
        let updated_outlay = await OutlayModel.update(
          {
            reason,
            amount,
            out_time,
          },
          { returning: true, where: { outlay_id: id } }
        );
        res.send(
          (await updated_outlay[1][0]) == undefined
            ? "Not Updated"
            : {
                status: 200,
                success: true,
                message: "Updated Was Successfuly",
                updated_outlay: updated_outlay[1][0],
              }
        );
      }
    } else {
      throw new Error(`Outlaylarni faqatgina Accountant update qila oladi`);
    }
  } catch (error) {
    res.send({ msg: error.message, status: 404, success: false }).status(404);
  }
};

const UptadeCheckForTeacher = async (req, res) => {
  try {
    let { id } = req.params;
    let { token } = req.headers;
    let { gr_ref_id, not_in_class } = req.body;
    let { user_id } = VERIFY(token);
    let findUserById = await UsersModel.findOne({
      where: { user_id },
      raw: true,
    });
    if (!gr_ref_id && !not_in_class) {
      throw new Error(`You are not sent data`);
    }

    if ((await findUserById.pos_ref_id) == 2) {
      let findCheckById = await ChecksModel.findOne({
        where: { check_id: id },
        raw: true,
      });

      let findStudent = await sequelize.query(
        `SELECT user_id FROM users u JOIN groups g ON u.group_ref_id = g.gr_id WHERE u.pos_ref_id = 4 AND g.gr_id = ${await gr_ref_id}`
      );

      let isArrayInclude = (originalArr, checkArr) => {
        return checkArr.every((val) => originalArr.includes(val));
      };
      let el_user_id = await findStudent[0].map((el) => {
        return el.user_id;
      });

      let el_not_in_class = not_in_class.map((e) => {
        return e;
      });

      if ((await findCheckById) == undefined) {
        throw new Error(`Not Found ${id} - check`);
      } else {
        if ((await findUserById.group_ref_id) != gr_ref_id) {
          throw new Error(`Bu sizning guruhingiz emas`);
        } else if (!isArrayInclude(el_user_id, el_not_in_class)) {
          throw new Error(`Bunday id lik o'quvchingiz mavjud emas`);
        } else {
          let updated_check = await ChecksModel.update(
            {
              gr_ref_id,
              not_in_class,
            },
            { returning: true, where: { check_id: id } }
          );
          res.send(
            (await updated_check[1][0]) == undefined
              ? "Not Updated"
              : {
                  status: 200,
                  success: true,
                  message: "Updated Was Successfuly",
                  updated_check: updated_check[1][0],
                }
          );
        }
      }
    } else {
      throw new Error(`Checklarni faqatgina Teacher update qila oladi`);
    }
  } catch (error) {
    res.send({ msg: error.message, status: 404, success: false }).status(404);
  }
};

export {
  getUsers,
  getGroups,
  getIncomesForOnlyAccountant,
  getOutlayForOnlyAccountant,
  addIncomesForOnlyAccountant,
  addOutlayForOnlyAccountant,
  addCheckForOnlyTeacher,
  UptadeIncomes,
  UptadeOutlay,
  UptadeCheckForTeacher,
};
