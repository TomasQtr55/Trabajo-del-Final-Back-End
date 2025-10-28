import { request, response } from 'express';
import * as bcrypt from 'bcrypt';
import AppDatasource from '../../providers/datasource.provider.js';
import jwt from 'jsonwebtoken';
import { envs } from '../../configurations/envs.js';


const userTable = AppDatasource.getRepository('User');


const register = async (req = request, res = response) =>{

    const {username, password, role} = req.body;
    const hashPassword = await bcrypt.hash(password, 12);

    try {
        const newUser = await userTable.save({username, password: hashPassword, role});

        res.status(201).json({ok: true, user: {username, password:"*****", role}, msg:'Usuario creado'})

    } catch (error) {
        res.status(400).json({ok: false, error, msg: 'El usuario no se creo'})
    }

}

const login = async (req = request, res = response) => {
  const {username, password} = req.body

  const user = await userTable.findOne({ where: {username}})

  if (!user) {
    res.status(404).json('usuario no encontrado');
    return;
  }

  const isPassword = await bcrypt.compare(password, user.password)

  if (!isPassword) {
    res.status(401).json('contraseña incorrecta');
    return;
  }

  const payload = { id: user.idUser, username: user.username}

  const token = jwt.sign(payload, envs.JWT_SECRET, {
    expiresIn: '1h'
  })

  res.status(200).json({ok: true, msg: "Login", metadata: {user: {...user, password:'***'}, token}})

};

const findAll = async (req = request, res = response) => {

    try {
        const users = await userTable.find();
        res.status(200).json({ ok: true, message: 'Approved', data: users });
        console.log(req.user)
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
};

export const userController = { register, login, findAll };