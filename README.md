# 🏠 Inmobiliaria del Alto Valle

## 📋 Descripción general

"Inmobiliaria del Alto Valle" es una API desarrollada con **Node.js**, que permite gestionar propiedades y reservas entre **vendedores** y **clientes**.  
El sistema integra **notificaciones en tiempo real** mediante **Socket.IO**, para informar al cliente cuando su reserva ha sido **confirmada** o **cancelada**.

---
## variables de entorno :
# Puerto del servidor
PORT=3000

# Configuración de la base de datos
DATABASE=inmobiliariadb
DB_USER=root
DB_PASS=
DB_PORT=3306
DB_HOST=localhost

# Clave secreta para la generación de tokens JWT
JWT_SECRET=G7$kL9@z!vQ3rT#xW2pN8eY6uB$1mC4d

---

## ⚙️ Tecnologías utilizadas

- Node.js  
- Express  
- MySQL  
- TypeORM  
- Socket.IO  
- JWT (jsonwebtoken)  
- Passport  
- Bcrypt  
- JOI (validaciones)  
- Dotenv  
- Nodemon

---

## 👥 Roles del sistema

- **Cliente**:  
  - Puede registrarse e iniciar sesión.  
  - Ver propiedades disponibles.  
  - Crear reservas.  
  - Recibir notificaciones cuando el vendedor confirme o cancele su reserva.

- **Vendedor**:  
  - Puede iniciar sesión.  
  - Publicar propiedades.  
  - Ver las reservas de sus propiedades.  
  - Confirmar o cancelar reservas (dispara una notificación al cliente).

---

## Diagramas del sistema

### 🔹 Modelo Entidad–Relación
![MER](./doc/DER%20inmobiliaria.drawio.png)


### 🔹 Diagrama de casos de uso
![Casos de uso](./doc/caso%20de%20uso%20inmobiliaria.drawio.png)

### 🔹 Diagrama de clases
![Clases](./doc/diagrama%20de%20clases.drawio.png)

### 🔹 Diagrama de secuencia vendedor
![Secuencia](./doc/diagrama%20de%20secuencia%20vendedor.jpg)

### 🔹 Diagrama de secuencia cliente
![Secuencia](./doc/diagrama%20de%20secuencia%20cliente.jpg)

