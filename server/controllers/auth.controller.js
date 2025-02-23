const User = require('../models/user.model');
const {
    validationResult
} = require('express-validator');
const AuthMessages = require("../messages/auth.messages");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const CONFIG = require("../config/config");

exports.getInfo = (req, res) => {
    let message = AuthMessages.success.s1;
    message.body = req.user;
    return res.status(message.http).send(message);
}

exports.login = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    let username = req.body.username;
    let password = req.body.password;

    try {
        const user = await User.findOne({ "auth.username": username });
        
        if (!user || !bcrypt.compareSync(password, user.auth.password))
            return res.header("Authorization", null).status(AuthMessages.error.e0.http).send(AuthMessages.error.e0);

        let payload = {
            pk: user.auth.public_key
        };

        let options = {
            expiresIn: CONFIG.auth.expiration_time,
            issuer: CONFIG.auth.issuer
        };

        let token = JWT.sign(payload, user.auth.private_key, options);

        let message = AuthMessages.success.s0;
        message.body = user;
        return res.header("Authorization", token).status(message.http).send(message);

    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message || "An unexpected error occurred."
        });
    }
};

exports.checkAuth = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).send({
                message: "Unauthorized",
                error: "Token is missing or malformed"
            });
        }

        token = token.split(" ")[1];

        let payload = JWT.decode(token);
        if (!payload || !payload.pk) {
            return res.status(401).send({
                message: "Invalid token",
                error: "Token is malformed or missing 'pk' property"
            });
        }

        let user = await User.findOne({ "auth.public_key": payload.pk });
        if (!user) {
            return res.status(401).send({
                message: "Unauthorized",
                error: "User not found"
            });
        }

        JWT.verify(token, user.auth.private_key, (error, decoded) => {
            if (error) {
                return res.status(401).send({
                    message: "Invalid token",
                    error: "Token verification failed"
                });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message || "An unexpected error occurred."
        });
    }
};

exports.checkAuthOrNot = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return next();
        }

        token = token.split(" ")[1];

        let payload = JWT.decode(token);
        if (!payload || !payload.pk) {
            return res.status(401).send({
                message: "Invalid token",
                error: "Token is malformed or missing 'pk' property"
            });
        }

        let user = await User.findOne({ "auth.public_key": payload.pk });
        if (!user) {
            return res.status(401).send({
                message: "Unauthorized",
                error: "User not found"
            });
        }

        JWT.verify(token, user.auth.private_key, (error, decoded) => {
            if (error) {
                return res.status(401).send({
                    message: "Invalid token",
                    error: "Token verification failed"
                });
            }

            req.user = user;
            next();
        });

    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message || "An unexpected error occurred."
        });
    }
};


exports.checkAdmin = (req, res, next) => {
    if (req.user && req.user.auth.profile === 'admin') {
        next();
    } else {
        return res.status(403).send({ message: 'Permission Denied. Only admin can perform this action.' });
    }
};


