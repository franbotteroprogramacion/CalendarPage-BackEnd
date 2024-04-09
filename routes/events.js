const { Router } = require("express");
const { validarCampos } = require("../middlewares/validar-campos")
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos, eliminarEvento, actualizarEvento, crearEvento } = require('../controllers/events')
const { check } = require('express-validator')
const { isDate } = require('../helpers/isDate')


/*
    Event Routes
    /api/events
*/

const router = Router()

router.use( validarJWT )

//todas tienen que pasar por la validacion del JWT
// Obtener eventos
router.get('/', getEventos)

// Crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ],
     crearEvento)

// Actualizar evento
router.put('/:id', actualizarEvento)

// borrar evento
router.delete('/:id', eliminarEvento)

module.exports = router