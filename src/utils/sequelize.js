import { Sequelize } from "sequelize";
import config from "config";
import colors from 'colors'
const sequelize = new Sequelize(
  config.get('url_db'),
  {
    logging: false
  }
);

(async function () {
  try {
    await sequelize.authenticate();
    console.log("Connection database!".underline.bold);
  } catch (er) {
    console.log(er);
  }
})();

export default sequelize;

