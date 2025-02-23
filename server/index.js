require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./init/db');
const path = require('path');
const createAdminUser = require('./seeds/createAdminUser.seeds');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const PORT = process.env.PORT;
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB().then(() => {
    require('./init/middleware')(app);
    require('./init/routes')(app);
    createAdminUser();
    app.listen(PORT, () => {
        console.log(`Your App is listening on http://localhost:${PORT}.`);
    })
});
