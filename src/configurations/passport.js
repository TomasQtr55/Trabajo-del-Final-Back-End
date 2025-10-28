import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { envs } from "./envs.js";
import AppDatasource from "../providers/datasource.provider.js";

const userTable = AppDatasource.getRepository('User')

const passportToken = passport
const JWT_SECRET = envs.JWT_SECRET;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}

passportToken.use(
    new Strategy(opts, async (payload, done) => {
        try{

            const user = await userTable.findOne({ where: {idUser: payload.id}})

            if(!user){
                return done(null, false)
            }


            return done(null, user)
        }catch(error) {
            return done(error, false)
        }
    })
)

export default passportToken