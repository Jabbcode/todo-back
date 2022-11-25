const Todo = require('../models/Todo')
const User = require('../models/User')

const getTodos = async (req, res) => {
	try {
		const todos = await Todo.find().populate('userId').populate({ path: 'userId', select: 'username email' })

		return res.json(todos)
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		})
	}
}

const getTodosForId = async (req, res) => {
	const { id } = req.params

	try {
		const todos = await Todo.find({})
			.where('userId')
			.ne([])
			.equals(id)
			.populate({ path: 'userId', select: 'username email todoUserId' })
			.exec()

		return res.json(todos)
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		})
	}
}

const todosConcated = async (req, res) => {
	const { email } = req.body

	try {
		let todos = []
		const userDB = await User.findOne({ email })

		if (!userDB) {
			return res.status(400).json({
				ok: false,
				msg: 'El correo electronico no existe',
			})
		}

		for (let i = 0; i < userDB.todoUserId.length; i++) {
			todos = todos.concat(
				await Todo.find({})
					.where('userId')
					.ne([])
					.equals(userDB.todoUserId[i])
					.populate({ path: 'userId', select: 'username email todoUserId' })
					.exec()
			)
		}

		console.log(todos)

		return res.json(todos)
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		})
	}
}

const newTodo = async (req, res) => {
	const { title, description, priority, userId } = req.body

	try {
		const newTodo = new Todo({
			title,
			description,
			priority,
			done: false,
			date: new Date(),
			userId,
		})

		newTodo.save()

		return res.status(201).json(newTodo)
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		})
	}
}

const updateTodo = async (req, res) => {
	const { checked } = req.body
	const { id } = req.params

	try {
		const updateTodo = await Todo.findById(id)

		updateTodo.done = checked

		updateTodo.save()

		return res.status(200).json({
			msg: 'Updated successfully',
			todo: updateTodo,
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		})
	}
}

const deleteTodo = async (req, res) => {
	const { id } = req.params

	try {
		await Todo.findByIdAndDelete(id)

		return res.status(200).json({
			msg: 'Deleted successfully',
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			ok: false,
			msg: 'Error en el servidor',
		})
	}
}

module.exports = {
	getTodos,
	getTodosForId,
	todosConcated,
	newTodo,
	updateTodo,
	deleteTodo,
}
