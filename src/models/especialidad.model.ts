import {Field, ObjectType, InputType} from "@nestjs/graphql"

@ObjectType()
export default class Especialidad{

    @Field( type => String )
    id:number

    @Field( type => String)
    nombre:string

}