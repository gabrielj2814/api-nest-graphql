import typeEspecialidad from "src/especialidad/interfaces/types/especialidad"
import typeProyecto from "src/proyecto/interfaces/types/proyecto"


export default interface typeDeveloper {
    id:string
    nombre:string
    email:string
    proyectos?: typeProyecto[]
    roles:typeEspecialidad[]
}