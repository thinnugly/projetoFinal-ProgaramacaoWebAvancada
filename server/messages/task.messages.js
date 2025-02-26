module.exports = {
    success: {
        s0: {
            code: "TaskCreated",
            http: 201,
            type: "success"
        },
        s1: {
            http: 200,
            code: "TaskUpdated",
            type: "success"
        },
        s2: {
            http: 200,
            code: "TaskFound",
            type: "success"
        },
        s3: {
            http: 200,
            code: "TaskDeleted",
            type: "success"
        },
        s4: {
            http: 200,
            code: "Deactivated",
            type: "success"
        },
        s5: {
            http: 204,
            code: "NoTasks",
            type: "success"
        },
        s6: {
            http: 200,
            code: "Activated",
            type: "success"
        }
    },
    error: {
        e0: {
            http: 404,
            code: "TaskNotFound",
            type: "error"
        }
    }
}