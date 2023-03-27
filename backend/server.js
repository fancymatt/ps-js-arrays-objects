const app = require("./app");
const http = require("http");

const host = 'localhost';
const port = 8000;

const onListen = () => {
    console.log(`Server is running on http://${host}:${port}`);
};

const onError = error => {
    console.log(error);
};

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListen);
server.listen(port);