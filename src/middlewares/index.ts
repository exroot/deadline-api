import { Authenticated } from "./authenticated";
import { PaginationMiddleware } from "./pagination";
import { AuditMiddleware } from "./audit";
import { Authorized } from "./authorized";
import commons from "./commons";

export { error404 } from "./error404";
export { errorLogger } from "./errorLogger";
export { errorHandler } from "./errorHandler";
export const customMiddlewares = [
    {
        middleware: Authenticated,
        typename: "Authenticated",
    },
    {
        middleware: Authorized,
        typename: "Authorized",
    },
    {
        middleware: PaginationMiddleware,
        typename: "PaginationMiddleware",
    },
    {
        middleware: AuditMiddleware,
        typename: "AuditMiddleware",
    },
];
export { commons };
