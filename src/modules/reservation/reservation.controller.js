import { request, response } from 'express';
import AppDatasource from '../../providers/datasource.provider.js';
import { sendNotificationToUser } from '../../socket/sockets.js';

const reservationTable = AppDatasource.getRepository('Reservation');
const propertyTable = AppDatasource.getRepository('Property');

const createReservation = async (req = request, res = response) => {
  const { propertyId, date } = req.body;
  const clientId = req.user.idUser;

  try {
 
    const property = await propertyTable.findOne({ where: { idProperty: propertyId }, relations: ['seller'] });
    if (!property) {
      return res.status(404).json({ ok: false, msg: 'Propiedad no encontrada' });
    }

    if (property.status !== 'disponible') {
      return res.status(400).json({ ok: false, msg: 'La propiedad no está disponible para reserva' })
    }

    const newReservation = reservationTable.create({ property, cliente: { idUser: clientId }, date, status: 'pendiente'  })

    await reservationTable.save(newReservation);

    

    res.status(201).json({ ok: true, msg: 'Reserva creada correctamente', reservation: newReservation })
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al crear la reserva', error })
  }
};

const getMyReservations = async (req = request, res = response) => {
  const clientId = req.user.idUser;

  try {
    const reservations = await reservationTable.find({
      where: { cliente: { idUser: clientId } },
      relations: ['property'],
    });

    res.status(200).json({ ok: true, reservations });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener reservas', error })
  }
};

const getReservationById = async (req = request, res = response) => {
  const { id } = req.params;
  const clientId = req.user.idUser;

  try {
    const reservation = await reservationTable.findOne({
      where: { idReservation: id },
      relations: ['property', 'cliente'],
    });

    if (!reservation) {
      return res.status(404).json({ ok: false, msg: 'Reserva no encontrada' });
    }

    if (reservation.cliente.idUser !== clientId) {
      return res.status(403).json({ ok: false, msg: 'No puedes acceder a esta reserva' });
    }

    res.status(200).json({ ok: true, reservation });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener reserva', error });
  }
}

const deleteReservation = async (req = request, res = response) => {
  const { id } = req.params;
  const clientId = req.user.idUser;

  try {
    const reservation = await reservationTable.findOne({
      where: { idReservation: id },
      relations: ['property', 'cliente'],
    });

    if (!reservation) {
      return res.status(404).json({ ok: false, msg: 'Reserva no encontrada' });
    }

    if (reservation.cliente.idUser !== clientId) {
      return res.status(403).json({ ok: false, msg: 'No puedes eliminar esta reserva' });
    }


    res.status(200).json({ ok: true, msg: 'Reserva eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al eliminar reserva', error });
  }
};

//se va a encargar de mostrar las reserva que le hicieron a las propiedades
const getReservationsForSeller = async (req = request, res = response) => {
  const sellerId = req.user.idUser;

  try {
    const reservations = await reservationTable
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.property', 'property')
      .leftJoinAndSelect('reservation.cliente', 'cliente')
      .where('property.seller_id = :sellerId', { sellerId })
      .getMany();

    res.status(200).json({ ok: true, reservations });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener reservas del vendedor', error });
  }
};

const updateReservationStatus = async (req, res) => {
  const { idReservation } = req.params;
  const { status } = req.body; 
  const userId = req.user.idUser;

  try {
    // Buscar la reserva con su propiedad y vendedor
    const reservation = await reservationTable.findOne({
      where: { idReservation },
      relations: ["property", "property.seller"],
    });

    if (!reservation) {
      return res.status(404).json({ ok: false, msg: "Reserva no encontrada" });
    }

    // Verificar que la propiedad sea del vendedor autenticado
    if (reservation.property.seller.idUser !== userId) {
      return res.status(403).json({ ok: false, msg: "No puedes modificar una reserva que no pertenece a tus propiedades",});
    }

    // Verificar que el nuevo estado sea válido
    const estadosValidos = ["confirmada", "cancelada"];
    if (!estadosValidos.includes(status)) {
      return res.status(400).json({ ok: false, msg: "Estado inválido. Usa 'confirmada' o 'cancelada'.",});
    }

    // Actualizar el estado de la reserva
    reservation.status = status;
    await reservationTable.save(reservation);

    // Emite la notificación en tiempo real al cliente del estado de su reserva
    const clientId = reservation.cliente.idUser;
    const payload = {
      title: "Estado de reserva",
      message: `Tu reserva (id ${reservation.idReservation}) fue ${status}`,
      reservationId: reservation.idReservation,
      status,
    };
    //envia la notificacion al cliente
    sendNotificationToUser(clientId, payload)

    return res.status(200).json({ ok: true, msg: `Reserva ${status} correctamente`, reservation});
  } catch (error) {
    return res.status(500).json({ok: false, msg: "Error al actualizar el estado de la reserva", error});
  }
};


export const reservationController = {createReservation, getMyReservations, getReservationById, deleteReservation, getReservationsForSeller, updateReservationStatus};

