const { Router } = require('express')
const { check } = require('express-validator')
const { newTodo, getTodos, deleteTodo, updateTodo, getTodosForId, todosConcated } = require('../controllers/todo')
const { validarCampos } = require('../middlewares/validar-campos')
const router = Router()

router.get('/', getTodos)
router.get('/:id', getTodosForId)

router.post('/users-concated', todosConcated)

router.post(
	'/',
	[
		check('title', 'Debe ingresar el titulo de la tarea').not().isEmpty(),
		check('description', 'Debe ingresar la descripcion de la tarea').not().isEmpty(),
		check('priority', 'Debe ingresar la prioridad de la tarea').not().isEmpty(),
		validarCampos,
	],
	newTodo
)

router.post('/:id', updateTodo)

router.delete('/:id', deleteTodo)

module.exports = router
