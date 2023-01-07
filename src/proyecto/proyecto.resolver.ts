import { Resolver, Query, Mutation, Args , Int} from '@nestjs/graphql';
// modelo
import Proyecto from 'src/models/proyecto.model';
// interfaces
import typeEspecialidad from 'src/especialidad/interfaces/types/especialidad';
import typeProyecto from 'src/proyecto/interfaces/types/proyecto';
import typeDeveloper from 'src/developer/interfaces/types/developer';
// DTO
import ProyectoDto from '../dto/proyecto.dto';
import EspecialidadDto from 'src/dto/especialidad.dto';
// Utilidades
import {v1} from "uuid"
import { Status } from './enum/status';
import DeveloperDto from 'src/dto/developer.dto';
import Developer from 'src/models/developer.model';

let data:typeProyecto[] = [
    {
        id:"89636e20-8e0c-11ed-9a02-6521732c74d9",
        nombre:"Proyecto A",
        descripcion:"descripcion proyecto A",
        status:Status.ACTIVO,
        developers:[],
        roles:[
            {
                "id": "438dea50-8e08-11ed-9b3c-bd0785885400",
                "nombre": "backend java"
            },

        ]
    },
    {
        id:"89636e21-8e0c-11ed-9a02-6521732c74d9",
        nombre:"Proyecto B",
        descripcion:"descripcion proyecto B",
        status:Status.ACTIVO,
        developers:[],
        roles:[
            {
                "id": "438dea51-8e08-11ed-9b3c-bd0785885400",
                "nombre": "backend php"
            },
        ]
    },
]

// TODO: listar proyectos por roles y status
// TODO: validar argumentos
// TODO: Mostar alerta de error en el caso de que un developer no cumplas con los requerimientos del proyecto

@Resolver()
export class ProyectoResolver {


    @Query( type => [Proyecto], {nullable:true})
    getProyectos():typeProyecto[]{
        // console.log(data)
        return data
    }
    
    @Query( type => Proyecto)
    getProyecto(
        @Args({name:"id", type: () => Int}) id:string
    ):typeProyecto{
        return data.find(proyecto => proyecto.id===id)
    }
    
    @Query( type => [Proyecto])
    getProyectosPorRolesYStatus(
        @Args({name:"roles", type: () => [EspecialidadDto]}) roles:typeEspecialidad[],
        @Args({name:"status", type: () => Int}) status:number
    ):typeProyecto[]{
        let proyectos={}
        let resultados:typeProyecto[]=[]
        let proyectosFiltradoPorEstado:typeProyecto[]= data.filter( proyecto => proyecto.status===status)
        for (const rolFiltro of roles) {
            console.log(rolFiltro.nombre)
            proyectosFiltradoPorEstado.forEach(proyecto => {
                proyecto.roles.forEach(rol => {
                    if(rol.id===rolFiltro.id){
                        proyectos[proyecto.id]=proyecto
                    }
                })
            })
        }
        for (const key in proyectos) {
            resultados.push(proyectos[key])
        }
        // console.log("proyectos filtrador",resultados)
        return resultados
    }

    @Mutation( returns => Proyecto) // X
    setProyectos(
        @Args({name: "nombre", type: () => String}) nombre:string,
        @Args({name: "descripcion", type: () => String}) descripcion:string,
        @Args({name: "status", type: () => Int}) status:number,
        @Args({name: "developers", type: () => [DeveloperDto], nullable: true}) developers:typeDeveloper[],
        @Args({name: "roles", type: () => [EspecialidadDto]}) roles:typeEspecialidad[]
    ):typeProyecto{
        let proyecto:typeProyecto ={
            id:v1(),
            nombre,
            descripcion,
            status:0,
            developers,
            roles,
        }
        proyecto.status=(status===Status.ACTIVO)?Status.ACTIVO:Status.INACTIVO
        data.push(proyecto)
        return proyecto
    }
    
    // @Mutation() // X
    // asignarRolHaProyecto()
    
    @Mutation( type => [Developer]) // X
    asignarDevHaProyecto(
        @Args({name: "idProyecto", type: () => String}) idProyecto:string,
        @Args({name: "developers", type: () => [DeveloperDto]}) developers:typeDeveloper[]
    ):typeDeveloper[]{
        let proyecto:typeProyecto= data.find( proyecto => proyecto.id===idProyecto)
        let developersProyecto:typeDeveloper[]=[]
        for( let rolProyecto of  proyecto.roles){
            developers.forEach(developer => {
                let busquedaRol:typeEspecialidad= developer.roles.find( rolDeveloper => rolDeveloper.id===rolProyecto.id)
                if(busquedaRol!==undefined){
                    developersProyecto.push(developer)
                }
        });
        }
        for (let index = 0; index < data.length; index++) {
            if(data[index].id===idProyecto){
                if(data[index].developers===undefined){
                    data[index].developers=[]
                }
                data[index].developers=[...data[index].developers, ...developersProyecto]
                // console.log(data[index]) 
            }
            
        }
        return developersProyecto
    }
}
