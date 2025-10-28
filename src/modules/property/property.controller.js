import { request, response } from 'express';

import AppDatasource from '../../providers/datasource.provider.js';

const propertyTable = AppDatasource.getRepository('properties')

const createProperty = async (req = request, res = response) => {

    const  userId  = req.user.idUser // Cuando creamos una nueva propiedad queremos tener el id del vendedor que la creo
    const { title, description, price, location, status } = req.body

    try {
        const newProperty = await propertyTable.save({title, description, price, location, status, seller: {idUser: userId}})

        res.status(201).json({ok: true, user: newProperty, msg:'Usuario creado'})
    } catch(error) {
        res.status(400).json({ok: false, error, msg: 'La propiedad no se creo'})
    }
}

const updateProperty = async (req = request, res = response) =>{

    const {idProperty} = req.params
    const { title, description, price, location, status } = req.body
    const userId = req.user.idUser

    try{
        const property = await propertyTable.findOne({where: {idProperty}})

        if (!property) {
            return res.status(404).json({ok: false, msg: 'propiedad no encontrada'})

        }

        if (property.seller.idUser !== userId){
            return res.status(403).json({ ok: false, msg: 'No puedes editar esta propiedad' });
        }

        property.title = title ?? property.title;
        property.description = description ?? property.description;
        property.price = price ?? property.price;
        property.location = location ?? property.location;
        property.status = status ?? property.status;

        await propertyTable.save(property);

        return res.status(200).json({ ok: true, msg: 'Propiedad actualizada correctamente', property });
    }catch(error){
        return res.status(500).json({ ok: false, msg: 'Error al actualizar la propiedad', error });
    }

}

const findAllProperties = async (req = request, res = response) => {

    const userId = req.user.idUser;

    try{

        const properties = await propertyTable.find({where: {seller: {idUser: userId}}, relations: ['seller']})
        return res.status(200).json({ ok: true, msg: `Propiedes del vendedor ${req.user.username}`, properties });
    }catch (error){
         return res.status(500).json({ ok: false, msg: 'Error al ver las propiedades', error });
    }
}

const findOneProperties = async (req = request, res = response) =>{
    const { idProperty } = req.params;

    try {
        const property = await propertyTable.findOne({ where: { idProperty } });

        if (!property){
            return res.status(404).json({ ok: false, msg: 'Propiedad no encontrada' });
        }
            

        res.status(200).json({ ok: true, property });

    } catch (error) {

        res.status(500).json({ok: false, msg: 'Error al obtener la propiedad', error});
    }
}


const deleteProperty = async (req = request, res = response) => {
    const { idProperty } = req.params;
    const userId = req.user.idUser;

    try {
        const property = await propertyTable.findOne({ where: { idProperty }, relations: ['seller'] });

        if (!property)
            return res.status(404).json({ ok: false, msg: 'Propiedad no encontrada' });

        if (property.seller.idUser !== userId)
            return res.status(403).json({ ok: false, msg: 'No puedes eliminar esta propiedad' });

        await propertyTable.remove(property);

        res.status(200).json({ ok: true, msg: 'Propiedad eliminada correctamente'});

    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error al eliminar la propiedad', error});
    }
};

//perpmite que cualquier usuario pueda ver las propiedades disponibles
const seeAllProperties = async (req = request, res = response) => {

    try{
        const properties = await propertyTable.find( {where: { status: "disponible" }});
         res.status(200).json({ ok: true, message: 'Approved', propiedades: properties });
    }catch(error){
       res.status(500).json({ ok: false, message: 'Error al ver propiedades' });
    }
}

export const propertyController = {
    createProperty, updateProperty, findAllProperties, findOneProperties, deleteProperty, seeAllProperties
}