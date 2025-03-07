require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const connectDB = require('./init/db');
const path = require('path');
const createAdminUser = require('./seeds/createAdminUser.seeds');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { createServer } = require('http');
const { setupSocket } = require('./socket/socket');

const server = createServer(app);
const { io } = setupSocket(server);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Conectar ao banco de dados e iniciar servidor
connectDB().then(() => {
    require('./init/middleware')(app);
    require('./init/routes')(app);
    createAdminUser();

    // Agora o WebSocket e o Express compartilham o mesmo servidor
    server.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});
