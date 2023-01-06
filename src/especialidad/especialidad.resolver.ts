import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import {v1} from "uuid"

import typeEspecialidad from './interfaces/types/especialidad';
import Especialidad from "../models/especialidad.model" 


let data: typeEspecialidad[]=[
    {
        id:v1(),
        nombre:"backend java"
    },
    {
        id:v1(),
        nombre:"backend php"
    },
    {
        id:v1(),
        nombre:"backend node typescript"
    },
    {
        id:v1(),
        nombre:"backend node javascript"
    },
    {
        id:v1(),
        nombre:"frontend react"
    },
    {
        id:v1(),
        nombre:"frontend vue"
    },
    {
        id:v1(),
        nombre:"frontend angular"
    },
    {
        id:v1(),
        nombre:"postgresql"
    },
    {
        id:v1(),
        nombre:"Mysql"
    },
    {
        id:v1(),
        nombre:"MongoDB"
    },
    {
        id:v1(),
        nombre:"DevOps"
    },
]

@Resolver()
export class EspecialidadResolver {


    @Query(type => [Especialidad])
    getEspecialidades():typeEspecialidad[]{
        return data
    }

    @Query( type => Especialidad, {nullable: true})
    getEspecialidad(@Args({name: "id"}) id: string):typeEspecialidad{
        return data.find(especialidad => especialidad.id === id)
    }

    @Mutation( returns => Especialidad)
    setEspecialidad(
        @Args({name: "nombre", type: () => String}) nombre: string
        ):typeEspecialidad {
        let especialidad:typeEspecialidad ={
            id:v1(),
            nombre: nombre
        }
        data.push(especialidad)
        return especialidad
    }

    @Mutation(returns => Especialidad, { nullable: true })
    editarEspecialidad(
        @Args({name:"nombre", type: () => String}) nombre:string,
        @Args({name:"id", type: () => String}) id:string,
    ):typeEspecialidad{
        if(!data.find(especialidad => especialidad.id === id)){
            return null
        }
        data = data.map((especialidad) => {
            if(especialidad.id===id){
                especialidad.nombre= nombre
            }
            return especialidad
        })
        return data.find(especialidad => especialidad.id === id)
    }

    @Mutation( returns => Especialidad, { nullable:true } )
    eliminarEspecialidad(
        @Args({name:"id", type: () => String}) id: string
    ):typeEspecialidad{
        if(!data.find(especialidad => especialidad.id === id))
            return null
        let elementoHaEliminar =  data.find(especialidad => especialidad.id === id)
        let dataNueva = data.filter(especialidad => especialidad.id!==elementoHaEliminar.id)
        data= dataNueva
        return elementoHaEliminar
    }


}
