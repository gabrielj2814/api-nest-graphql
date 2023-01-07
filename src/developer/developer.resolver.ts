import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
// modelo
import Developer from 'src/models/developer.model';
// interfaces
import typeEspecialidad from 'src/especialidad/interfaces/types/especialidad';
import typeProyecto from 'src/proyecto/interfaces/types/proyecto';
import typeDeveloper from './interfaces/types/developer';
// DTO
import ProyectoDto from '../dto/proyecto.dto';
import EspecialidadDto from 'src/dto/especialidad.dto';
// Utilidades
import {v1} from "uuid"

let data:typeDeveloper[]=[
    {
        id:"e141cc00-8e10-11ed-8c1c-9b2266fb0f10",
        nombre:"dev a",
        email:"dev_a_@gmail.com",
        proyectos: [],
        roles:[
            {
                "id": "438dea50-8e08-11ed-9b3c-bd0785885400",
                "nombre": "backend java"
            },
        ]
    },
    {
        id:"e141cc01-8e10-11ed-8c1c-9b2266fb0f10",
        nombre:"dev b",
        email:"dev_b_@gmail.com",
        proyectos: [],
        roles:[
            {
                "id": "438dea51-8e08-11ed-9b3c-bd0785885400",
                "nombre": "backend php"
            }
        ]
    },
]

// TODO: valiar email, texto en blanco y etc...

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
        return data
    }

    @Mutation( returns => Developer, { nullable: true})
    setDeveloper(
        @Args({name: "nombre", type: () => String}) nombre:string,
        @Args({name: "email", type: () => String}) email:string,
        @Args({name: "proyectos", type: () => [ProyectoDto], nullable: true}) proyectos:typeProyecto[] = null,
        @Args({name: "roles", type: () => [EspecialidadDto]}) roles: typeEspecialidad[]
    ):typeDeveloper{
        let develorper:typeDeveloper ={
            id:v1(),
            nombre,
            email,
            proyectos: (proyectos!==null)?proyectos:null,
            roles
        }
        data.push(develorper)
        return develorper
    }

    @Mutation( returns => Developer, {nullable: true})
    eliminarDeveloper(
        @Args({name:"id", type: () => String}) id:string
    ):typeDeveloper{
        let developer:typeDeveloper = data.find(developer => developer.id===id)
        data= data.filter(developer => developer.id!==id)
        return developer
    }


}
