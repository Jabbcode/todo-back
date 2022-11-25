const { Schema, model } = require('mongoose')

const TodoSchema = Schema({
	title: {
		type: String,
		require: true,
	},
	description: {
		type: String,
		require: true,
	},
	done: {
		type: Boolean,
		require: true,
	},
	priority: {
		type: String,
		require: true,
	},
	date: {
		type: Date,
		require: true,
	},
	userId: {
		type: Schema.ObjectId,
		ref: 'User',
	},
})

module.exports = model('Todo', TodoSchema)
