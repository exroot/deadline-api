import { Server } from "./server";

(async () => {
    const server = new Server();
    await server.setup();
    return server.listen();
})();
