import { EntitySchema } from "typeorm";

export const UserEntity = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        idUser:{
            primary: true,
            generated: true,
            type: 'int'
        },
        username:{
            type: 'varchar',
            nullable: false
        },
        password:{
            type: 'varchar',
            nullable: false
        },
        role:{
            type: 'enum',
            nullable: false,
            enum: ['vendedor', 'cliente'],
            default: 'cliente'
        },
       
    },
    relations: {
    properties: {
      type: "one-to-many",
      target: "Property",
      inverseSide: "seller", // vincula con Property.seller
    },
    reservations: {
      type: "one-to-many",
      target: "Reservation",
      inverseSide: "cliente", // vincula con Reservation.cliente
    },
  }
});