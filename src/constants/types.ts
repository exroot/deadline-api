export const TYPE = {
    /******************
     *  Repositories  *
     * ****************/
    BitacoraRepository: Symbol("BitacoraRepository"),
    CarreraRepository: Symbol("CarreraRepository"),
    CategoriaRepository: Symbol("CategoriaRepository"),
    MateriaRepository: Symbol("MateriaRepository"),
    OperacionRepository: Symbol("OperacionRepository"),
    PermisoRepository: Symbol("PermisoRepository"),
    ProfesorRepository: Symbol("ProfesorRepository"),
    RecursoRepository: Symbol("RecursoRepository"),
    RolRepository: Symbol("RolRepository"),
    TareaRepository: Symbol("TareaRepository"),
    UsuarioRepository: Symbol("UsuarioRepository"),
    /******************
     *  Services  *
     * ****************/
    AuthService: Symbol("AuthService"),
    BitacoraService: Symbol("BitacoraService"),
    CarreraService: Symbol("CarreraService"),
    CategoriaService: Symbol("CategoriaService"),
    MateriaService: Symbol("MateriaService"),
    OperacionService: Symbol("OperacionService"),
    PermisoService: Symbol("PermisoService"),
    ProfesorService: Symbol("ProfesorService"),
    RecursoService: Symbol("RecursoService"),
    RolService: Symbol("RolService"),
    TareaService: Symbol("TareaService"),
    UsuarioService: Symbol("UsuarioService"),
    /******************
     *  Middlewares  *
     * ****************/
    Authenticated: Symbol("Authenticated"),
    Authorized: Symbol("Authorized"),
    PaginationMiddleware: Symbol("PaginationMiddleware"),
    AuditMiddleware: Symbol("AuditMiddleware"),
    /******************
     *  Validation schemas  *
     * ****************/
    BitacoraSchema: Symbol("BitacoraSchema"),
    CarreraSchema: Symbol("CarreraSchema"),
    CategoriaSchema: Symbol("CategoriaSchema"),
    MateriaSchema: Symbol("MateriaSchema"),
    OperacionSchema: Symbol("OperacionSchema"),
    PermisoSchema: Symbol("PermisoSchema"),
    ProfesorSchema: Symbol("ProfesorSchema"),
    RecursoSchema: Symbol("RecursoSchema"),
    RolSchema: Symbol("RolSchema"),
    TareaSchema: Symbol("TareaSchema"),
    UsuarioSchema: Symbol("UsuarioSchema"),

    /* helpers */
    RouteParserHelper: Symbol("RouteParserHelper"),
};
