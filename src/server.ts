import { Application } from "express";
import { bindings } from "./inversify.config";
import { Container } from "inversify";
import rateLimiter, { RateLimit } from "express-rate-limit";
import { InversifyExpressServer } from "inversify-express-utils";
import { AuthProvider } from "./controllers/auth.provider";
import { commons, errorLogger, errorHandler, error404 } from "./middlewares";
import dotenv from "dotenv";
import "reflect-metadata";

export class Server {
    protected server: Application;
    protected PORT: number;
    protected apiRateLimiter: RateLimit;
    protected container: Container;
    constructor() {
        console.log("Starting server...");
        this.apiRateLimiter = rateLimiter({
            max: 1000,
            windowMs: 15 * 60 * 1000 /* 15 minutes */,
        });
    }
    public async setup(): Promise<void> {
        dotenv.config();
        await this.setContainer();
        const server = new InversifyExpressServer(
            this.container,
            null,
            {
                rootPath: "/api/v1",
            },
            null,
            AuthProvider
        );
        server.setConfig((app) => {
            this.setMiddlewares(app);
        });
        server.setErrorConfig((app) => {
            this.setErrorHandlers(app);
        });
        this.server = server.build();
        this.server.set("HOST", process.env.APP_HOST);
        this.server.set("PORT", process.env.APP_PORT);
        return;
    }
    private async setContainer(): Promise<void> {
        console.log(`Setting container...`);
        this.container = new Container();
        await this.container.loadAsync(bindings);
        return;
    }
    private setMiddlewares(application: Application): void {
        console.log(`Registering basic middlewares...`);
        application.use(this.apiRateLimiter);
        application.use(commons);
        return;
    }
    private setErrorHandlers(application: Application): void {
        console.log("Setting error handlers...");
        application.use(error404);
        application.use(errorLogger);
        application.use(errorHandler);
        return;
    }
    public listen(): void {
        const HOST: string = this.server.get("HOST");
        const PORT: number = this.server.get("PORT");
        this.server.listen(PORT, () => {
            console.log(`Server running at ${HOST}:${PORT}/`);
        });
    }
}
