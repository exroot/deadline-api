/*********************************
 *   Entities/Models interfaces  *
 *********************************/
export interface IBitacora {
    save(): Promise<IBitacora>;
    id?: number;
    timestamp?: Date;
    data?: string;
    usuario_id?: number;
    operacion_id?: number;
    recurso_id?: number;
    usuario?: IUsuario;
    operacion?: IOperacion;
    recurso?: IRecurso;
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

export interface IRecurso {
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
    profesores?: IProfesor[] | number[];
}

export interface IOperacion {
    id?: number;
    operacion: string;
    bitacoras?: IBitacora[];
}

export interface IPermiso {
    id?: number;
    permiso?: string;
}

export interface IProfesor {
    id?: number;
    nombre?: string;
    imagen?: string;
    email?: string;
    numero?: number;
    tareas?: ITarea[];
    materias?: IMateria[] | number[];
}

export interface IRol {
    id?: number;
    rol: string;
    usuarios?: IUsuario[];
    permisos?: IPermiso[] | number[];
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
    autor?: IUsuario;
    materia?: IMateria;
    profesor?: IProfesor;
    categorias?: ICategoria[] | number[];
}

export interface IUsuario {
    save(): Promise<IUsuario>;
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    imagen?: string;
    carrera_id?: number;
    rol_id?: number;
    carrera?: ICarrera;
    rol?: IRol;
    tareasPublicadas?: ITarea[];
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
    existe(id: number): Promise<INotFoundResponse>;
}

export interface IAuthService extends IService {
    makeToken(identifier: string): Promise<string>;
    getUser(token: string): Promise<IUsuario>;
    validCredentials(credentials: ICredentials): Promise<boolean>;
    register(data: IUsuario): Promise<any>;
    registered(identifier: string): Promise<boolean>;
    login(credentials: ICredentials): Promise<any>;
}

export interface IBitacoraService extends IService {
    search(searchOptions: {
        username: string;
        email: string;
    }): Promise<IBitacora[]>;
    carreraStatus(carrera: string): Promise<any>;
    getManyByUsuario(
        usuarioId: number,
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IBitacora[]>;
    getManyByDate(
        dates: Date[],
        page: number,
        limit: number,
        sortBy: string,
        orderBy: string
    ): Promise<IBitacora[]>;
    audit(
        data: string,
        usuarioId: number,
        operacionId: number,
        recursoId: number
    ): Promise<IBitacora>;
}

export interface ICarreraService extends IService {
    search(carrera: string): Promise<ICarrera[]>;
    carreraStatus(carrera: string, id?: number): Promise<IConflictResponse>;
}

export interface ICategoriaService extends IService {
    search(categoria: string): Promise<ICategoria[]>;
    categoriaStatus(categoria: string, id?: number): Promise<IConflictResponse>;
}

export interface IRecursoService extends IService {
    search(recurso: string): Promise<IRecurso[]>;
    recursoStatus(recurso: string, id?: number): Promise<IConflictResponse>;
    getByRecurso(recurso: string): Promise<IRecurso>;
}

export interface IMateriaService extends IService {
    search(materia: string): Promise<IMateria[]>;
    materiaStatus(materia: string, id?: number): Promise<IConflictResponse>;
}

export interface IOperacionService extends IService {
    search(operacion: string): Promise<IOperacion[]>;
    operacionStatus(operacion: string, id?: number): Promise<IConflictResponse>;
    getByOperacion(operacion: string): Promise<IOperacion>;
}

export interface IPermisoService extends IService {
    search(permiso: string): Promise<IPermiso[]>;
    permisoStatus(permiso: string, id?: number): Promise<IConflictResponse>;
}

export interface IProfesorService extends IService {
    search(options: { nombre: string; email: string }): Promise<IProfesor[]>;
    profesorStatus(email: string, id?: number): Promise<IConflictResponse>;
}

export interface IRolService extends IService {
    search(rol: string): Promise<IRol[]>;
    rolStatus(rol: string, id?: number): Promise<IConflictResponse>;
}

export interface ITareaService extends IService {
    search(titulo: string): Promise<ITarea[]>;
}

export interface IUsuarioService extends IService {
    search(options: { username: string; email: string }): Promise<IUsuario[]>;
    usernameTaked(username: string): Promise<boolean>;
    emailUsed(email: string): Promise<boolean>;
    usuarioStatus(
        username: string,
        email: string,
        id?: number
    ): Promise<IConflictUsuarioResponse>;
}

/*********************************
 *      Utils interfaces      *
 *********************************/

export interface ICredentials {
    username?: string;
    email?: string;
    password: string;
}

export interface IConflictUsuarioResponse {
    username: any;
    email: any;
}

export interface INotFoundResponse {
    notFound: boolean;
    notFoundData: any;
}

export interface IValidationResponse {
    error: boolean;
    errorData: any;
}

export interface IConflictResponse {
    conflict: boolean;
    conflictData: any;
}

export interface ISchema {
    validate(data: any, validateOptions?: any): Promise<any>;
}
