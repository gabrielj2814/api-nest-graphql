import { Resolver, Query, Mutation, Args , Int} from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';
// modelo
import Proyecto from 'src/models/proyecto.model';
import Developer from 'src/models/developer.model';
// interfaces
import typeEspecialidad from 'src/especialidad/interfaces/types/especialidad';
import typeProyecto from 'src/proyecto/interfaces/types/proyecto';
import typeDeveloper from 'src/developer/interfaces/types/developer';
// DTO
import ProyectoDto from '../dto/proyecto.dto';
import EspecialidadDto from 'src/dto/especialidad.dto';
import DeveloperDto from 'src/dto/developer.dto';
// Utilidades
import {v1} from "uuid"
import { Status } from './enum/status';
import { validaciones } from 'src/utils/validaciones';

let data:typeProyecto[] = [
    {
        id:"89636e20-8e0c-11ed-9a02-6521732c74d9",
        nombre:"Proyecto A",
        descripcion:"descripcion proyecto A",
        status:Status.ACTIVO,
        developers:[
            {
                id:"e141cc00-8e10-11ed-8c1c-9b2266fb0f10",
                nombre:"dev a",
                email:"dev_a_@gmail.com",
                roles:[
                    {
                        "id": "438dea50-8e08-11ed-9b3c-bd0785885400",
                        "nombre": "backend java"
                    },
                ]
            },
        ],
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
        developers:[
            {
                id:"e141cc01-8e10-11ed-8c1c-9b2266fb0f10",
                nombre:"dev b",
                email:"dev_b_@gmail.com",
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
            },
        ]
    },
]

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
        // filtrado por estado
        let proyectosFiltradoPorEstado:typeProyecto[]= data.filter( proyecto => proyecto.status===status)
        // filtrado por roles
        for (const rolFiltro of roles) {
            console.log(rolFiltro.nombre)
            proyectosFiltradoPorEstado.forEach(proyecto => {
                proyecto.roles.forEach(rol => {
                    if(rol.id===rolFiltro.id){
                        if(proyectos[proyecto.id]){
                            proyectos[proyecto.id]=proyectos[proyecto.id]+1
                        }
                        else{
                            proyectos[proyecto.id]=1
                        }
                        
                    }
                })
            })
        }
        for (const key in proyectos) {
            if(proyectos[key]===roles.length){
                resultados.push(data.find(pro => pro.id===key))
            }
            
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
        if(validaciones.validarCadenaVacia(validaciones.eliminarEspaciosEnBlanco(nombre))){
            throw new UserInputError("el argumento nombre no puede ser vacio", {
                invalidArgs:"nombre"
            })
        }
        if(validaciones.validarCadenaVacia(validaciones.eliminarEspaciosEnBlanco(descripcion))){
            throw new UserInputError("el argumento descripcion no puede ser vacio", {
                invalidArgs:"descripcion"
            })
        }
        if( status!==Status.ACTIVO && status!==Status.INACTIVO){
            throw new UserInputError("el argumento status es invalido sole se pueden aceptar los valores 1 o 0", {
                invalidArgs:"status"
            })
        }
        if(roles.length===0){
            throw new UserInputError("el argumento roles no pudes ser vacio tiene que almenos pasar uno", {
                invalidArgs:"roles"
            })
        }
        let proyecto:typeProyecto ={
            id:v1(),
            nombre,
            descripcion,
            status:0,
            developers:(developers===undefined)?[]:developers,
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
        if(proyecto!==undefined){
            developers=this.removerDeveloperYaAsignados(developers,idProyecto,data)
            let developersProyecto:typeDeveloper[]=[]
            let developerRechazados:typeDeveloper[]=[]
            // aqui se hace la validacion para verificar que desarroladores que se intentan asignar al proyecto cumplas con los roles que tenga asignados
            for( let rolProyecto of  proyecto.roles){
                developers.forEach(developer => {
                    let busquedaRol:typeEspecialidad= developer.roles.find( rolDeveloper => rolDeveloper.id===rolProyecto.id)
                    if(busquedaRol!==undefined){
                        if(developersProyecto.find( developerProyecto => developerProyecto.id===developer.id)===undefined){
                            developersProyecto.push(developer)
                        }
                    }
                });
            }
            // asignacion de los desarrolladores al proyecto
            for (let index = 0; index < data.length; index++) {
                if(data[index].id===idProyecto){
                    if(data[index].developers===undefined){
                        data[index].developers=[]
                    }
                    data[index].developers=[...data[index].developers, ...developersProyecto]
                    // console.log("data =>",data[index].developers) 
                    
                }
            }
            
            // console.log("data",data[0])
            developerRechazados=[...developers]
            for (const developerProyecto of developersProyecto) {
                developerRechazados=developerRechazados.filter(developerRechazado => developerRechazado.id!==developerProyecto.id)
            }
            // console.log("developers rechazados",developerRechazados)
            if(developerRechazados.length>=1){
                throw new UserInputError("los desarroladores que fueron rechazados", {
                    developers:developerRechazados
                })
            }
            return developersProyecto
        }
        else{
            throw new UserInputError("el proyecto no a sido encontrado")
        }
    }

    removerDeveloperYaAsignados(developers:typeDeveloper[],idProyecto:string,data:typeProyecto[]):typeDeveloper[]{
        let proyecto:typeProyecto = data.find(proyectoBusqueda => proyectoBusqueda.id === idProyecto)
        // if(proyecto.developers===undefined){
        //     proyecto.developers=[]
        // }
        for (const developer of proyecto.developers) {
            developers=developers.filter(dev => dev.id!==developer.id)
        }
        return developers
    }
}
