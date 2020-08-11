/*********************************
 *   Entities/Models interfaces  *
 *********************************/
export interface IBitacora {
    save(): Promise<IBitacora>;
    id?: number;
    fecha?: Date;
    recurso_id?: number;
    usuario_id?: number;
    operacion_id?: number;
    entidad_id?: number;
    usuario?: IUsuario;
    operacion?: IOperacion;
    entidad?: IEntidad;
}

export interface ICarrera {
    id?: number;
    carrera: string;
    materias?: IMateria[];
    usuarios?: IUsuario[];
}

export interface ICategoria {
    id?: number;
    categoria: string;
    tareas?: ITarea[];
}

export interface IEntidad {
    id?: number;
    nombre: string;
    permisos?: IPermiso[];
    bitacoras?: IBitacora[];
}

export interface IMateria {
    id?: number;
    materia?: string;
    carrera_id?: number;
    carrera?: ICarrera;
    tareas?: ITarea[];
    profesores?: IProfesor[];
}

export interface IOperacion {
    id?: number;
    operacion: string;
    bitacoras?: IBitacora[];
}

export interface IPermiso {
    id?: number;
    permiso?: string;
    entidad_id?: number;
    entidad?: IEntidad;
    roles?: IRol[];
}

export interface IProfesor {
    id?: number;
    nombre?: string;
    imagen?: string;
    email?: string;
    numero?: number;
    tareas?: ITarea[];
    materias?: IMateria[];
}

export interface IRol {
    id?: number;
    rol: string;
    usuarios?: IUsuario[];
    permisos?: IPermiso[];
}

export interface ITarea {
    id?: number;
    titulo?: string;
    ponderacion?: number;
    descripcion?: string;
    fecha_asignacion?: Date;
    fecha_entrega?: Date;
    fuente?: string;
    usuario_id?: number;
    materia_id?: number;
    profesor_id?: number;
    usuario?: IUsuario;
    materia?: IMateria;
    profesor?: IProfesor;
    categorias?: ICategoria[];
}

export interface IUsuario {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    imagen?: string;
    carrera_id?: number;
    rol_id?: number;
    carrera?: ICarrera;
    rol?: IRol;
    tareas?: ITarea[];
    bitacoras?: IBitacora[];
    comparePassword(password: string): boolean;
}

/*********************************
 *      Services interfaces      *
 *********************************/

export interface IService {
    get(id: number): Promise<any>;
    getMany(
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<any[]>;
    create(newData: any): Promise<any>;
    update(id: number, updatedData: any): Promise<any>;
    delete(id: number): Promise<any>;
}

export interface IAuthService extends IService {
    makeToken(identifier: string): Promise<string>;
    getUser(token: string): Promise<IUsuario>;
    validCredentials(credentials: ICredentials): Promise<boolean>;
    register(data: IUsuario): Promise<any>;
    registered(identifier: string): Promise<boolean>;
    login(credentials: ICredentials): Promise<any>;
}

export interface ICarreraService extends IService {
    carreraExist(carrera: string): Promise<boolean>;
}

export interface IUsuarioService extends IService {
    usernameTaked(username: string): Promise<boolean>;
    emailUsed(email: string): Promise<boolean>;
}

/*********************************
 *      Utils interfaces      *
 *********************************/

export interface ICredentials {
    username?: string;
    email?: string;
    password: string;
}
