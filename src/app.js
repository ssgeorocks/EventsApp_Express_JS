import express from "express";
import cookieParser from "cookie-parser";
// import MongoStore from "connect-mongo"
import { connDB } from "./config/database.js";
import { config } from "./config/config.js";
import { router as sessionsRouter } from "./routes/sessions.Router.js";
import { router as testRouter } from "./routes/pruebasRouter.js";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
// import FileStore from "session-file-store"

const PORT = config.general.PORT;
const app = express();
// const fileStore=FileStore(sessions)

//express configuration
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// PASO 2
app.use(passport.initialize());
initPassport();
// app.use(sessions({
//     secret: config.general.SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//         mongoUrl: config.database.MONGO_URL,
//         dbName: config.database.DB_NAME,
//         ttl: 3600,
//     })
// }))

//
app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send("OK");
});

// Montamos los endopints al router
app.use("/api/sessions", sessionsRouter);
app.use("/api/pruebas", testRouter);

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en direccion http://localhost:${PORT}`);
    console.log(
        `Pagina de login disponible en http://localhost:${PORT}/login.html`,
    );
});

process.on("SIGTERM", () => {
    console.log("SIGTERM recibido, cerrando servidor...");
    server.close(() => process.exit(0));
});

connDB(config.database.MONGO_URL, config.database.DB_NAME);
