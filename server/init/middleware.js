module.exports = (app) => {
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const cors = require('cors');

    const allowedOrigins = [
        "http://localhost:8080",
        "https://frontend-task-management-rmm-devwn.onrender.com",
        "https://taskmanagement-rmm-devwn.netlify.app",
    ];

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization, Language, Location",
        exposedHeaders: "Authorization, Language, Location",
        credentials: true
    }));

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        next();
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.set('trust proxy', 1);
};
