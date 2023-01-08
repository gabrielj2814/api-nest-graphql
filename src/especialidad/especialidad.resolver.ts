import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
// tipos
import typeEspecialidad from './interfaces/types/especialidad';
// modelos
import Especialidad from "../models/especialidad.model"
// Utilidades
import { v1 } from "uuid"
import { validaciones } from 'src/utils/validaciones';
import { UserInputError } from 'apollo-server-express';


let data: typeEspecialidad[] = [
    {
        "id": "438dea50-8e08-11ed-9b3c-bd0785885400",
        "nombre": "backend java"
    },
    {
        "id": "438dea51-8e08-11ed-9b3c-bd0785885400",
        "nombre": "backend php"
    },
    {
        "id": "438dea52-8e08-11ed-9b3c-bd0785885400",
        "nombre": "backend node typescript"
    },
    {
        "id": "438dea53-8e08-11ed-9b3c-bd0785885400",
        "nombre": "backend node javascript"
    },
    {
        "id": "438dea54-8e08-11ed-9b3c-bd0785885400",
        "nombre": "frontend react"
    },
    {
        "id": "438dea55-8e08-11ed-9b3c-bd0785885400",
        "nombre": "frontend vue"
    },
    {
        "id": "438dea56-8e08-11ed-9b3c-bd0785885400",
        "nombre": "frontend angular"
    },
    {
        "id": "438dea57-8e08-11ed-9b3c-bd0785885400",
        "nombre": "postgresql"
    },
    {
        "id": "438dea58-8e08-11ed-9b3c-bd0785885400",
        "nombre": "Mysql"
    },
    {
        "id": "438e1160-8e08-11ed-9b3c-bd0785885400",
        "nombre": "MongoDB"
    },
    {
        "id": "438e1161-8e08-11ed-9b3c-bd0785885400",
        "nombre": "DevOps"
    }
]


@Resolver()
export class EspecialidadResolver {


    @Query(type => [Especialidad])
    getEspecialidades(): typeEspecialidad[] {
        return data
    }

    @Query(type => Especialidad, { nullable: true })
    getEspecialidad(@Args({ name: "id" }) id: string): typeEspecialidad {
        return data.find(especialidad => especialidad.id === id)
    }

    @Mutation(returns => Especialidad)
    setEspecialidad(
        @Args({ name: "nombre", type: () => String }) nombre: string
    ): typeEspecialidad {
        if(validaciones.validarCadenaVacia(validaciones.eliminarEspaciosEnBlanco(nombre))){
            throw new UserInputError("el argumento nombre no puedes ser vacio", {
                invalidArgs:"nombre"
            })
        }
        else{
            let especialidad: typeEspecialidad = {
                id: v1(),
                nombre: nombre
            }
            data.push(especialidad)
            return especialidad
        }

    }

    @Mutation(returns => Especialidad, { nullable: true })
    eliminarEspecialidad(
        @Args({ name: "id", type: () => String }) id: string
    ): typeEspecialidad {
        if (!data.find(especialidad => especialidad.id === id))
            return null
        let elementoHaEliminar = data.find(especialidad => especialidad.id === id)
        let dataNueva = data.filter(especialidad => especialidad.id !== elementoHaEliminar.id)
        data = dataNueva
        return elementoHaEliminar
    }


}
