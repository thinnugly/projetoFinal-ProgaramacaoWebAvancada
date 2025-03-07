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

// Serve arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Serve as rotas da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Conectar ao banco de dados e iniciar servidor
connectDB().then(() => {
    require('./init/middleware')(app);
    require('./init/routes')(app);
    createAdminUser();

    server.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});

// Redireciona todas as outras rotas para o index.html da SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
