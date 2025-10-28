import { EntitySchema } from "typeorm";

export const PropertyEntity = new EntitySchema({
    name: 'Property',
    tableName: 'properties',
    columns: {
        idProperty: {
            primary: true,
            generated: true,
            type: 'int'
        },
        title: {
            type: 'varchar',
            nullable: false
        },
        description: {
            type: 'text',
            nullable: false
        },
        price: {
            type: 'int',
            nullable: false
        },
        location: {
            type: 'varchar',
            nullable: false
        },
        status: {
            type: 'enum',
            enum: ['disponible', 'reservada', 'vendida'],
            default: 'disponible'
        },
        
    },
    relations: {
    seller: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "seller_id" },
      onDelete: "SET NULL",
      eager: true,
    },
    reservations: {
      type: "one-to-many",
      target: "Reservation",
      inverseSide: "property",
    },
  }
})