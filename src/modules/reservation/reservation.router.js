import { Router } from "express";
import { reservationController } from "./reservation.controller.js";
import { createReservationSchema } from "./schema/reservation.schema.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/authRoles.middleware.js";
import { validate } from "../../middlewares/validator.middleware.js";


const reservationRouter = Router();

// rutas que va a poder acceder solo el cliente
//El cliente que se logueo crea una reserva de una propiedad disponible
reservationRouter.post('/cliente/reservation', authMiddleware, authorizeRoles('cliente'), validate(createReservationSchema), reservationController.createReservation)
//El cliente puede mirar todas sus reservas propias
reservationRouter.get('/cliente/reservations', authMiddleware, authorizeRoles('cliente'), reservationController.getMyReservations);
//El cliente puede mirar una reserva, pasandola por id
reservationRouter.get('/cliente/reservation/:id', authMiddleware, authorizeRoles('cliente'), reservationController.getReservationById);

//ruta que permite al vendedor ver las reservas que le hicieron a sus propiedades y tambien a los clientes
reservationRouter.get('/vendedor/reservation', authMiddleware, authorizeRoles('vendedor'), reservationController.getReservationsForSeller)
//ruta que permite al vendedor confirmar las reservas de sus
reservationRouter.patch('/vendedor/estado/reservation/:idReservation',authMiddleware, authorizeRoles('vendedor'), reservationController.updateReservationStatus)
export default reservationRouter;