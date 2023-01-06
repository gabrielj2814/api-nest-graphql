import {Field, ObjectType, InputType} from "@nestjs/graphql"

@InputType()
export default class EspecialidadDto{

    @Field( type => String )
    id:number

    @Field( type => String)
    nombre:string

}