const User = require('../models/user.model');
const {
    validationResult
} = require('express-validator');
const UserMessages = require("../messages/user.messages");
const JWT = require("jsonwebtoken");
const CONFIG = require("../config/config");
const bcrypt = require('bcryptjs');

exports.get = async (req, res) => {
    try {
        const users = await User.find(req.query);

        let message = UserMessages.success.s2;
        if (users.length === 0) message = UserMessages.success.s5;

        message.body = users;
        return res.status(message.http).send(message);
    } catch (error) {
        console.error(`Error retrieving users. Please try again later: ${error}.`);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


exports.getOne = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const user = await User.findOne({ _id: req.params.id });

        if (!user) return res.status(UserMessages.error.e1.http).send(UserMessages.error.e1);

        let message = UserMessages.success.s2;
        message.body = user;
        return res.status(message.http).send(message);

    } catch (error) {
        console.error(`Error fetching user: ${error}`);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


exports.create = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const existingUser = await User.findOne({ "auth.username": req.body.auth.username });
        if (existingUser) return res.status(UserMessages.error.e0.http).send(UserMessages.error.e0);

        let profile = 'employee'; 

        if (req.user && req.user.auth.profile === 'admin') {
            profile = req.body.auth.profile || 'employee';
        }

        const newUser = new User({
            name: req.body.name,
            auth: {
                username: req.body.auth.username,
                password: req.body.auth.password,
                profile: profile 
            }
        });

        const user = await newUser.save();

        const payload = { pk: user.auth.public_key };
        const options = {
            expiresIn: CONFIG.auth.expiration_time,
            issuer: CONFIG.auth.issuer
        };

        const token = JWT.sign(payload, user.auth.private_key, options);

        let message = UserMessages.success.s0;
        message.body = user;

        return res
            .header("location", "/users/" + user._id)
            .header("Authorization", token)
            .status(message.http)
            .send(message);

    } catch (error) {
        console.error(`Error saving user: ${error}`);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


exports.update = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        if (req.body.auth && req.body.auth.username) {
            const existingUser = await User.findOne({
                "auth.username": req.body.auth.username,
                _id: { $ne: req.params.id }
            });

            if (existingUser) {
                return res.status(400).send({
                    message: "Username already exists. Please choose a different username."
                });
            }
        }

        // If the password is present, hash it before updating
        if (req.body.auth && req.body.auth.password) {
            req.body.auth.password = bcrypt.hashSync(req.body.auth.password, bcrypt.genSaltSync(10));
        }

        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        );

        if (!user) return res.status(UserMessages.error.e1.http).send(UserMessages.error.e1);

        let message = UserMessages.success.s1;
        message.body = user;
        return res.status(message.http).send(message);

    } catch (error) {
        console.error(`Error updating user: ${error}`);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};



exports.delete = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await User.deleteOne({ _id: req.params.id });

        if (result.deletedCount <= 0) {
            return res.status(UserMessages.error.e1.http).send(UserMessages.error.e1);
        }

        let message = UserMessages.success.s3; 
        return res.status(message.http).send(message);

    } catch (error) {
        console.error(`Error deleting user: ${error}`);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


exports.activate = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const result = await User.updateOne(
            { _id: req.params.id },
            { $set: { active: true } }
        );

        if (result.n <= 0) {
            return res.status(UserMessages.error.e0.http).send(UserMessages.error.e0);
        }

        return res.status(UserMessages.success.s6.http).send(UserMessages.success.s6);

    } catch (error) {
        console.error(`Error activating user: ${error}`);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


exports.deactivate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    User.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: false
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(UserMessages.error.e0.http).send(UserMessages.error.e0);
        return res.status(UserMessages.success.s4.http).send(UserMessages.success.s4);

    });
}