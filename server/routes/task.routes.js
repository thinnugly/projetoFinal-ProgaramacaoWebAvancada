const express = require('express');
const router = express.Router();
const {
    body,
    param,
} = require('express-validator');
const TaskController = require('../controllers/task.controller');
const AuthController = require('../controllers/auth.controller');

router.route('/')
    .post([
        body('title').isString(),
        body('description').isString(),
        body('due').isDate(),
        body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
        body('attachedTo').isMongoId().withMessage('AttachedTo must be a valid user ID'),
    ], AuthController.checkAuth, AuthController.checkAdmin, TaskController.create)
    .get(AuthController.checkAuth, TaskController.get);

router.route('/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], TaskController.getOne)
    .put(AuthController.checkAuth, [param('id').isMongoId()], TaskController.update)
    .delete(AuthController.checkAuth, AuthController.checkAdmin, [param('id').isMongoId()], TaskController.delete);

module.exports = router;