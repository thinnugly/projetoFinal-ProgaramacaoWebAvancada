const express = require('express');
const router = express.Router();
const {
    body,
    param,
} = require('express-validator');
const CommentController = require('../controllers/comment.controller');
const AuthController = require('../controllers/auth.controller');


router.route('/')
    .post([
        body('taskId').isMongoId().withMessage('Task must be a valid user ID'),
        body('message').isString()
    ], AuthController.checkAuth, CommentController.create);

router.route('/:id')    
    .get(AuthController.checkAuth, [param("id").isMongoId()], CommentController.get);

module.exports = router;    