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
import { Status } from 'src/proyecto/enum/status';

let data:typeDeveloper[]=[
    {
        id:"e141cc00-8e10-11ed-8c1c-9b2266fb0f10",
        nombre:"dev a",
        email:"dev_a_@gmail.com",
        proyectos: [
            {
                id:"89636e20-8e0c-11ed-9a02-6521732c74d9",
                nombre:"Proyecto A",
                descripcion:"descripcion proyecto A",
                status:Status.ACTIVO,
                roles:[
                    {
                        "id": "438dea50-8e08-11ed-9b3c-bd0785885400",
                        "nombre": "backend java"
                    }
        
                ]
            }
        ],
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
        proyectos: [
            {
                id:"89636e21-8e0c-11ed-9a02-6521732c74d9",
                nombre:"Proyecto B",
                descripcion:"descripcion proyecto B",
                status:Status.ACTIVO,
                roles:[
                    {
                        "id": "438dea51-8e08-11ed-9b3c-bd0785885400",
                        "nombre": "backend php"
                    }
                ]
            }
        ],
        roles:[
            {
                "id": "438dea51-8e08-11ed-9b3c-bd0785885400",
                "nombre": "backend php"
            }
        ]
    },
]

// TODO: valiar email, texto en blanco y etc...
// TODO: asignar proyectos a developers con su validacion de rol

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

    @Query( type => [Developer])
    getDevelopersPorRolYProyecto(
        @Args({name: "rol", type: () => EspecialidadDto}) rol:typeEspecialidad,
        @Args({name: "idProyecto", type: () => String}) idProyecto:string
    ): typeDeveloper[]{
        let developersFiltradosPorRol:typeDeveloper[]=[]
        let developersFiltradosPorProyecto:typeDeveloper[]=[]
        // filtrados por rol
        for (const developer of data) {
            let rolDeveloper=developer.roles.find(rolDev => rolDev.id===rol.id)
            if(rolDeveloper!==undefined){
                developersFiltradosPorRol.push(developer)
            }
        }
        // filtrados por proyecto
        for (const developer2 of developersFiltradosPorRol) {
            let ProyectosDev = developer2.proyectos.find( proyecto => proyecto.id===idProyecto )
            if(ProyectosDev!==undefined){
                developersFiltradosPorProyecto.push(developer2)
            }
        }
        return developersFiltradosPorProyecto
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
