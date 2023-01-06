import typeDeveloper from "../../../developer/interfaces/types/developer"
import typeEspecialidad from "../../../especialidad/interfaces/types/especialidad"

export default interface typeProyecto{
    
    id:string
    nombre:string
    descripcion:string
    status:string
    developers:typeDeveloper[]
    roles:typeEspecialidad[]
}