import { interfaces } from "inversify-express-utils";

export class Principal implements interfaces.Principal {
    public details: any;
    public constructor(details: any) {
        this.details = details;
    }
    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(true);
    }
    public isResourceOwner(resourceId: number): Promise<boolean> {
        return Promise.resolve(resourceId === this.details.usuario_id);
    }
    public isInRole(rol: string): Promise<boolean> {
        return Promise.resolve(this.details.rol === rol);
    }
    public getName(): Promise<string> {
        return Promise.resolve(this.details.username);
    }
}
