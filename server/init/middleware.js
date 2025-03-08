module.exports = (app) => {
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const cors = require('cors');

    // Lista de origens permitidas
    const allowedOrigins = [
        "http://localhost:8080", // Frontend local
        "https://taskmanagement-rmm-devwn.netlify.app", // Frontend em produção
        "http://localhost:3000", // Swagger UI local
        "https://projetofinal-progaramacaowebavancada.onrender.com", // Swagger UI em produção
    ];

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true); 
            } else {
                callback(new Error(`The origin ${origin} is not allowed by the CORS.`));
            }
        },
        methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization, Language, Location",
        exposedHeaders: "Authorization, Language, Location",
        credentials: true
    }));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.set('trust proxy', 1);
};