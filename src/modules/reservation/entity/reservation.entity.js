import { EntitySchema } from "typeorm";

export const ReservationEntity = new EntitySchema({
  name: "Reservation",
  tableName: "reservations",
  columns: {
    idReservation: {
      primary: true,
      generated: true,
      type: "int",
    },
    date: {
      type: "timestamp",
      nullable: false,
    },
    status: {
      type: "enum",
      enum: ["pendiente", "confirmada", "cancelada"],
      default: "pendiente",
    },
  },
   relations: {
    property: {
      type: "many-to-one",
      target: "Property",
      joinColumn: { name: "property_id" },
      eager: true,
    },
    cliente: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "client_id" },
      eager: true,
    },
  }
});