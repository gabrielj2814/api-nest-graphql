import typeDeveloper from "../../../developer/interfaces/types/developer"
import typeEspecialidad from "../../../especialidad/interfaces/types/especialidad"
// import { Status } from "../../enum/status"

export default interface typeProyecto{

    id:string
    nombre:string
    descripcion:string
    status:number
    developers?:typeDeveloper[]
    roles:typeEspecialidad[]
}