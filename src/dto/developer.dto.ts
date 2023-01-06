import {Field, ObjectType, InputType} from "@nestjs/graphql"
// import Proyecto from "./proyecto.model"
import Especialidad from "./especialidad.dto"
import typeProyecto from "src/proyecto/interfaces/types/proyecto"
import typeEspecialidad from "src/especialidad/interfaces/types/especialidad"

@InputType()
export default class DeveloperDto{
    @Field( type => String)
    id:string

    @Field( type => String)
    nombre:string
    
    @Field( type => String)
    email:string

    // @Field( type => [Proyecto], { nullable:true})
    // proyectos?:typeProyecto[]
    
    @Field( type => [Especialidad])
    roles:typeEspecialidad[]

}