const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const commentSchema = new Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.task,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.user,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(CONFIG.mongodb.collections.comment, commentSchema);
