import models from "../references/associations.js";
import { VERIFY } from "./jwt.js";
import sequelize from "./sequelize.js";

const {
  CenterModel,
  DepartmentsModel,
  DirectionsModel,
  PositionModel,
  UsersModel,
  ChecksModel,
  GroupsModel,
  IncomesModel,
  OutlayModel,
} = models;
[
  CenterModel,
  DepartmentsModel,
  DirectionsModel,
  PositionModel,
  UsersModel,
  ChecksModel,
  GroupsModel,
  IncomesModel,
  OutlayModel,
].map(async (model) => await model.sync({ alter: true }));

// let x = await sequelize.query(`SELECT d.dep_name,  u.* FROM departments d join positions p on d.dep_id=p.dep_ref_id join users u on u.pos_ref_id=p.pos_id WHERE p.pos_id=${1}`, {raw : true})
// let x=  await sequelize.query (`SELECT g.*, dr.* FROM departments d join directions dr on d.dep_id=dr.dep_ref_id join groups g on g.dir_ref_id=dr.dir_id where dr.dir_name ilike '%${'n'}%' and g.end_date  is null and dr.end_date is null`)
// let x = await sequelize.query(`SELECT d.dep_name, p.*,  u.*  FROM  departments d join positions p on d.dep_id=p.dep_ref_id join users u on u.pos_ref_id=p.pos_id WHERE p.pos_name ilike '%${'admin'}%'`, {raw : true})

// console.log(await x[0]);

// let x =await  sequelize.query(`SELECT d.dep_id, d.dep_name, d.create_at, d.center_ref_id, p.pos_name, p.salary oylik_maosh , dr.dir_name    FROM departments d join positions p on d.dep_id=p.dep_ref_id  join  directions dr on dr.dep_ref_id=d.dep_id WHERE  d.dep_id = ${1} and   d.delete_at IS NULL  AND dr.end_date IS NULL`)
// let x = await sequelize.query( `SELECT g.*, dr.* FROM departments d join directions dr on d.dep_id=dr.dep_ref_id join groups g on g.dir_ref_id=dr.dir_id where g.end_date  is null and dr.end_date is null`)
// let x = await sequelize.query(`SELECT d.dep_name,  u.* FROM departments d join positions p on d.dep_id=p.dep_ref_id join users u on u.pos_ref_id=p.pos_id WHERE d.delete_at IS NULL AND  p.pos_name ilike '%${'admin'}%' AND u.left_date IS NULL`)
// console.log(await x[0]);

// xali controllerda yo'q bular
let groups = await sequelize.query(
  `SELECT g.*, d.dir_name as course_name FROM groups g join directions d on g.dir_ref_id=d.dir_id WHERE d.end_date IS NULL AND g.end_date IS NULL`
);
// console.log(await groups[0]);



// admin uhchun /users

// let users = await sequelize.query(`SELECT u.user_id, u.first_name, u.last_name, u.gender, u.email, u.contact, g.gr_id, g.gr_number FROM users u  LEFT JOIN groups  g  ON u.group_ref_id= g.gr_id WHERE g.end_date IS NULL AND u.left_date IS NULL`)

// console.log(await users[0]);

//admin uchun /users?group=4&onsite=off

let notStudying = await sequelize.query(`SELECT * FROM users u JOIN groups g ON g.gr_id = u.group_ref_id WHERE u.left_date IS NOT NULL AND g.gr_id = 1`);
// console.log( await notStudying[0]);
// notStudying[0][0] = undefined
// if(notStudying[0][0]==undefined){
//   console.log('chiqib ketgan o\'quvchi yo\'q');
// }else{
//   console.log(await notStudying[0]);
// }




// admin uchun username bilan userlarni qidirish
// let findUserByUsername = await sequelize.query(`SELECT * FROM users WHERE first_name ilike '%${'s'}%' OR last_name ilike '%${'boy'}%' AND left_date IS NULL`);
// console.log(await findUserByUsername[0]);

//admin contact
// let findUserByContact = await sequelize.query(`SELECT * FROM users WHERE contact ilike '%${'1129'}%' AND left_date IS NULL`);
// console.log(await findUserByContact[0]);

//admin gender orqali qidirish
// let findUserByGender = await sequelize.query(`SELECT * FROM users WHERE gender = 1 AND left_date IS NULL`);
// console.log(await findUserByGender[0]);

