const express = require('express');
let router = express.Router();
const UserController = require('../controllers/user.controller');
const {
    body,
    param,
} = require('express-validator');
const AuthController = require("../controllers/auth.controller");

router.route('/')
    .post([body('name').isString(),
        body('auth.username').isEmail(),
        body('auth.password').isString(),
        body('auth.profile').optional().isIn(['admin', 'employee'])
    ], AuthController.checkAuthOrNot, UserController.create)
    .get(AuthController.checkAuth, UserController.get);
    // .get(AuthController.checkAuth, AuthController.checkAdmin, UserController.get);

router.route("/deactivate/:id")
    .put(AuthController.checkAuth, AuthController.checkAdmin, [param("id").isMongoId()], UserController.deactivate);

router.route("/activate/:id")
    .put(AuthController.checkAuth, AuthController.checkAdmin, [param("id").isMongoId()], UserController.activate);

router.route('/:id')
    .get(AuthController.checkAuth, AuthController.checkAdmin, [param("id").isMongoId()], UserController.getOne)
    .put(AuthController.checkAuth, AuthController.checkAdmin, [param("id").isMongoId()], UserController.update)
    .delete(AuthController.checkAuth, AuthController.checkAdmin, [param("id").isMongoId()], UserController.delete);

module.exports = router;