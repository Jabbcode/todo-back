const { Router } = require('express')
const { check } = require('express-validator')
const { login, register, revalidarToken, addUserId } = require('../controllers/auth')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const router = Router()

router.post(
	'/login',
	[
		check('email', 'El correo electronico es obligatorio').isEmail(),
		check('password', 'la contraseña es obligatoria').not().isEmpty(),
		check('password', 'La constraseña debe contener minimo 6 caracteres').isLength(6),
		validarCampos,
	],
	login
)

router.post(
	'/add-user-id',
	[
		check('email', 'Debe identificar que usuario sera agregado').isEmail(),
		check('userId', 'El correo electronico es obligatorio ').not().isEmpty(),
	],
	addUserId
)

router.post(
	'/register',
	[
		check('username', 'El nombre es obligatorio').not().isEmpty(),
		check('email', 'El correo electronico es obligatorio').isEmail(),
		check('password', 'la contraseña es obligatoria').not().isEmpty(),
		check('password', 'La constraseña debe contener minimo 6 caracteres').isLength(6),
		validarCampos,
	],
	register
)

router.get('/renew', validarJWT, revalidarToken)

module.exports = router
