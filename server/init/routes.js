module.exports = (app) => {

    app.use('/', require('../routes/home.routes'));
    app.use('/auth', require('../routes/auth.routes'));
    app.use('/users', require('../routes/user.routes'));
    app.use('/terms', require('../routes/terms.routes'));
    app.use('/tasks', require('../routes/task.routes'));
    app.use('/tasks/comment', require('../routes/comment.routes'));
}