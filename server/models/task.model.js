const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const TaskStatus = {
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS",
    REVIEW: "REVIEW",
    BLOCKED: "BLOCKED",
    DONE: "DONE",
    CANCELLED: "CANCELLED"
};

const TaskPriority = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    URGENT: "URGENT"
};

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'The title field is required.'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title must be at most 100 characters long'] 
    },
    description: {
        type: String,
        requirattacpriorityhedToed: [true, 'The description field is required.'],
        trim: true, 
        minlength: [5, 'Title must be at least 5 characters long'],
        maxlength: [200, 'Title must be at most 200 characters long']
    },
    status: {
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.PENDING
    },
    priority: {
        type: String,
        enum: Object.values(TaskPriority),
        default: TaskPriority.MEDIUM
    },
    due: {
        type: Date,
        required: [true, 'The due date field is required.'],
        validate: {
            validator: function(value) {
                return value => new Date();
            },
            message: 'The due date must be in the future.'
        }
    },
    attachedTo: {
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.user, 
        required: [true, 'The task must be assigned to a user.'],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.user, 
        required: [true, 'The creator of the task is required.']
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.user,
        default: null
    },
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: CONFIG.mongodb.collections.user },
        message: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model(CONFIG.mongodb.collections.task, taskSchema);
