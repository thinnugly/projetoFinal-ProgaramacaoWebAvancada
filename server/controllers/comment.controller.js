const Task = require('../models/task.model');
const Notification = require('../models/notification.model');
const { validationResult } = require('express-validator');
const TaskMessages = require('../messages/task.messages');
const Comment = require('../models/comment.model');
const CommentMessages = require('../messages/comment.messages');
const { sendNotification } = require('../socket/socket');


exports.get = async (req, res) => {
    try {
        const userId = req.user._id;
        const isAdmin = req.user.auth.profile === 'admin';
        const taskId = req.params.id;

        let comments;

        if (isAdmin) {
            comments = await Comment.find({ task: taskId });
        } else {
            const task = await Task.findById(taskId);

            if (!task) {
                return res.status(TaskMessages.error.e0.http).send(TaskMessages.error.e0);
            }

            if (task.createdBy.toString() !== userId.toString() && task.attachedTo.toString() !== userId.toString()) {
                return res.status(403).json({ message: "Forbidden: You are not assigned to this task" });
            }

            comments = await Comment.find({ task: taskId });
        }

        let message = CommentMessages.success.s2;
        if (comments.length === 0) message = CommentMessages.success.s5;

        message.body = comments;
        return res.status(message.http).send(message);
    } catch (error) {
        console.error(`Error retrieving comments: ${error}`);
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
        const { taskId, message } = req.body;
        const userId = req.user._id;
        const userRole = req.user.auth.profile;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(TaskMessages.error.e0.http).send(TaskMessages.error.e0);
        }

        if (userRole !== 'admin' && task.attachedTo.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Forbidden",
                error: "You can only comment on tasks assigned to you."
            });
        }

        const comment = new Comment({
            task: taskId,
            user: userId,
            message: message
        });
        await comment.save();

        let recipient = (task.createdBy.toString() === userId.toString()) ? task.attachedTo : task.createdBy;

        const notification = new Notification({
            recipient: recipient,
            task: taskId,
            type: "COMMENT_ADDED",
            message: `New comment on task "${task.title}"`
        });
        await notification.save();

        const io = getIO();
        const recipientId = recipient.toString(); 

        io.to(recipientId).emit("newNotification", {
            message: `New comment on task "${task.title}"`,
            taskId: task._id,
        });

        // Emitindo notificação em tempo real
        try {
            sendNotification(task.attachedTo, `New comment on task "${task.title}"`, "COMMENT_PUBLISHED");
        } catch (error) {
            console.error(`Error sending notification: ${error}`);
        }

        const messageR = CommentMessages.success.s0;
        messageR.body = comment; 

        return res.status(messageR.http).send(messageR);

    } catch (error) {
        console.error(`Error creating comment: ${error}`);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
