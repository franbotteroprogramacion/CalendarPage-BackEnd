const { response } = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require( '../models/Usuario' )
const { generarJWT } = require('../helpers/jwt')


const crearUsuario = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email })

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: ' Un usuario existe con este correo'
            });
        }

        usuario = new Usuario( req.body );

        //encriptar contraseña
        
        const salt = bcrypt.genSaltSync() //el nro que vaya dentro del parentesis es la cantidad de vueltas para mejorar la contraseña. Mientras mas grande sea mayor es la complejidad y nivel de procesamiento. Por defecto es 10
        
        
        usuario.password = bcrypt.hashSync( password, salt );
        await usuario.save();

        
        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name)

        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log( error )
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const loginUsuario = async( req, res = response ) => {

    
    const {  email, password } = req.body

    try {

        const usuario = await Usuario.findOne({ email })

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: ' El usuario no existe con ese email '
            });
        }

        //confirmar los password
        const validPassword = bcrypt.compareSync( password, usuario.password )

        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: ' Password incorrecto '
            })
        }

        //Generar nuestro JWT

        const token = await generarJWT( usuario.id, usuario.name)

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log( error )
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })        
    }
}

const revalidarToken = async( req, res = response ) =>{

    const uid = req.uid
    const name = req.name

    //generar un nuevo JWT y retornarlo en esta peticion
    const token = await generarJWT( uid, name ) 

    res.json({
        ok:true,
        uid,
        name,
        token
        
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}