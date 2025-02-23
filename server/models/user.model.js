const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name field is required.'],
        trim: true,  
    },
    auth: {
        username: { 
            type: String, 
            required: [true, 'The username field is required.'],
            unique: true 
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
        },
        public_key: String,
        private_key: String,
        profile: {
            type: String,
            enum: ["admin", "employee"],
            default: "employee",
        },
    },
    active: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
});

userSchema.pre("save", function (next) {
    if (this.isModified("auth.password") || this.isNew) {
        if (this.auth.password) {
            this.auth.password = bcrypt.hashSync(this.auth.password, bcrypt.genSaltSync(10));
        }
        this.auth.public_key = crypto.randomBytes(32).toString("hex");
        this.auth.private_key = crypto.randomBytes(32).toString("hex");
    }
    next();
});

module.exports = mongoose.model(CONFIG.mongodb.collections.user, userSchema);
