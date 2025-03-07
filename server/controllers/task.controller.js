const Task = require('../models/task.model');
const Notification = require('../models/notification.model');
const { validationResult } = require('express-validator');
const TaskMessages = require('../messages/task.messages');
const { sendNotification } = require('../socket/socket');


exports.get = async (req, res) => {
    try {
        const userId = req.user._id;
        const isAdmin = req.user.auth.profile === 'admin';

        let tasks;

        if (isAdmin) {
            tasks = await Task.find();
        } else {
            tasks = await Task.find({
                $or: [
                    { createdBy: userId },
                    { attachedTo: userId }
                ]
            });
        }

        let message = TaskMessages.success.s2;
        if (tasks.length === 0) message = TaskMessages.success.s5;

        message.body = tasks;
        return res.status(message.http).send(message);
    } catch (error) {
        console.error(`Error retrieving tasks. Please try again later: ${error}.`);
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
        const userId = req.user._id; 
        const isAdmin = req.user.auth.profile === 'admin';

        let task;

        if (isAdmin) {
            task = await Task.findOne({ _id: req.params.id });
        } else {
            task = await Task.findOne({
                _id: req.params.id,
                $or: [
                    { createdBy: userId },
                    { attachedTo: userId } 
                ]
            });
        }

        if (!task) return res.status(TaskMessages.error.e0.http).send(TaskMessages.error.e0);

        let message = TaskMessages.success.s2;
        message.body = task;
        return res.status(message.http).send(message);

    } catch (error) {
        console.error(`Error fetching task: ${error}`);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


exports.create = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.status(406).send(errors);
    }

    try {
        const user = req.user;
        if (!user) {
            return res.status(401).send({
                message: "Unauthorized",
                error: "User not authenticated"
            });
        }

        const existingTask = await Task.findOne({ title: req.body.title });
        if (existingTask) {
            return res.status(409).send({
                message: "Conflict",
                error: "A task with the same title already exists."
            });
        }

        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            due: req.body.due,
            attachedTo: req.body.attachedTo,
            priority: req.body.priority || 'MEDIUM',
            createdBy: user._id,
        });

        const task = await newTask.save();

        const taskNotification = new Notification({
            recipient: req.body.attachedTo,
            task: task._id,
            type: 'TASK_ASSIGNED',
            message: `You have been assigned a new task: ${req.body.title}`,
        });

        await taskNotification.save();

        
        // Emitindo notificação em tempo real
        try {
            sendNotification(task.attachedTo, taskNotification.message, "TASK_ASSIGNED");
        } catch (error) {
            console.error(`Error sending notification: ${error}`);
        }

        let message = TaskMessages.success.s0;
        message.body = task;

        return res
            .header('location', '/tasks/' + task._id)
            .status(message.http)
            .send(message);

    } catch (error) {
        console.error(`Error saving task: ${error}`);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.update = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.status(406).send(errors);
    }

    try {
        const user = req.user;
        if (!user) {
            return res.status(401).send({
                message: "Unauthorized",
                error: "User not authenticated"
            });
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(TaskMessages.error.e0.http).send(TaskMessages.error.e0);
        }

        const isAdmin = user.auth.profile === 'admin';
        const isCreatedBy = task.createdBy.toString() === user._id.toString();
        const isAssignedUser = task.attachedTo.toString() === user._id.toString();

        if (!isAdmin && !isAssignedUser) {
            return res.status(403).send({
                message: "Forbidden",
                error: "You do not have permission to update this task."
            });
        }

        let statusChanged = false;
        let otherFieldsChanged = false;

        // Processando alterações
        if (!isAdmin) {
            const allowedStatuses = ["IN_PROGRESS", "REVIEW", "DONE"];
            if (!req.body.status || !allowedStatuses.includes(req.body.status)) {
                return res.status(400).send({
                    message: "Bad Request",
                    error: "Invalid status. Allowed values: IN_PROGRESS, REVIEW, DONE."
                });
            }
            if (req.body.status !== task.status) {
                task.status = req.body.status;
                statusChanged = true;
            }
        } else {
            if (req.body.status && req.body.status !== task.status) {
                task.status = req.body.status;
                statusChanged = true;
            }

            if (req.body.title && req.body.title !== task.title) {
                task.title = req.body.title;
                otherFieldsChanged = true;
            }
            if (req.body.description && req.body.description !== task.description) {
                task.description = req.body.description;
                otherFieldsChanged = true;
            }
            if (req.body.due && req.body.due !== task.dueTASK_ASSIGNED) {
                task.due = req.body.due;
                otherFieldsChanged = true;
            }
            if (req.body.attachedTo && req.body.attachedTo.toString() !== task.attachedTo.toString()) {
                task.attachedTo = req.body.attachedTo;
                otherFieldsChanged = true;
            }
            if (req.body.priority && req.body.priority !== task.priority) {
                task.priority = req.body.priority;
                otherFieldsChanged = true;
            }
        }

        task.updatedBy = user._id;
        await task.save();

        let recipient = isCreatedBy ? task.attachedTo : task.createdBy;

        // Determinando o tipo de notificação
        let notificationType = "TASK_UPDATED"; 
        if (statusChanged && !otherFieldsChanged) {
            notificationType = "TASK_STATUS_UPDATED";
        } else if (statusChanged && otherFieldsChanged) {
            notificationType = "TASK_UPDATED";
        } else if (!statusChanged && otherFieldsChanged) {
            notificationType = "TASK_UPDATED";
        }

        const taskNotification = new Notification({
            recipient: recipient,
            task: task._id,
            type: notificationType,
            message: `The task "${task.title}" has been updated by ${user.name}.`,
        });

        await taskNotification.save();

        // Emitindo notificação em tempo real
        try {
            sendNotification(task.attachedTo, taskNotification.message, "TASK_UPDATED");
        } catch (error) {
            console.error(`Error sending notification: ${error}`);
        }

        let message = TaskMessages.success.s1;
        message.body = task;

        return res.status(message.http).send(message);

    } catch (error) {
        console.error(`Error updating task: ${error}`);
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
        const taskId = req.params.id;
        const user = req.user;

        if (!user) {
            return res.status(401).send({
                message: "Unauthorized",
                error: "User not authenticated"
            });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(TaskMessages.error.e0.http).send(TaskMessages.error.e0);
        }

        await Task.findByIdAndDelete(taskId);

        const notificationMessage = `The task "${task.title}" has been deleted by ${user.name}.`;

        const taskNotification = new Notification({
            recipient: task.attachedTo,
            task: task._id,
            type: 'TASK_DELETED',
            message: notificationMessage,
        });

        await taskNotification.save();

        // Emitindo notificação em tempo real
        try {
            sendNotification(task.attachedTo, taskNotification.message, "TASK_DELETED");
        } catch (error) {
            console.error(`Error sending notification: ${error}`);
        }
        

        return res.status(TaskMessages.success.s3.http).send(TaskMessages.success.s3);

    } catch (error) {
        console.error(`Error deleting task: ${error}`);
        return res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};