const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.user,
        required: true
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.task,
        required: false
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.comment,
        required: false
    },
    type: {
        type: String,
        enum: ['TASK_ASSIGNED', 'TASK_COMPLETED', 'COMMENT_ADDED', 'TASK_DELETED', 'TASK_OVERDUE', 'TASK_UPDATED', 'TASK_STATUS_UPDATED'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model(CONFIG.mongodb.collections.notification, notificationSchema);