// let usersProfile = await sequelize.query(`SELECT u.user_id, u.first_name, u.last_name, u.gender, u.email, u.contact, g.gr_id, g.gr_number FROM users u  LEFT JOIN groups  g  ON u.group_ref_id= g.gr_id WHERE g.end_date IS NULL AND u.left_date IS NULL AND u.user_id = 1`)

// oquvchi uchun /users
let usersProfile = await sequelize.query(
  `SELECT d.dir_name direction_name, u.user_id,u.left_date,  u.first_name, u.last_name, u.gender, u.email, u.contact , p.pos_name, g.gr_number FROM users u LEFT  JOIN incomes i on i.user_ref_id = u.user_id  JOIN positions p ON p.pos_id = u.pos_ref_id LEFT JOIN groups g ON g.gr_id = u.group_ref_id LEFT JOIN directions d ON d.dir_id = g.dir_ref_id WHERE p.pos_id = 4 AND u.user_id = 3`
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

// console.log(await result);

//

// teacher uchun /users
// SELECT d.dir_name direction_name, u.user_id,u.left_date,  u.first_name, u.last_name, u.gender, u.email, u.contact , p.pos_name, g.gr_number FROM users u LEFT  JOIN incomes i on i.user_ref_id = u.user_id  JOIN positions p ON p.pos_id = u.pos_ref_id LEFT JOIN groups g ON g.gr_id = u.group_ref_id LEFT JOIN directions d ON d.dir_id = g.dir_ref_id WHERE p.pos_id = 4 AND u.user_id = 3
// let teacherInfo = await sequelize.query(`SELECT u.first_name, u.last_name, u.gender, u.email, u.contact,  p.pos_name FROM users  u JOIN positions p ON p.pos_id = u.pos_ref_id   JOIN directions d ON d.  WHERE pos_ref_id = 2 OR p.pos_name ilike '%${'teacher'}%' AND user_id = 2 `)
// let teacherInfo = await sequelize.query(
  // console.log(teacherInfo[0]);
//   `SELECT d.dir_name direction_name, u.user_id,u.left_date,  u.first_name, u.last_name, u.gender, u.email, u.contact ,p.salary, p.pos_name, g.gr_number FROM users u LEFT  JOIN incomes i on i.user_ref_id = u.user_id  JOIN positions p ON p.pos_id = u.pos_ref_id LEFT JOIN groups g ON g.gr_id = u.group_ref_id LEFT JOIN directions d ON d.dir_id = g.dir_ref_id WHERE p.pos_id = 2 OR p.pos_name ilike '%${"teacher"}%' AND u.user_id = 2`
// );

// teacher /group guruhini olish
// let studentsNum = await sequelize.query(`SELECT count(*) from users u JOIN groups g ON  u.group_ref_id = g.gr_id WHERE g.gr_id = 3 AND  u.pos_ref_id = 4`)
// let teacherGroup = await sequelize.query(`SELECT * FROM directions d JOIN groups g ON d.dir_id = g.dir_ref_id JOIN users u ON u.group_ref_id = g.gr_id WHERE u.user_id = 2 AND u.pos_ref_id = 2`)
// let tr = await teacherGroup[0][0]

// let response = {
// teacher_group : tr?.first_name,
// guruh_raqam : tr?.gr_number,
// direction : tr?.dir_name,
// oylik_tolov : tr?.salary,
// student_count : studentsNum[0][0].count
// }
// console.log(response);

// console.log(await response);


// let teacherProfile = await sequelize.query(`SELECT u.first_name, u.last_name, u.gender, u.contact, u.email,p.salary oylik_maosh ,d.dir_name  yonalish, g.gr_number guruh_raqami  FROM positions p JOIN users u ON p.pos_id = u.pos_ref_id LEFT JOIN groups g ON g.gr_id = u.group_ref_id  JOIN directions d ON d.dir_id = g.dir_ref_id WHERE p.pos_id = 2 AND u.user_id = 2 `)
// console.log(teacherProfile[0][0]);





// console.log(await teachers[0]);





let groupsById = await sequelize.query(
  `SELECT g.gr_id, g.gr_number,  g.begin_date, u.first_name, u.last_name, u.email,u.gender, u.contact, d.dir_name, d.duration FROM directions d JOIN groups g ON d.dir_id = g.dir_ref_id LEFT JOIN users u on u.group_ref_id = g.gr_id WHERE g.gr_id = 3 AND u.pos_ref_id = 4`
  );






  
  
  // let teachers = await sequelize.query(`SELECT * FROM users u JOIN positions p ON u.pos_ref_id = p.pos_id WHERE p.pos_id = 2 AND u.group_ref_id = 3 AND u.user_id = 3`);
// let all_res = {
//   ustoz : {
//     first_name : teachers[0][0].first_name,
//     last_name : teachers[0][0].last_name
//   },
//   yonalish : groupsById[0][0].dir_name,
//   guruh_raqam : groupsById[0][0].gr_number,
//   dars_vaqti : groupsById[0][0].duration
// }





// console.log(all_res);


//bugalter /incomes buni faqat bugalter get qila oladi
let incomesForOnlyAccountant = await sequelize.query(`SELECT * FROM incomes i  LEFT JOIN users u ON i.user_ref_id = u.user_id`);
let all_kirim = await sequelize.query(`SELECT sum(i.amount) FROM incomes i  LEFT JOIN users u ON i.user_ref_id = u.user_id`);


let full_res = {
barcha_kirimlar : all_kirim[0][0].sum,
data : await incomesForOnlyAccountant[0]
}
// console.log(full_res);


// console.log(incomesForOnlyAccountant[0]);
// // /incomes?month=1
// let monthAgoIncomes = await sequelize.query(`SELECT i.incom_id, i.reason, i.amount, i.inc_time, u.first_name, u.last_name, u.gender, u.email FROM incomes i  LEFT JOIN users u ON i.user_ref_id = u.user_id WHERE i.inc_time between now()::date-INTERVAL '1 month' AND now()  `)
// console.log(monthAgoIncomes[0]);



// bugalter uchun    /outlay 
let all_outlays = await sequelize.query(`SELECT * FROM outlay`);
let all_outlay_sum = await sequelize.query(`SELECT sum(amount) FROM outlay`);
// const respons = {
// barcha_chiqimlar_puli : all_chiqim[0][0].sum,
// data : outlayForOnlyAccountant[0]
// }
// console.log(respons);

// oy oldingi /oylay?month=1  bugalter uchun
// let monthAgoOutlay = await sequelize.query(`SELECT * FROM outlay WHERE out_time between now()::date-INTERVAL '1 month' AND now() `);
// let all_chiqimMonthAgo = await sequelize.query(`SELECT sum(amount) FROM outlay WHERE out_time = (select now()::date-INTERVAL '1 month')`);

// let respons = {
// chiqimlar : all_chiqimMonthAgo[0][0].sum,
// data : monthAgoOutlay[0]
// }

// console.log(respons);
 

// console.log(outlayForOnlyAccountant[0]);
// console.log(all_chiqim[0]);







// console.log(await studentsNum[0][0].count);

// console.log(await teacherInfo[0]);

// teacher uchun /groups
// let teacherGroup = await sequelize.query(`SELECT d.dir_name direction_name, g.gr_number guruh_raqami, u.first_name, u.email FROM groups g JOIN directions d ON g.dir_ref_id = d.dir_id JOIN users u ON u.group_ref_id = g.gr_id WHERE u.user_id = 2 AND u.pos_ref_id = 2`);



// let findUser = await UsersModel.findOne({where : {email : "eshmat@gmail.com", contact : "+9989876543"}, raw : true})







// // let find_user
// let a = await sequelize.query(`SELECT * FROM groups g JOIN users u ON g.gr_id = u.group_ref_id WHERE u.user_id = 2`)
// let b = 
// console.log(await a[0]);

let as = [3]
let findStudent = await sequelize.query(`SELECT user_id FROM users u JOIN groups g ON u.group_ref_id = g.gr_id WHERE u.pos_ref_id = 4 AND g.gr_id = 3`);
let mapped= findStudent[0].map(el=>{
  return el.user_id
})



// console.log(await ChecksModel.findAll());
// console.log(mapped);
// console.log(VERIFY('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2ODE3MzAzMzF9.qrDXrwcmmvar7brEv3C0WfEzX3Qn5wcPAmYm70LEncM'));
// console.log(mapped.every(e=>e == as));
