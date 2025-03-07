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

// Middleware para definir o tipo MIME correto para arquivos JavaScript
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});

// Servir arquivos estáticos da pasta 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));

// Configurar EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar Swagger para documentação da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Conectar ao banco de dados e iniciar servidor
connectDB().then(() => {
    require('./init/middleware')(app);
    require('./init/routes')(app);
    createAdminUser();

    // Servir arquivos estáticos da aplicação cliente (SPA)
    app.use(express.static(path.join(__dirname, 'client', 'dist')));

    // Redirecionar todas as outras rotas para o index.html da SPA
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
    });

    // Iniciar o servidor
    server.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});