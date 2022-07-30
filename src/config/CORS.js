import "dotenv/config";
const configCors = app => {
    // Add headers before the routes are defined
    app.use(function (req, res, next) {
        // console.log(">>> cors method", req.method);
        // Website you wish to allow to connect
        res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);

        // Request methods you wish to allow
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );
        // Request headers you wish to allow
        // set Authorization to Bearer at client can send header include token
        res.setHeader(
            "Access-Control-Allow-Headers",
            "X-Requested-With,content-type, Authorization" //Authorization: bearer token
        );
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader("Access-Control-Allow-Credentials", true);
        if (req.method === "OPTIONS") {
            // config cors for request Bearer token from client
            return res.sendStatus(200);
        }
        // Pass to next layer of middleware
        next();
    });
};
export default configCors;

//Refer to the following link : https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
