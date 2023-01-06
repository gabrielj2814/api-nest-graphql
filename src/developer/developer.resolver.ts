import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import Developer from 'src/models/developer.model';
import typeEspecialidad from 'src/especialidad/interfaces/types/especialidad';
import typeProyecto from 'src/proyecto/interfaces/types/proyecto';
import typeDeveloper from './interfaces/types/developer';
import {v1} from "uuid"
import ProyectoDto from '../dto/proyecto.dto';
import EspecialidadDto from 'src/dto/especialidad.dto';

let data:typeDeveloper[]=[]

@Resolver()
export class DeveloperResolver {


    @Query( type => Developer, {nullable: true} )
    getDeveloper(
        @Args({name: "id", type: () => String}) id:string
    ):typeDeveloper{
        return data.find(developer => developer.id === id)
    }

    @Query( type => [Developer], {nullable:true})
    getDevelopers():typeDeveloper[]{
        console.log(data)
        return data
    }

    @Mutation( returns => Developer, { nullable: true})
    setDeveloper(
        @Args({name: "nombre", type: () => String}) nombre:string,
        @Args({name: "email", type: () => String}) email:string,
        @Args({name: "proyectos", type: () => [ProyectoDto], nullable: true}) proyectos:typeProyecto[] = null,
        @Args({name: "roles", type: () => [EspecialidadDto], nullable: true}) roles: typeEspecialidad[]
    ):typeDeveloper{
        let develorper:typeDeveloper ={
            id:v1(),
            nombre,
            email,
            proyectos: (proyectos!==null)? proyectos : null,
            roles
        }
        data.push(develorper)
        return develorper
    }


}
