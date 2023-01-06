import { join } from 'path';
import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql"
import { ApolloDriver } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { EspecialidadModule } from './especialidad/especialidad.module';
import { DeveloperModule } from './developer/developer.module';
import { ProyectoModule } from './proyecto/proyecto.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver:ApolloDriver,
      playground:false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins:[
        ApolloServerPluginLandingPageLocalDefault
      ]
    }),
    EspecialidadModule,
    DeveloperModule,
    ProyectoModule
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
