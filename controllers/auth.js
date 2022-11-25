const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')
const User = require('../models/User')

const login = async (req, res) => {
	const { email, password } = req.body

	try {
		const userDB = await User.findOne({ email })

		if (!userDB) {
			return res.status(400).json({
				ok: false,
				msg: 'Usuario o contraseña Invalidos',
			})
		}

		const validPassword = bcrypt.compareSync(password, userDB.password)

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Usuario o contraseña Invalidos',
			})
		}

		const token = await generarJWT(userDB.id, userDB.name)

		res.json({
			id: userDB.id,
			username: userDB.username,
			email: userDB.email,
			todoUserId: userDB.todoUserId,
			token,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		})
	}
}

const register = async (req, res) => {
	const { email, password } = req.body

	try {
		const userDB = await User.findOne({ email })

		if (userDB) {
			return res.status(400).json({
				ok: false,
				msg: 'Correo electronico ya esta en uso',
			})
		}

		newUser = new User(req.body)

		const salt = bcrypt.genSaltSync()
		newUser.password = bcrypt.hashSync(password, salt)

		await newUser.save()

		const token = await generarJWT(newUser.id, newUser.name)

		res.status(201).json({
			id: newUser._id,
			username: newUser.username,
			email: newUser.email,
			todoUserId: newUser.todoUserId,
			token,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		})
	}
}

const addUserId = async (req, res) => {
	const { email, userId } = req.body

	try {
		const userDB = await User.findById(userId)
		const anotherUser = await User.findOne({ email })

		if (!userDB) {
			return res.status(400).json({
				ok: false,
				msg: 'Este Correo electronico no existe',
			})
		}

		if (!anotherUser) {
			return res.status(400).json({
				ok: false,
				msg: 'Seguro que su amigo esta inscrito?',
			})
		}

		userDB.todoUserId.push(anotherUser._id)

		userDB.save()

		return res.status(201).json({
			msg: 'Agregado correctamente',
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		})
	}
}

const revalidarToken = async (req, res) => {
	const { uid, name } = req

	const token = await generarJWT(uid, name)

	res.json({
		ok: true,
		msg: 'Token renovado',
		token,
	})
}

module.exports = {
	login,
	register,
	addUserId,
	revalidarToken,
}
