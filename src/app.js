import express from "express"
import { envs } from "./configurations/envs.js"
import passportToken from "./configurations/passport.js";
import userRouter from "./modules/user/user.router.js";
import propertyRouter from "./modules/property/property.router.js";
import reservationRouter from "./modules/reservation/reservation.router.js";


const app = express();

app.use(express.json());
app.use(passportToken.initialize())

app.set('port', envs.PORT);
app.use('/', userRouter)
app.use('/', propertyRouter)
app.use('/', reservationRouter)


export default app;