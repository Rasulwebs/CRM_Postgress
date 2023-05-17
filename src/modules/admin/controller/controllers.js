import DepartmentsModel from "../../../schemas/department.model.js";
import DirectionsModel from "../../../schemas/directions.model.js";
import GroupsModel from "../../../schemas/groups.model.js";
import PositionModel from "../../../schemas/positions.model.js";
import UsersModel from "../../../schemas/user.model.js";
import sequelize from "../../../utils/sequelize.js";

export class AdminController {
  constructor() {}

  // get mothod
  static async getAllDepartment(req, res) {
    try {
      if (await req.query?.positions) {
        let x = await sequelize.query(
          `SELECT d.dep_name,  u.* FROM departments d join positions p on d.dep_id=p.dep_ref_id join users u on u.pos_ref_id=p.pos_id WHERE d.delete_at IS NULL AND  p.pos_name ilike '%${req.query?.positions}%' AND u.left_date IS NULL`
        );
        res.send(await x[0]).status(200);
      } else if (await req.query?.directions) {
        let x = await sequelize.query(
          `SELECT g.*, dr.* FROM departments d join directions dr on d.dep_id=dr.dep_ref_id join groups g on g.dir_ref_id=dr.dir_id where dr.dir_name ilike '%${req.query?.directions}%' and g.end_date  is null and dr.end_date is null`
        );
        res.send(await x[0]);
      } else {
        let s = await sequelize.query(
          `SELECT * FROM departments WHERE delete_at IS NULL`
        );
        res.send(s[0]);
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404 }).status(404);
    }
  }

  static async getDepartmentsParams(req, res) {
    try {
      let { params } = req.params;
      if (req.params?.params && !isNaN(params * 1)) {
        let x = await sequelize.query(
          `SELECT d.dep_id, d.dep_name, d.create_at, d.center_ref_id, p.pos_name, p.salary oylik_maosh , dr.dir_name    FROM departments d join positions p on d.dep_id=p.dep_ref_id left  join  directions dr on dr.dep_ref_id=d.dep_id WHERE  d.dep_id = ${params} and   d.delete_at IS NULL  AND dr.end_date IS NULL`
        );
        res.send(await x[0]).status(200);
      } else if (params && isNaN(params * 1) && params == "positions") {
        let data = await sequelize.query(
          `SELECT d.dep_name,p.pos_name, p.pos_id, u.* FROM departments d join positions p on d.dep_id=p.dep_ref_id left join users u on u.pos_ref_id=p.pos_id WHERE d.delete_at is null and u.left_date is null and d.delete_at is null`
        );
        res.send(await data[0]).status(200);
      } else if (params && isNaN(params * 1) && params == "directions") {
        let full_data = await sequelize.query(
          `SELECT g.*, dr.* FROM departments d join directions dr on d.dep_id=dr.dep_ref_id LEFT JOIN  groups g on g.dir_ref_id=dr.dir_id where  g.end_date  is null and dr.end_date is null `
        );
        res.send(await full_data[0]);
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404 }).status(404);
    }
  }

  static async getDirectionsByID(req, res) {
    try {
      let { id } = req.params;
      if (req.params.id) {
        let data = await sequelize.query(
          `SELECT g.*, dr.* FROM departments d join directions dr on d.dep_id=dr.dep_ref_id join groups g on g.dir_ref_id=dr.dir_id where   dr.end_date is null AND dr.dir_id = ${id} and g.end_date  is null  `
        );
        res.send(await data[0]);
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404 }).status(404);
    }
  }

  // get positions
  static async getPositionsById(req, res) {
    try {
      let { id } = req.params;
      if (id && !isNaN(id * 1)) {
        let data = await sequelize.query(
          `SELECT d.dep_name, p.pos_name,  u.* FROM departments d join positions p on d.dep_id=p.dep_ref_id LEFT join users u on u.pos_ref_id=p.pos_id WHERE p.pos_id=${id} AND u.left_date IS NULL AND d.delete_at IS NULL`,
          { raw: true }
        );
        res.send(data[0]).status(200);
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404 }).status(404);
    }
  }

  static async getGroups(req, res) {
    try {
      let { id } = req.params;
      if (id) {
        let findGroupById = await GroupsModel.findOne({where : {gr_id : id}});
        console.log(findGroupById);
        if(findGroupById== undefined){
          throw new Error(`Not Found ${id} - Group`)
        }
        let teachers = await sequelize.query(
          `SELECT * FROM users u JOIN positions p ON u.pos_ref_id = p.pos_id WHERE p.pos_id = 2 AND u.group_ref_id = ${id} AND u.left_date IS NULL`
        );

        let groupsById = await sequelize.query(
          `SELECT g.gr_id, g.gr_number,  g.begin_date, u.first_name, u.last_name, u.email,u.gender, u.contact, d.dir_name, d.duration FROM directions d JOIN groups g ON d.dir_id = g.dir_ref_id LEFT JOIN users u on u.group_ref_id = g.gr_id WHERE g.gr_id = ${id} AND d.end_date IS NULL AND g.end_date IS NULL AND u.left_date IS NULL`
        );
        let studentsNum = await sequelize.query(
          `SELECT count(*) from users u JOIN groups g ON  u.group_ref_id = g.gr_id WHERE g.gr_id = ${id} AND  u.pos_ref_id = 4 AND u.left_date IS NULL`
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
    } catch (error) {
      res.send({ msg: error.message, status: 404 }).status(404);
    }
  }

  static async getUsers(req, res) {
    try {
      let { group, onsite, username, contact, gender , limit, page} = req.query;
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
          `SELECT u.user_id, u.first_name, u.last_name, u.gender, u.email, u.contact, g.gr_id, g.gr_number FROM users u  LEFT JOIN groups  g  ON u.group_ref_id= g.gr_id WHERE g.end_date IS NULL AND u.left_date IS NULL  ORDER BY u.user_id DESC `
        );
        if (users[0]) {
          res.send(users[0]);
        } else {
          throw new Error("Not Found User");
        }
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404 }).status(404);
    }
  }

  // post method
  static async addDepartment(req, res) {
    try {
      let { center_ref_id, dep_name } = req.body;
      if (!center_ref_id || !dep_name) {
        throw new Error(
          `Malumot to'liq emas center_ref_id va dep_name yuboring`
        );
      } else {
        let newDepartment = await DepartmentsModel.create({
          center_ref_id,
          dep_name,
        });
        if ((await newDepartment) != undefined) {
          res
            .send({
              status: 201,
              message: "Department Added Was Successfuly🥳",
              added_data: newDepartment,
            })
            .status(201);
        } else {
          throw new Error(`Qoshilmadi Department`);
        }
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404 }).status(404);
    }
  }

  static async addDirections(req, res) {
    try {
      const { dep_ref_id, dir_name, duration, salary } = req.body;
      if (!dep_ref_id || !dir_name || !duration || !salary) {
        throw new Error(
          `Malumot to'liq emas dep_ref_id, dir_name, duration, salary jo'nating`
        );
      } else {
        let newDirection = await DirectionsModel.create({
          dep_ref_id,
          dir_name,
          duration,
          salary,
        });
        if ((await newDirection) != undefined) {
          res
            .send({
              status: 201,
              success: true,
              message: "Direction Added Was Successfuly 🥳",
              added_data: await newDirection,
            })
            .status(201);
        } else {
          throw new Error(`Qoshilmadi Direction`);
        }
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  static async addPosition(req, res) {
    try {
      const { pos_name, salary, dep_ref_id } = req.body;
      if (!pos_name || !salary || !dep_ref_id) {
        throw new Error(
          `Malumot to'liq emas pos_name, salary , dep_ref_id yuboring😕`
        );
      } else {
        let newPositon = await PositionModel.create({
          pos_name,
          salary,
          dep_ref_id,
        });
        if (newPositon == undefined) {
          throw new Error(`Qoshilmadi Position`);
        } else {
          res.send({
            status: 201,
            message: "Position Added Was Successfuly🥳",
            success: true,
            added_data: await newPositon,
          });
        }
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  static async addGroup(req, res) {
    try {
      const { dir_ref_id, gr_number } = req.body;
      if (!dir_ref_id || !gr_number) {
        throw new Error(
          `Malumot to'liq emas dir_ref_id , gr_number yuboring😕`
        );
      } else {
        let newGroup = await GroupsModel.create({
          gr_number,
          dir_ref_id,
        });
        if ((await newGroup) == undefined) {
          throw new Error(`Qoshilmadi Position`);
        } else {
          res.send({
            status: 201,
            message: "Group Added Was Successfuly🥳",
            success: true,
            added_data: await newGroup,
          });
        }
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  static async addUser(req, res) {
    try {
      let {
        first_name,
        last_name,
        gender,
        contact,
        email,
        pos_ref_id,
        group_ref_id,
      } = req.body;
      if (
        !first_name ||
        !last_name ||
        !gender ||
        !contact ||
        !email ||
        !pos_ref_id
      ) {
        throw new Error(
          `Malumot to'liq emas first_name, last_name, gender, contact, email, pos_ref_id ,  agar o'quvchi yoki ustoz bo'lsa group_ref_id yuboring`
        );
      } else {
        console.log(group_ref_id);
        let newUser = UsersModel.create({
          first_name,
          last_name,
          gender,
          contact,
          email,
          pos_ref_id,
          group_ref_id: group_ref_id != null ? group_ref_id : null,
        });
        if (newUser != undefined) {
          res.send({
            message: "User Added Was Successfuly✅",
            status: 201,
            success: true,
            added_user: await newUser,
          });
        }
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  // Update Methods
  static async UpdateDepartment(req, res) {
    try {
      let { id } = req.params;
      let { dep_name, center_ref_id } = req.body;
      if (!dep_name && !center_ref_id) {
        throw new Error(`You are not sent data`);
      }
      let findDepartmentById = await DepartmentsModel.findOne({
        where: { dep_id: id },
        raw: true,
      });
      if ((await findDepartmentById) == undefined) {
        throw new Error(`Not Found ${id} department`);
      } else {
        let updated_department = await DepartmentsModel.update(
          { dep_name, center_ref_id },
          { returning: true, where: { dep_id: id } }
        );
        res.send(
          (await updated_department[1][0]) == undefined
            ? "Not Updated"
            : {
                status: 200,
                success: true,
                message: "Updated Was Successfuly",
                updated_department: await updated_department[1][0],
              }
        );
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  static async updateDirections(req, res) {
    try {
      let { id } = req.params;
      let { dir_name, duration, salary, dir_id } = req.body;
      if (!dir_name && !duration && !salary && !dir_id) {
        throw new Error(`You are not sent data`);
      }
      let findDirectionsById = await DirectionsModel.findOne({
        where: { dir_id: id },
        raw: true,
      });
      if ((await findDirectionsById) == undefined) {
        throw new Error(`Not Found ${id} direction`);
      } else {
        let updated_directions = await DirectionsModel.update(
          { dir_name, duration, salary, dir_id },
          { returning: true, where: { dir_id: id } }
        );
        res.send(
          (await updated_directions[1][0]) == undefined
            ? "Not Updated"
            : {
                status: 200,
                success: true,
                message: "Updated Was Successfuly",
                updated_directions: await updated_directions[1][0],
              }
        );
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  static async updatePositions(req, res) {
    try {
      let { id } = req.params;
      let { pos_name, salary, dep_ref_id } = req.body;
      if (!pos_name && !salary && !dep_ref_id) {
        throw new Error(`You are not sent data`);
      }
      let findPositionById = await PositionModel.findOne({
        where: { pos_id: id },
        raw: true,
      });
      if ((await findPositionById) == undefined) {
        throw new Error(`Not Found ${id} position`);
      } else {
        let updated_position = await PositionModel.update(
          { pos_name, salary, dep_ref_id },
          { returning: true, where: { pos_id: id } }
        );
        res.send(
          (await updated_position[1][0]) == undefined
            ? "Not Updated"
            : {
                status: 200,
                success: true,
                message: "Updated Was Successfuly",
                updated_position: await updated_position[1][0],
              }
        );
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  static async updateGroup(req, res) {
    try {
      let { id } = req.params;
      let { gr_number, dir_ref_id } = req.body;
      if (!gr_number && !dir_ref_id) {
        throw new Error(`You are not sent data`);
      }
      let findUserById = await GroupsModel.findOne({
        where: { gr_id: id },
        raw: true,
      });
      if ((await findUserById) == undefined) {
        throw new Error(`Not Found ${id} group`);
      } else {
        let updated_group = await GroupsModel.update(
          { gr_number, dir_ref_id },
          { returning: true, where: { gr_id: id } }
        );
        res.send(
          (await updated_group[1][0]) == undefined
            ? "Not Updated"
            : {
                status: 200,
                success: true,
                message: "Updated Was Successfuly",
                updated_group: await updated_group[1][0],
              }
        );
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  static async updateUsers(req, res) {
    try {
      let { id } = req.params;
      let {
        pos_ref_id,
        first_name,
        last_name,
        gender,
        contact,
        email,
        group_ref_id,
      } = req.body;
      if (
        !pos_ref_id &&
        !first_name &&
        !last_name &&
        !gender &&
        !contact &&
        !email &&
        !group_ref_id
      ) {
        throw new Error(`You are not sent data`);
      }
      let findUserById = await UsersModel.findOne({
        where: { user_id: id },
        raw: true,
      });
      if ((await findUserById) == undefined) {
        throw new Error(`Not Found ${id} user`);
      } else {
        let updated_user = await UsersModel.update(
          {
            pos_ref_id,
            first_name,
            last_name,
            gender,
            contact,
            email,
            group_ref_id,
          },
          { returning: true, where: { user_id: id } }
        );
        res.send(
          (await updated_user[1][0]) == undefined
            ? "Not Updated"
            : {
                status: 200,
                success: true,
                message: "Updated Was Successfuly",
                updated_user: await updated_user[1][0],
              }
        );
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  static async deleteDepartment(req, res) {
    try {
      let { id } = req.params;
      let findDepartmentById = await DepartmentsModel.findOne({
        where: { dep_id: id },
      });
      if (findDepartmentById == undefined) {
        throw new Error(`Not Found ${id} - Department`);
      } else {
        let now_d = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
        let deleted_department = await DepartmentsModel.update(
          { delete_at: now_d },
          { returning: true, where: { dep_id: id } }
        );
        res.send(
          deleted_department[1][0] == undefined
            ? "Not Deleted"
            : {
                status: 200,
                message: "Deleted Was Successfuly",
                deleted_department: await deleted_department[1][0],
              }
        );
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  static async deleteDirections(req, res) {
    try {
      let { id } = req.params;
      let findDirectionsById = await DirectionsModel.findOne({
        where: { dir_id: id },
      });
      if (findDirectionsById == undefined) {
        throw new Error(`Not Found ${id} - Direction`);
      } else {
        let now_d = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
        let deleted_direction = await DirectionsModel.update(
          { end_date: now_d },
          { returning: true, where: { dir_id: id } }
        );
        res.send(
          deleted_direction[1][0] == undefined
            ? "Not Deleted"
            : {
                status: 200,
                message: "Deleted Was Successfuly",
                deleted_direction: await deleted_direction[1][0],
              }
        );
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }

  static async deletePositions(req, res) {
    try {
      let { id } = req.params;
      let findPositionById = await PositionModel.findOne({
        where: { pos_id: id },
      });
      if (findPositionById == undefined) {
        throw new Error(`Not Found ${id} - Position`);
      } else {
        const deleted_position = await PositionModel.destroy({
          where: { pos_id: id },
        });
        res.send(
          deleted_position == undefined
            ? "Not Deleted"
            : {
                status: 200,
                message: ` ${id} Deleted Was Successfuly`,
                deleted_position: await deleted_position,
              }
        );
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }



  static async deleteGroups(req, res) {
    try {
      let { id } = req.params;
      let findGroupById = await GroupsModel.findOne({
        where: { gr_id: id },
      });
      if (findGroupById == undefined) {
        throw new Error(`Not Found ${id} - Group`);
      } else {
        let now_d = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
        let deleted_group = await GroupsModel.update(
          { end_date: now_d },
          { returning: true, where: { gr_id: id } }
        );
        res.send(
          deleted_group[1][0] == undefined
            ? "Not Deleted"
            : {
                status: 200,
                message: "Deleted Was Successfuly",
                deleted_group: await deleted_group[1][0],
              }
        );
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }






    
  static async deleteUsers(req, res) {
    try {
      let { id } = req.params;
      let findUserById = await UsersModel.findOne({
        where: { user_id: id },
      });
      if (findUserById == undefined) {
        throw new Error(`Not Found ${id} - User`);
      } else {
        let now_d = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
        let deletet_user = await UsersModel.update(
          { left_date:  now_d },
          { returning: true, where: { user_id: id } }
        );
        res.send(
          deletet_user[1][0] == undefined
            ? "Not Deleted"
            : {
                status: 200,
                message: "Deleted Was Successfuly",
                deletet_user: await deletet_user[1][0],
              }
        );
      }
    } catch (error) {
      res.send({ msg: error.message, status: 404, success: false }).status(404);
    }
  }



}
