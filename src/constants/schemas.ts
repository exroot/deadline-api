import * as yup from "yup";

export const BitacoraSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    fecha: yup.date().optional(),
    data: yup.string().optional(),
    usuario_id: yup.number().integer().positive().required(),
    operacion_id: yup.number().integer().positive().required(),
    recurso_id: yup.number().integer().positive().required(),
});

export const CarreraSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    carrera: yup.string().required("El campo es obligatorio."),
});

export const CategoriaSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    categoria: yup.string().required("El campo es obligatorio."),
});

export const RecursoSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    nombre: yup.string().required("El campo es obligatorio."),
});

export const MateriaSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    materia: yup.string().required("El campo es obligatorio."),
    carrera_id: yup.number().integer().positive().optional(),
});

export const OperacionSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    operacion: yup.string().required("El campo es obligatorio."),
});

export const PermisoSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    permiso: yup.string().required("El campo es obligatorio."),
});

export const ProfesorSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    nombre: yup.string().required("El campo es obligatorio."),
    imagen: yup
        .string()
        .url("El campo imagen necesita una URL válida.")
        .optional(),
    email: yup.string().email("Email inválido, verifiquelo.").required(),
    numero: yup.string().required(),
});

export const RolSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    rol: yup
        .string()
        .min(4, "Rol muy corto.")
        .max(30, "Rol muy largo")
        .required(),
    permisos: yup
        .array()
        .of(yup.number().required("Los permisos seleccionados son inválidos."))
        .optional(),
});

export const TareaSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    titulo: yup.string().required(),
    ponderacion: yup.number().required(),
    descripcion: yup.string().required(),
    fecha_asignacion: yup.date().required(),
    fecha_entrega: yup
        .date()
        .when("fecha_asignacion", (asignacion, schema) => {
            schema.min(
                asignacion,
                "La fecha de entrega de la tarea no puede ser antes que la fecha cuando fue asignada."
            );
        })
        .required(),
    fuente: yup.string().url().required(),
    categorias: yup
        .array()
        .of(
            yup.number().required("Las categorias seleccionadas son inválidas.")
        )
        .optional(),
    usuario_id: yup.number().integer().required(),
    materia_id: yup.number().integer().required(),
    profesor_id: yup.number().integer().required(),
});

export const UsuarioSchema = yup.object().shape({
    id: yup.number().integer().positive().optional(),
    username: yup.string().required(),
    email: yup.string().email("Email inválido, verifiquelo.").required(),
    password: yup.string().required(),
    imagen: yup
        .string()
        .url("El campo imagen necesita una URL válida.")
        .optional(),
    carrera_id: yup.number().integer().required(),
    rol_id: yup.number().integer().required(),
});

export const schemas = [
    {
        schema: BitacoraSchema,
        typename: "BitacoraSchema",
    },
    {
        schema: CarreraSchema,
        typename: "CarreraSchema",
    },
    {
        schema: CategoriaSchema,
        typename: "CategoriaSchema",
    },
    {
        schema: RecursoSchema,
        typename: "RecursoSchema",
    },
    {
        schema: MateriaSchema,
        typename: "MateriaSchema",
    },
    {
        schema: OperacionSchema,
        typename: "OperacionSchema",
    },
    {
        schema: PermisoSchema,
        typename: "PermisoSchema",
    },
    {
        schema: ProfesorSchema,
        typename: "ProfesorSchema",
    },
    {
        schema: RolSchema,
        typename: "RolSchema",
    },
    {
        schema: TareaSchema,
        typename: "TareaSchema",
    },
    {
        schema: UsuarioSchema,
        typename: "UsuarioSchema",
    },
];
