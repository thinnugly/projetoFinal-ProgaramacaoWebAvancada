module.exports = {
    success: {
        s0: {
            code: "NotificationCreated",
            http: 201,
            type: "success"
        },
        s1: {
            http: 200,
            code: "NotificationUpdated",
            type: "success"
        },
        s2: {
            http: 200,
            code: "NotificationFound",
            type: "success"
        },
        s3: {
            http: 200,
            code: "NotificationDeleted",
            type: "success"
        },
        s4: {
            http: 200,
            code: "Deactivated",
            type: "success"
        },
        s5: {
            http: 204,
            code: "NoNotifications",
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
            code: "NotificationNotFound",
            type: "error"
        }
    }
}