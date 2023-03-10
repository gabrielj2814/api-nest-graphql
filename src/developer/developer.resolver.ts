import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';
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
import { validaciones } from 'src/utils/validaciones';
import Proyecto from 'src/models/proyecto.model';
import DeveloperDto from 'src/dto/developer.dto';

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
        @Args({name: "proyectos", type: () => [ProyectoDto], nullable: true}) proyectos:typeProyecto[],
        @Args({name: "roles", type: () => [EspecialidadDto]}) roles: typeEspecialidad[]
    ):typeDeveloper{
        if(validaciones.validarCadenaVacia(validaciones.eliminarEspaciosEnBlanco(nombre))){
            throw new UserInputError("el argumento nombre no puede ser vacio", {
                invalidArgs:"nombre"
            })
        }
        if(validaciones.validarCadenaVacia(validaciones.eliminarEspaciosEnBlanco(email))){
            throw new UserInputError("el argumento email no puede ser vacio", {
                invalidArgs:"email"
            })
        }
        if(validaciones.validarCorreo(email)){
            throw new UserInputError("el argumento email es invalido", {
                invalidArgs:"email"
            })
        }
        if(roles.length===0){
            throw new UserInputError("el argumento roles no pudes ser vacio tiene que almenos pasar uno", {
                invalidArgs:"roles"
            })
        }
        let develorper:typeDeveloper ={
            id:v1(),
            nombre,
            email,
            proyectos: (proyectos===undefined)?[]:proyectos,
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

    @Mutation( returns => [Proyecto])
    asignacionProyectoHaDev(
        @Args({name:"idDeveloper", type: () => String}) idDeveloper:string,
        @Args({name:"proyectos", type: () => [ProyectoDto]}) proyectos:typeProyecto[],
    ):typeProyecto[]{
        let developer:typeDeveloper= data.find(developerBusqueda => developerBusqueda.id===idDeveloper) 
        if(developer!==undefined){
            proyectos=this.removerProyectosYaAsignados(proyectos,idDeveloper,data)
            let proyectosDeveloper:typeProyecto[]=[]
            let proyectosRechazados:typeProyecto[]=[]
            // aqui se hace la validacion para verificar que proyectos que se intentan asignar al desarrollador cumplas con los roles que tenga asignados
            for( let rolDeveloper of  developer.roles){
                proyectos.forEach(proyecto => {
                    let busquedaRol:typeEspecialidad= proyecto.roles.find( rolProyecto => rolProyecto.id===rolDeveloper.id)
                    if(busquedaRol!==undefined){
                        if(proyectosDeveloper.find( proyectoDeveloper => proyectoDeveloper.id===proyecto.id)===undefined){
                            proyectosDeveloper.push(proyecto)
                        }
                    }
                });
            }
            // asignacion de los proyectos al desarrollador
            for (let index = 0; index < data.length; index++) {
                if(data[index].id===idDeveloper){
                    if(data[index].proyectos===undefined){
                        data[index].proyectos=[]
                    }
                    data[index].proyectos=[...data[index].proyectos, ...proyectosDeveloper]
                    // console.log("data =>",data[index].proyectos) 
                    
                }
            }
    
            return proyectosDeveloper
        }
        else{
            throw new UserInputError("el desarrollador no a sido encontrado")
        }
    }

    removerProyectosYaAsignados(proyectos:typeProyecto[],idDeveloper:string,data:typeDeveloper[]):typeProyecto[]{
        let developer:typeDeveloper = data.find(developerBusqueda => developerBusqueda.id === idDeveloper)
        for (const proyecto of developer.proyectos) {
            proyectos=proyectos.filter(pro => pro.id!==proyecto.id)
        }
        return proyectos
    }


}
