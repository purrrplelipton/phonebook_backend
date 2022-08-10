const app = require("./app");
const http = require("http");
const { URI, PORT } = require("./utils/config");
const { info, logger } = require("./utils/logger");

const server = http.createServer(app);

server.listen(PORT, () => {
  info(`server running on port ${PORT}`);
});
