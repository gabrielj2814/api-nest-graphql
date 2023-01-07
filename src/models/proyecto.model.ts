import {Field, ObjectType, InputType, registerEnumType} from "@nestjs/graphql"
import typeEspecialidad from "src/especialidad/interfaces/types/especialidad"
import typeDeveloper from "src/developer/interfaces/types/developer"
import Especialidad from "./especialidad.model"
import Developer from "./developer.model"

import { Status } from "src/proyecto/enum/status"

registerEnumType(Status, {
    name: "Status"
})

@ObjectType()
export default class Proyecto {

    @Field( type => String)
    id:string

    @Field( type => String)
    nombre:string

    @Field( type => String)
    descripcion:string

    @Field( type => [Developer], {nullable: true})
    developers?:typeDeveloper[]

    @Field( type => [Especialidad])
    roles:typeEspecialidad[]

    @Field( type => Status)
    status: Status

}