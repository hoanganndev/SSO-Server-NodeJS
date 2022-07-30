import bodyParser from "body-parser";
import "dotenv/config";
import express from "express";
import connection from "./config/connectDB";
import configCors from "./config/CORS";
import configViewEngine from "./config/viewEngine";
import initApiRoutes from "./routes/api";
import initWebRoutes from "./routes/web";
import initSSOWebRoutes from "./routes/SSO_web";
import cookieParser from "cookie-parser";
//
import { configPassport } from "./controller/SSO_passportLocalController";
import configSession from "./config/session";

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 8080;

// Config Cors
configCors(app);

// Config view engine
configViewEngine(app);

// Config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Config session
configSession(app);

// Config cookies parser
app.use(cookieParser());

// Is connect database
connection();

// Init routes
initWebRoutes(app);
initApiRoutes(app);
initSSOWebRoutes(app);

// Config passport
configPassport();

app.listen(PORT, () => {
    console.log(`🟢🟢🟢 Server jwt is running on the port: ${PORT}`);
});
