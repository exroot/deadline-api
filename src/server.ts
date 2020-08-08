import express, { Application } from "express";
import rateLimiter, { RateLimit } from "express-rate-limit";
import { createConnection } from "typeorm";
import middlewares from "./middlewares";
import routes from "./routes";

export class Server {
    protected server: Application;
    protected PORT: number;
    protected apiRateLimiter: RateLimit;
    constructor() {
        console.log("Starting server...");
        this.server = express();
        this.setEnviroment();
        this.setDatabase();
        this.setMiddlewares();
        this.setRoutes();
        this.errorHandler();
    }
    private setEnviroment(): void {
        this.apiRateLimiter = rateLimiter({
            max: 1000,
            windowMs: 15 * 60 * 1000 /* 15 minute */,
        });
        this.server.set("PORT", 3000);
        this.server.use(this.apiRateLimiter);
    }
    private async setDatabase(): Promise<void> {
        try {
            await createConnection();
            return;
        } catch (err) {
            console.error(err);
        }
    }
    private setRoutes(): void {
        console.log(`Setting routes...`);
    }
    private setMiddlewares(): void {
        console.log(`Setting middlewares...`);
    }
    private errorHandler(): void {
        // Error handler and error logger
    }
    public listen(): void {
        const PORT: number = this.server.get("PORT");
        this.server.listen(PORT);
        console.log(`Server running on port ${PORT}`);
    }
}
