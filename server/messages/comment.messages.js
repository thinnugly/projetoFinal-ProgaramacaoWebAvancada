module.exports = {
    success: {
        s0: {
            code: "CommentCreated",
            http: 201,
            type: "success"
        },
        s1: {
            http: 200,
            code: "CommentUpdated",
            type: "success"
        },
        s2: {
            http: 200,
            code: "CommentFound",
            type: "success"
        },
        s3: {
            http: 200,
            code: "CommentDeleted",
            type: "success"
        },
        s4: {
            http: 200,
            code: "Deactivated",
            type: "success"
        },
        s5: {
            http: 204,
            code: "NoComments",
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
            code: "CommentNotFound",
            type: "error"
        }
    }
}