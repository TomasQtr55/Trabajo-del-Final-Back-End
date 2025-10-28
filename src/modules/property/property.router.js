import { Router } from "express";
import { propertyController } from "./property.controller.js";
import { updatePropertySchema } from "./schema/updateProperty.schema.js";
import { createPropertySchema } from "./schema/property.schema.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/authRoles.middleware.js";
import { validate } from "../../middlewares/validator.middleware.js";

const propertyRouter = Router();

//rutas para el vendedor autenticado
//El vendedor que se logueo puede crear propiedades
propertyRouter.post('/vendedor/propiedad', authMiddleware, authorizeRoles('vendedor'), validate(createPropertySchema), propertyController.createProperty)
//El vendedor puede actualizar sus propiedades
propertyRouter.put('/vendedor/propiedad/:idProperty', authMiddleware, authorizeRoles('vendedor'), validate(updatePropertySchema), propertyController.updateProperty)
//El vendedor puede mirar todas las propiedas que tiene a su cargo y a creado
propertyRouter.get('/vendedor/propiedades', authMiddleware, authorizeRoles('vendedor'), propertyController.findAllProperties)
// el vendedor puede ver la propiedad que quiera pero le tiene que pertenecer 
propertyRouter.get('/vendedor/propiedad/:idProperty', authMiddleware, authorizeRoles('vendedor'), propertyController.findOneProperties)
// el vendedor puede eliminar una propiedad
propertyRouter.delete('/vendedor/propiedad/:idProperty', authMiddleware, authorizeRoles('vendedor'), propertyController.deleteProperty)


// esta ruta permite ver todas las propiedades
propertyRouter.get('/propiedades', authMiddleware, propertyController.seeAllProperties)

export default propertyRouter;