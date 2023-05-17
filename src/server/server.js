import express from "express";
import config from 'config';
import colors from 'colors'
import '../utils/sync.js'
import '../utils/sequelize.js'
import indexRouter from "../modules/index.router.js";

const PORT = config.get('port') || 3000;


const app = express();
app.use(express.json())
app.use(indexRouter);



app.listen(PORT, console.log(`Server running ${PORT}`.blue.bold))