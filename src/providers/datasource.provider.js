import { DataSource } from "typeorm";
import { envs } from "../configurations/envs.js";
import { UserEntity } from "../modules/user/entity/user.entity.js";
import { ReservationEntity } from "../modules/reservation/entity/reservation.entity.js";
import { PropertyEntity } from "../modules/property/entity/property.entity.js";

const AppDatasource = new DataSource({
    type:'mysql',
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USER,
    password: envs.DB_PASS,
    database: envs.DATABASE,

    synchronize: true,
    logger: true,
    entities: [UserEntity, ReservationEntity, PropertyEntity]
});


export default AppDatasource;